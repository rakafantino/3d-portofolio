import { describe, it, expect, vi, beforeEach } from "vitest";
import { isEmailJsConfigured, sendDispatch } from "./contactTransport.js";

describe("contactTransport", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  describe("isEmailJsConfigured", () => {
    it("reports configured when all three env keys present and non-empty", () => {
      const env = {
        VITE_APP_EMAILJS_SERVICE_ID: "service_123",
        VITE_APP_EMAILJS_TEMPLATE_ID: "template_456",
        VITE_APP_EMAILJS_PUBLIC_KEY: "public_789",
      };
      expect(isEmailJsConfigured(env)).toBe(true);
    });

    it("reports unconfigured when any key missing or empty", () => {
      expect(isEmailJsConfigured(undefined)).toBe(false);
      expect(isEmailJsConfigured({})).toBe(false);
      expect(
        isEmailJsConfigured({
          VITE_APP_EMAILJS_SERVICE_ID: "service_123",
          VITE_APP_EMAILJS_TEMPLATE_ID: "",
          VITE_APP_EMAILJS_PUBLIC_KEY: "public_789",
        })
      ).toBe(false);
      expect(
        isEmailJsConfigured({
          VITE_APP_EMAILJS_SERVICE_ID: "   ",
          VITE_APP_EMAILJS_TEMPLATE_ID: "template_456",
          VITE_APP_EMAILJS_PUBLIC_KEY: "public_789",
        })
      ).toBe(false);
      expect(
        isEmailJsConfigured({
          VITE_APP_EMAILJS_SERVICE_ID: "service_123",
          VITE_APP_EMAILJS_TEMPLATE_ID: "template_456",
        })
      ).toBe(false);
    });
  });

  describe("sendDispatch", () => {
    it("mock mode resolves mock-sent without importing emailjs when unconfigured", async () => {
      const payload = {
        from_name: "Alice",
        to_name: "Raka",
        from_email: "alice@example.com",
        to_email: "rakafantinoo@gmail.com",
        message: "Hello world dispatch",
      };

      const result = await sendDispatch({ env: {}, payload, mockLatencyMs: 10 });
      expect(result).toEqual({
        status: "mock-sent",
        mode: "mock",
      });
    });

    it("emailjs mode maps successful send to status sent", async () => {
      const mockSend = vi.fn().mockResolvedValue({ status: 200, text: "OK" });
      vi.doMock("@emailjs/browser", () => ({
        default: {
          send: mockSend,
        },
      }));

      // Re-import module to pick up doMock
      const { sendDispatch: freshSendDispatch } = await import("./contactTransport.js");

      const env = {
        VITE_APP_EMAILJS_SERVICE_ID: "service_real",
        VITE_APP_EMAILJS_TEMPLATE_ID: "template_real",
        VITE_APP_EMAILJS_PUBLIC_KEY: "public_real",
      };
      const payload = {
        from_name: "Bob",
        to_name: "Raka",
        from_email: "bob@example.com",
        to_email: "rakafantinoo@gmail.com",
        message: "Real dispatch message",
      };

      const result = await freshSendDispatch({ env, payload });
      expect(result).toEqual({
        status: "sent",
        mode: "emailjs",
      });
      expect(mockSend).toHaveBeenCalledWith(
        "service_real",
        "template_real",
        payload,
        "public_real"
      );
    });

    it("emailjs failure propagates rejection for the shell to handle", async () => {
      const mockSend = vi.fn().mockRejectedValue(new Error("EmailJS Network Error"));
      vi.doMock("@emailjs/browser", () => ({
        default: {
          send: mockSend,
        },
      }));

      const { sendDispatch: freshSendDispatch } = await import("./contactTransport.js");

      const env = {
        VITE_APP_EMAILJS_SERVICE_ID: "service_real",
        VITE_APP_EMAILJS_TEMPLATE_ID: "template_real",
        VITE_APP_EMAILJS_PUBLIC_KEY: "public_real",
      };
      const payload = {
        from_name: "Charlie",
        to_name: "Raka",
        from_email: "charlie@example.com",
        to_email: "rakafantinoo@gmail.com",
        message: "Failed message",
      };

      await expect(freshSendDispatch({ env, payload })).rejects.toThrow("EmailJS Network Error");
    });
  });
});
