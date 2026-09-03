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
    statusTitle: "Siap menerima pesanmu",
    statusDesc: "Formulir siap. Pesan akan diteruskan langsung ke kotak masuk email saya.",
    stateType: "idle",
  });

  const lastSubmitTimestampRef = useRef(0);
  const lastSendModeRef = useRef(null);
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
      setTerminalState({
        statusTitle: "Sedang menulis pesan",
        statusDesc: `${charTotal} karakter telah diketik dalam formulir.`,
        stateType: "typing",
      });
    } else if (!hasAnyContent && terminalState.stateType !== "transmitting") {
      setTerminalState({
        statusTitle: "Siap menerima pesanmu",
        statusDesc: "Formulir siap. Pesan akan diteruskan langsung ke kotak masuk email saya.",
        stateType: "idle",
      });
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
      errors.name = "Nama wajib diisi.";
    }

    if (!form.email.trim()) {
      errors.email = "Alamat email wajib diisi.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = "Format email tidak valid.";
    }

    if (!form.message.trim()) {
      errors.message = "Pesan tidak boleh kosong.";
    } else if (form.message.length > MAX_MESSAGE_LENGTH) {
      errors.message = `Pesan melebihi batas ${MAX_MESSAGE_LENGTH} karakter.`;
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
      setTerminalState({
        statusTitle: "Gagal mengirim pesan",
        statusDesc: "Mohon lengkapi dan perbaiki isian formulir di sebelah kiri.",
        stateType: "error",
      });
      return;
    }

    setIsTransmitting(true);
    setTerminalState({
      statusTitle: "Mengirim pesan…",
      statusDesc: "Menghubungkan ke gateway pengiriman email...",
      stateType: "transmitting",
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
      lastSendModeRef.current = result.mode;
      setTerminalState({
        statusTitle: "Pesan terkirim ✓",
        statusDesc: isMock
          ? "Pesan terkirim dalam mode simulasi demo terverifikasi."
          : "Pesan Anda telah berhasil sampai di kotak masuk saya.",
        stateType: "success",
      });

      showAlert({
        show: true,
        text: isMock
          ? "Pesan terkirim (Mode simulasi demo terverifikasi)."
          : "Pesan terkirim dengan sukses!",
        type: "success",
      });

      setTimeout(() => {
        hideAlert();
        setForm({ name: "", email: "", message: "" });
        setTerminalState({
          statusTitle: "Siap menerima pesanmu",
          statusDesc: "Formulir siap. Pesan akan diteruskan langsung ke kotak masuk email saya.",
          stateType: "idle",
        });
      }, 3500);
    } catch {
      setIsTransmitting(false);
      setTerminalState({
        statusTitle: "Gagal mengirim pesan",
        statusDesc: "Gateway pengiriman tidak merespons. Silakan periksa koneksi dan coba lagi.",
        stateType: "error",
      });

      showAlert({
        show: true,
        text: "Pesan gagal terkirim. I didn't receive your message.",
        type: "danger",
      });
    }
  };

  const messageCount = form.message.length;
  const isMessageOverLimit = messageCount > MAX_MESSAGE_LENGTH;

  return (
    <div className="min-h-[100dvh] bg-cream text-ink">
      <section className="relative flex lg:flex-row flex-col max-w-5xl mx-auto px-6 sm:px-8 pt-28 sm:pt-32 pb-20 gap-8 sm:gap-12">
        {alert.show && <Alert {...alert} />}

        <div className="flex-1 min-w-[50%] flex flex-col justify-start">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-copper">
              Kontak
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-ink leading-tight tracking-tight">
              Kirim Pesan
            </h1>
            <p className="font-sans text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl mt-1">
              Silakan tinggalkan pesan untuk konsultasi rekayasa antarmuka, diskusi proyek Web3,
              atau peluang kerja sama lainnya.
            </p>
          </div>

          {isInputFocused && (
            <div className="lg:hidden mt-4 p-2.5 rounded-lg border border-ink/10 bg-cream-deep text-ink-soft text-xs font-sans flex items-center justify-between">
              <span className="text-ink-faint">Status:</span>
              <span className="font-medium text-copper">{terminalState.statusTitle}</span>
            </div>
          )}

          <form className="w-full flex flex-col gap-5 mt-8" onSubmit={handleSubmit} noValidate>
            <label htmlFor="contact-name" className="text-ink font-medium text-sm font-sans flex flex-col">
              <span>Nama Lengkap</span>
              <input
                id="contact-name"
                type="text"
                name="name"
                className={`mt-1.5 px-4 py-2.5 rounded-lg border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors ${
                  fieldErrors.name ? "border-red-500 focus:border-red-500" : "border-ink/15"
                }`}
                placeholder="mis. Raka Fantino"
                required
                value={form.name}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {fieldErrors.name && (
                <span className="text-xs text-red-600 font-sans mt-1">
                  {fieldErrors.name}
                </span>
              )}
            </label>

            <label htmlFor="contact-email" className="text-ink font-medium text-sm font-sans flex flex-col">
              <span>Alamat Email</span>
              <input
                id="contact-email"
                type="email"
                name="email"
                className={`mt-1.5 px-4 py-2.5 rounded-lg border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors ${
                  fieldErrors.email ? "border-red-500 focus:border-red-500" : "border-ink/15"
                }`}
                placeholder="nama@domain.com"
                required
                value={form.email}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {fieldErrors.email && (
                <span className="text-xs text-red-600 font-sans mt-1">
                  {fieldErrors.email}
                </span>
              )}
            </label>

            <label htmlFor="contact-message" className="text-ink font-medium text-sm font-sans flex flex-col">
              <div className="flex justify-between items-center">
                <span>Pesan Anda</span>
                <span
                  data-testid="char-counter"
                  className={`text-xs font-mono ${
                    isMessageOverLimit ? "text-red-600 font-bold" : "text-ink-faint"
                  }`}
                >
                  {messageCount}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
              <textarea
                id="contact-message"
                rows={5}
                name="message"
                className={`mt-1.5 px-4 py-2.5 rounded-lg border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors ${
                  fieldErrors.message || isMessageOverLimit ? "border-red-500 focus:border-red-500" : "border-ink/15"
                }`}
                placeholder="Ceritakan gambaran proyek, target waktu, atau hal yang ingin Anda bangun..."
                required
                value={form.message}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {fieldErrors.message && (
                <span className="text-xs text-red-600 font-sans mt-1">
                  {fieldErrors.message}
                </span>
              )}
            </label>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-ink text-cream hover:bg-ink-soft transition-colors font-sans text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer self-start mt-2"
              disabled={isTransmitting || isMessageOverLimit}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              {isTransmitting ? "Mengirim pesan..." : "Kirim Pesan"}
            </button>
          </form>
        </div>

        <div
          className={`lg:w-1/2 w-full flex-col justify-between p-6 sm:p-8 rounded-2xl border border-ink/10 bg-white/70 text-ink shadow-sm transition-all duration-200 ${
            isInputFocused ? "hidden lg:flex" : "flex"
          }`}
        >
          <div>
            <div className="border-b border-ink/10 pb-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-copper" />
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-ink">
                  Status Pengiriman
                </span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-sans font-medium capitalize ${
                  terminalState.stateType === "success"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : terminalState.stateType === "error"
                    ? "bg-rose-100 text-rose-800 border border-rose-200"
                    : terminalState.stateType === "transmitting"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-cream-deep text-ink-soft"
                }`}
              >
                {terminalState.stateType === "idle"
                  ? "Siap"
                  : terminalState.stateType === "typing"
                  ? "Menulis"
                  : terminalState.stateType === "transmitting"
                  ? "Mengirim"
                  : terminalState.stateType === "success"
                  ? "Terkirim"
                  : "Gagal"}
              </span>
            </div>

            <div className="min-h-[160px] flex flex-col justify-between py-2">
              <div>
                <h3 className="font-serif text-xl font-semibold text-ink mb-2">
                  {terminalState.statusTitle}
                </h3>
                <p className="font-sans text-sm text-ink-soft leading-relaxed">
                  {terminalState.statusDesc}
                </p>
              </div>

              <div className="pt-6 border-t border-ink/10 mt-6 space-y-2.5 text-xs font-sans text-ink-faint">
                <div className="flex items-center justify-between">
                  <span>Email Tujuan:</span>
                  <span className="font-mono text-ink-soft">rakafantinoo@gmail.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Jumlah Karakter:</span>
                  <span className="font-mono text-ink-soft">{messageCount} / {MAX_MESSAGE_LENGTH}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kanal Layanan:</span>
                  <span className="font-mono text-ink-soft">
                    {import.meta.env?.VITE_APP_EMAILJS_SERVICE_ID
                      ? "EmailJS Gateway"
                      : "Mode demo (tanpa EmailJS)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-ink/10 text-[11px] font-sans text-ink-faint flex justify-between">
            <span>Privasi terjaga</span>
            <span>
              {lastSendModeRef.current === "mock"
                ? "Simulasi demo aktif"
                : "Langsung ke kotak masuk"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
