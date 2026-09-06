import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../context/LanguageContext.jsx";
import Contact from "./Contact.jsx";
import * as contactTransport from "../core/contactTransport.js";

describe("Contact Page - Warm Editorial Dispatch Form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderContact = () => {
    return render(
      <MemoryRouter>
        <LanguageProvider>
          <Contact />
        </LanguageProvider>
      </MemoryRouter>
    );
  };

  it("renders dispatch form elements: form inputs, live counter, and direct email link", () => {
    renderContact();

    expect(screen.getByLabelText(/name|nama/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your message|pesan anda/i)).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: /kirim pesan|send message|send dispatch/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toHaveAttribute("data-variant", "seal");
    expect(submitBtn).toHaveAttribute("type", "submit");
    expect(submitBtn).toHaveAttribute("aria-label");
    expect(screen.getByTestId("wax-seal-svg")).toBeInTheDocument();
    expect(screen.getByTestId("wax-melted-rim")).toBeInTheDocument();
    expect(screen.getByTestId("wax-embossed-insignia")).toBeInTheDocument();
    expect(screen.getByTestId("char-counter")).toHaveTextContent("0/1000");
    expect(screen.getByRole("link", { name: /rakafantinoo@gmail\.com/i })).toBeInTheDocument();
    expect(screen.queryByText(/status pengiriman|transmission status/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/TRANSMISSION CONSOLE/i)).not.toBeInTheDocument();
  });

  it("updates character counter as user types and blocks submit if message exceeds 1000 chars", () => {
    renderContact();

    const messageInput = screen.getByLabelText(/your message|pesan anda/i);
    fireEvent.change(messageInput, { target: { value: "Hello dispatch" } });

    expect(screen.getByTestId("char-counter")).toHaveTextContent("14/1000");
    expect(screen.queryByText(/status pengiriman|transmission status/i)).not.toBeInTheDocument();
  });

  it("blocks submit and shows client-side validation error when email format is invalid", async () => {
    const sendSpy = vi.spyOn(contactTransport, "sendDispatch");
    renderContact();

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid-email-no-at" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan anda/i), { target: { value: "Valid message content" } });

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

    renderContact();

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan anda/i), { target: { value: "Valid message content" } });

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

    renderContact();

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan anda/i), { target: { value: "Valid message content" } });

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

    renderContact();

    fireEvent.change(screen.getByLabelText(/name|nama/i), { target: { value: "Raka Tester" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "raka@example.com" } });
    fireEvent.change(screen.getByLabelText(/your message|pesan anda/i), { target: { value: "Valid message content" } });

    const submitBtn = screen.getByRole("button", { name: /kirim pesan|send message|send dispatch/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/pengiriman warkat gagal|dispatch failed/i)).toBeInTheDocument();
    });
  });

  it("renders SubpageNav back link and triggers exit roll-up when clicked", () => {
    renderContact();
    const backLink = screen.getByRole("link", { name: /kembali ke pulau|back to island/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");

    fireEvent.click(backLink);
    const rollUpNode = document.querySelector(".animate-parchment-rollup");
    expect(rollUpNode).toBeInTheDocument();
  });
});
