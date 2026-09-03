import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "./Contact.jsx";
import * as contactTransport from "../core/contactTransport.js";

describe("Contact Page - Dispatch Terminal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dispatch terminal elements: form inputs, live counter, and transmission console", () => {
    render(<Contact />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your message|message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send dispatch|send message/i })).toBeInTheDocument();
    expect(screen.getByTestId("char-counter")).toHaveTextContent("0/1000");
    expect(screen.getByText(/TRANSMISSION CONSOLE/i)).toBeInTheDocument();
    expect(screen.getByText(/AWAITING INPUT/i)).toBeInTheDocument();
  });

  it("updates character counter as user types and blocks submit if message exceeds 1000 chars", () => {
    render(<Contact />);

    const messageInput = screen.getByLabelText(/your message|message/i);
    fireEvent.change(messageInput, { target: { value: "Hello dispatch" } });

    expect(screen.getByTestId("char-counter")).toHaveTextContent("14/1000");
    expect(screen.getByText(/ENCODING/i)).toBeInTheDocument();
  });

  it("blocks submit and shows client-side validation error when email format is invalid", async () => {
    const sendSpy = vi.spyOn(contactTransport, "sendDispatch");
    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid-email-no-at" } });
    fireEvent.change(screen.getByLabelText(/your message|message/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /send dispatch|send message/i });
    fireEvent.click(submitBtn);

    expect(sendSpy).not.toHaveBeenCalled();
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  it("submits safely in mock mode when keys are missing and displays delivered telemetry", async () => {
    const sendSpy = vi.spyOn(contactTransport, "sendDispatch").mockResolvedValue({
      status: "mock-sent",
      mode: "mock",
    });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|message/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /send dispatch|send message/i });
    fireEvent.click(submitBtn);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText(/STATUS 200: TRANSMISSION DELIVERED/i)).toBeInTheDocument();
    });
  });

  it("throttles rapid duplicate submissions within 3 seconds", async () => {
    const sendSpy = vi.spyOn(contactTransport, "sendDispatch").mockResolvedValue({
      status: "mock-sent",
      mode: "mock",
    });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|message/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /send dispatch|send message/i });
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(sendSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("handles transmission failure gracefully with corrected alert spelling", async () => {
    vi.spyOn(contactTransport, "sendDispatch").mockRejectedValue(new Error("Server offline"));

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|message/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /send dispatch|send message/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/I didn't receive your message\./i)).toBeInTheDocument();
      expect(screen.getByText(/TRANSMISSION FAILED — RETRY/i)).toBeInTheDocument();
    });
  });
});
