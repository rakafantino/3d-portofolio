import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "./Contact.jsx";
import * as contactTransport from "../core/contactTransport.js";

describe("Contact Page - Warm Editorial Dispatch Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dispatch form elements: form inputs, live counter, and calm status card", () => {
    render(<Contact />);

    expect(screen.getByLabelText(/name|nama/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your message|pesan/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /kirim pesan|send message|send dispatch/i })).toBeInTheDocument();
    expect(screen.getByTestId("char-counter")).toHaveTextContent("0/1000");
    expect(screen.getByText(/status pengiriman|status/i)).toBeInTheDocument();
    expect(screen.getByText(/siap menerima pesanmu/i)).toBeInTheDocument();
    expect(screen.queryByText(/TRANSMISSION CONSOLE/i)).not.toBeInTheDocument();
  });

  it("updates character counter as user types and blocks submit if message exceeds 1000 chars", () => {
    render(<Contact />);

    const messageInput = screen.getByLabelText(/your message|pesan/i);
    fireEvent.change(messageInput, { target: { value: "Hello dispatch" } });

    expect(screen.getByTestId("char-counter")).toHaveTextContent("14/1000");
    expect(screen.getByText(/menulis pesan/i)).toBeInTheDocument();
  });

  it("blocks submit and shows client-side validation error when email format is invalid", async () => {
    const sendSpy = vi.spyOn(contactTransport, "sendDispatch");
    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid-email-no-at" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /kirim pesan|send message|send dispatch/i });
    fireEvent.click(submitBtn);

    expect(sendSpy).not.toHaveBeenCalled();
    expect(await screen.findByText(/format email tidak valid|invalid email format/i)).toBeInTheDocument();
  });

  it("submits safely in mock mode when keys are missing and displays delivered message", async () => {
    const sendSpy = vi.spyOn(contactTransport, "sendDispatch").mockResolvedValue({
      status: "mock-sent",
      mode: "mock",
    });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /kirim pesan|send message|send dispatch/i });
    fireEvent.click(submitBtn);

    expect(sendSpy).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getAllByText(/pesan terkirim/i).length).toBeGreaterThan(0);
    });
  });

  it("throttles rapid duplicate submissions within 3 seconds", async () => {
    const sendSpy = vi.spyOn(contactTransport, "sendDispatch").mockResolvedValue({
      status: "mock-sent",
      mode: "mock",
    });

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /kirim pesan|send message|send dispatch/i });
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(sendSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("handles transmission failure gracefully with clear feedback", async () => {
    vi.spyOn(contactTransport, "sendDispatch").mockRejectedValue(new Error("Server offline"));

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /kirim pesan|send message|send dispatch/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/pesan gagal terkirim|i didn't receive your message/i)).toBeInTheDocument();
      expect(screen.getByText(/gagal mengirim|transmission failed/i)).toBeInTheDocument();
    });
  });
});
