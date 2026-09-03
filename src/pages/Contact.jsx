import { useState, useRef } from "react";
import useAlert from "../hooks/useAlert.js";
import Alert from "../components/Alert.jsx";
import { sendDispatch } from "../core/contactTransport.js";

const MAX_MESSAGE_LENGTH = 1000;
const THROTTLE_WINDOW_MS = 3000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [terminalState, setTerminalState] = useState({
    statusText: "AWAITING INPUT",
    stateType: "idle", // idle | typing | transmitting | success | error
    lines: [
      "SYSTEM READY // PROTOCOL: DISPATCH-TCP",
      "SECURE CARRIER DETECTED: READY",
    ],
  });

  const lastSubmitTimestampRef = useRef(0);
  const { alert, showAlert, hideAlert } = useAlert();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    const hasAnyContent = Boolean(
      nextForm.name.trim() || nextForm.email.trim() || nextForm.message.trim()
    );

    if (hasAnyContent && terminalState.stateType !== "transmitting") {
      const charTotal = nextForm.name.length + nextForm.email.length + nextForm.message.length;
      setTerminalState((prev) => ({
        ...prev,
        statusText: `ENCODING (${charTotal} BYTES BUFFERED)`,
        stateType: "typing",
      }));
    } else if (!hasAnyContent && terminalState.stateType !== "transmitting") {
      setTerminalState((prev) => ({
        ...prev,
        statusText: "AWAITING INPUT",
        stateType: "idle",
      }));
    }
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = "Name identifier is required.";
    }

    if (!form.email.trim()) {
      errors.email = "Email endpoint is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = "Invalid email format.";
    }

    if (!form.message.trim()) {
      errors.message = "Transmission payload cannot be empty.";
    } else if (form.message.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Payload exceeds ${MAX_MESSAGE_LENGTH} characters.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTimestampRef.current < THROTTLE_WINDOW_MS) {
      return;
    }
    lastSubmitTimestampRef.current = now;

    if (!validateForm()) {
      setTerminalState((prev) => ({
        ...prev,
        statusText: "TRANSMISSION FAILED — RETRY",
        stateType: "error",
      }));
      return;
    }

    setIsTransmitting(true);
    setTerminalState({
      statusText: "TRANSMITTING...",
      stateType: "transmitting",
      lines: [
        "ENCODING DISPATCH PAYLOAD...",
        `TARGET: rakafantinoo@gmail.com`,
        `SOURCE: ${form.email}`,
        "INITIATING UPLINK HANDSHAKE...",
      ],
    });

    try {
      const payload = {
        from_name: form.name,
        to_name: "Raka",
        from_email: form.email,
        to_email: "rakafantinoo@gmail.com",
        message: form.message,
      };

      const result = await sendDispatch({
        env: import.meta.env,
        payload,
      });

      setIsTransmitting(false);
      const isMock = result.mode === "mock";
      setTerminalState({
        statusText: "STATUS 200: TRANSMISSION DELIVERED",
        stateType: "success",
        lines: [
          `UPLINK: CONFIRMED (${isMock ? "TELEMETRY MOCK ROUTE" : "EMAILJS GATEWAY"})`,
          "STATUS: 200 OK // ACK RECEIVED",
          "PACKET FLUSHED SUCCESSFULLY",
        ],
      });

      showAlert({
        show: true,
        text: isMock
          ? "Transmission delivered (Telemetry Mock Mode: simulation verified)."
          : "Message sent successfully!",
        type: "success",
      });

      setTimeout(() => {
        hideAlert();
        setForm({ name: "", email: "", message: "" });
        setTerminalState({
          statusText: "AWAITING INPUT",
          stateType: "idle",
          lines: [
            "SYSTEM READY // PROTOCOL: DISPATCH-TCP",
            "SECURE CARRIER DETECTED: READY",
          ],
        });
      }, 3500);
    } catch {
      setIsTransmitting(false);
      setTerminalState({
        statusText: "TRANSMISSION FAILED — RETRY",
        stateType: "error",
        lines: [
          "ERR: GATEWAY REJECTED PACKET",
          "STATUS: 502 BAD GATEWAY // RE-ROUTING REQUIRED",
          "ACTION: VERIFY CARRIER AND RESEND",
        ],
      });

      showAlert({
        show: true,
        text: "I didn't receive your message.",
        type: "danger",
      });
    }
  };

  const messageCount = form.message.length;
  const isMessageOverLimit = messageCount > MAX_MESSAGE_LENGTH;

  return (
    <section className="relative flex lg:flex-row flex-col max-container min-h-[100dvh] gap-8">
      {alert.show && <Alert {...alert} />}

      {/* Left Column: Dispatch Form */}
      <div className="flex-1 min-w-[50%] flex flex-col justify-start">
        <div className="flex items-center gap-3 mb-2">
          <span className="telemetry-badge text-blue-500 font-mono text-xs">
            PORT: 5173 // TERMINAL DISPATCH
          </span>
        </div>
        <h1 className="head-text">Dispatch Terminal</h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base font-normal">
          Send a direct uplink message. If transmission gateway keys are offline,
          safe telemetry mode catches your packet.
        </p>

        {/* Mobile keyboard-focus slim status strip (Rule 23) */}
        {isInputFocused && (
          <div className="lg:hidden mt-4 p-2.5 rounded border border-blue-200 bg-blue-50 text-blue-800 text-xs font-mono flex items-center justify-between">
            <span>TERMINAL STATUS:</span>
            <span className="font-semibold uppercase">{terminalState.statusText}</span>
          </div>
        )}

        <form className="w-full flex flex-col gap-6 mt-8" onSubmit={handleSubmit} noValidate>
          <label htmlFor="contact-name" className="text-black-500 font-semibold text-sm">
            Name Identifier
            <input
              id="contact-name"
              type="text"
              name="name"
              className={`input ${fieldErrors.name ? "border-red-500 focus:border-red-500" : ""}`}
              placeholder="e.g. Alex Vance"
              required
              value={form.name}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {fieldErrors.name && (
              <span className="text-xs text-red-500 font-mono mt-1 block">
                {fieldErrors.name}
              </span>
            )}
          </label>

          <label htmlFor="contact-email" className="text-black-500 font-semibold text-sm">
            Email Endpoint
            <input
              id="contact-email"
              type="email"
              name="email"
              className={`input ${fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
              placeholder="alex@example.com"
              required
              value={form.email}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {fieldErrors.email && (
              <span className="text-xs text-red-500 font-mono mt-1 block">
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label htmlFor="contact-message" className="text-black-500 font-semibold text-sm">
            <div className="flex justify-between items-center">
              <span>Your Message Payload</span>
              <span
                data-testid="char-counter"
                className={`text-xs font-mono ${
                  isMessageOverLimit ? "text-red-500 font-bold" : "text-slate-500"
                }`}
              >
                {messageCount}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <textarea
              id="contact-message"
              rows={5}
              name="message"
              className={`textarea ${
                fieldErrors.message || isMessageOverLimit ? "border-red-500 focus:border-red-500" : ""
              }`}
              placeholder="Transmit inquiry, collaboration brief, or system telemetry..."
              required
              value={form.message}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {fieldErrors.message && (
              <span className="text-xs text-red-500 font-mono mt-1 block">
                {fieldErrors.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            className="btn disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isTransmitting || isMessageOverLimit}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {isTransmitting ? "TRANSMITTING..." : "Send Dispatch"}
          </button>
        </form>
      </div>

      {/* Right Column: Decorative Transmission Console (no WebGL canvas) */}
      <div
        className={`lg:w-1/2 w-full flex-col justify-between terminal-card p-6 border border-slate-800 bg-[#0c1017] text-slate-200 font-mono rounded-xl shadow-2xl transition-all duration-200 ${
          isInputFocused ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="text-xs text-slate-400 font-mono ml-2 tracking-wider">
              TRANSMISSION CONSOLE v2.4
            </span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded font-mono uppercase tracking-wide ${
              terminalState.stateType === "success"
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : terminalState.stateType === "error"
                ? "bg-rose-950 text-rose-400 border border-rose-800"
                : terminalState.stateType === "transmitting"
                ? "bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {terminalState.stateType}
          </span>
        </div>

        <div className="flex-1 min-h-[220px] flex flex-col justify-between py-2 text-xs leading-relaxed">
          <div className="space-y-2 text-slate-300">
            {terminalState.lines.map((line, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 select-none">&gt;</span>
                <span>{line}</span>
              </p>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>STATUS LINE</span>
              <span>CARRIER: {import.meta.env?.VITE_APP_EMAILJS_SERVICE_ID ? "ONLINE" : "MOCK-LOCAL"}</span>
            </div>
            <div className="bg-black/60 p-3 rounded border border-slate-800 text-emerald-400 font-mono flex items-center justify-between">
              <span className="font-semibold text-xs tracking-wide">
                {terminalState.statusText}
              </span>
              <span className="w-2 h-4 bg-emerald-400 inline-block animate-pulse" />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 flex justify-between">
          <span>PACKET BUFFER: {messageCount}/1000</span>
          <span>LATENCY: ~800MS SIMULATED</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;
