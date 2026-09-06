import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SubpageNav from "../components/SubpageNav.jsx";
import ParchmentPage from "../components/ParchmentPage.jsx";
import WaxSealButton from "../components/WaxSealButton.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import useAlert from "../hooks/useAlert.js";
import Alert from "../components/Alert.jsx";
import { sendDispatch } from "../core/contactTransport.js";

const MAX_MESSAGE_LENGTH = 1000;
const THROTTLE_WINDOW_MS = 3000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const lastSubmitTimestampRef = useRef(0);
  const lastSendModeRef = useRef(null);
  const { alert, showAlert, hideAlert } = useAlert();

  const handleBack = () => {
    if (isExiting) return;
    setIsExiting(true);
  };

  const handleRollComplete = (isOpen) => {
    if (!isOpen) {
      navigate("/");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = t("errNameRequired");
    }

    if (!form.email.trim()) {
      errors.email = t("errEmailRequired");
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = t("errEmailInvalid");
    }

    if (!form.message.trim()) {
      errors.message = t("errMessageRequired");
    } else if (form.message.length > MAX_MESSAGE_LENGTH) {
      errors.message = t("errMessageTooLong").replace("{max}", MAX_MESSAGE_LENGTH);
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
      return;
    }

    setIsTransmitting(true);

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

      showAlert({
        show: true,
        text: isMock ? t("alertSuccessMock") : t("alertSuccessReal"),
        type: "success",
      });

      setTimeout(() => {
        hideAlert();
        setForm({ name: "", email: "", message: "" });
      }, 3500);
    } catch {
      setIsTransmitting(false);

      showAlert({
        show: true,
        text: t("alertFailed"),
        type: "danger",
      });
    }
  };

  const messageCount = form.message.length;
  const isMessageOverLimit = messageCount > MAX_MESSAGE_LENGTH;

  return (
    <ParchmentPage isOpen={!isExiting} onRollComplete={handleRollComplete}>
      <SubpageNav onBack={handleBack} />
      <div className="relative max-w-2xl mx-auto flex flex-col pt-8 sm:pt-6">
        {alert.show && <Alert {...alert} />}

        <div className="flex flex-col gap-2.5 border-b border-[#8C5E32]/25 pb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[#A66D38]" aria-hidden="true" />
            <span className="text-xs font-serif italic tracking-widest uppercase text-[#8C3E14] font-medium">
              {t("contactEyebrow")}
            </span>
            <span className="w-8 h-px bg-[#A66D38]" aria-hidden="true" />
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#241407] leading-tight tracking-tight">
            {t("contactTitle")}
          </h1>
          <p className="font-serif text-base sm:text-lg text-[#4A2F17] leading-relaxed max-w-xl mt-1">
            {t("contactIntro")}
          </p>
          <p className="font-serif text-sm text-[#5C3B1E] mt-2">
            {t({
              id: "Atau hubungi langsung melalui ",
              en: "Or reach out directly at ",
            })}
            <a
              href="mailto:rakafantinoo@gmail.com"
              className="font-mono text-[#8C3E14] hover:underline font-bold"
            >
              rakafantinoo@gmail.com
            </a>
          </p>
        </div>

        <form className="w-full flex flex-col gap-5 mt-8 sm:mt-10" onSubmit={handleSubmit} noValidate>
          <label htmlFor="contact-name" className="text-[#351E0D] font-serif font-bold text-sm flex flex-col">
            <span>{t("nameLabel")}</span>
            <input
              id="contact-name"
              type="text"
              name="name"
              className={`mt-1.5 px-4 py-2.5 rounded-sm border bg-[#FAF2E2]/90 text-[#241407] font-serif text-sm placeholder:text-[#8C6B46]/70 focus:outline-none focus:border-[#8C3E14] focus:ring-1 focus:ring-[#8C3E14]/30 shadow-inner transition-colors ${
                fieldErrors.name ? "border-[#A82B14] focus:border-[#A82B14]" : "border-[#A67543]/40"
              }`}
              placeholder={t("namePlaceholder")}
              required
              value={form.name}
              onChange={handleInputChange}
            />
            {fieldErrors.name && (
              <span className="text-xs text-[#A82B14] font-serif font-medium mt-1">
                {fieldErrors.name}
              </span>
            )}
          </label>

          <label htmlFor="contact-email" className="text-[#351E0D] font-serif font-bold text-sm flex flex-col">
            <span>{t("emailLabel")}</span>
            <input
              id="contact-email"
              type="email"
              name="email"
              className={`mt-1.5 px-4 py-2.5 rounded-sm border bg-[#FAF2E2]/90 text-[#241407] font-serif text-sm placeholder:text-[#8C6B46]/70 focus:outline-none focus:border-[#8C3E14] focus:ring-1 focus:ring-[#8C3E14]/30 shadow-inner transition-colors ${
                fieldErrors.email ? "border-[#A82B14] focus:border-[#A82B14]" : "border-[#A67543]/40"
              }`}
              placeholder={t("emailPlaceholder")}
              required
              value={form.email}
              onChange={handleInputChange}
            />
            {fieldErrors.email && (
              <span className="text-xs text-[#A82B14] font-serif font-medium mt-1">
                {fieldErrors.email}
              </span>
            )}
          </label>

          <label htmlFor="contact-message" className="text-[#351E0D] font-serif font-bold text-sm flex flex-col">
            <div className="flex justify-between items-center">
              <span>{t("messageLabel")}</span>
              <span
                data-testid="char-counter"
                className={`text-xs font-mono ${
                  isMessageOverLimit ? "text-[#A82B14] font-bold" : "text-[#7A5328]"
                }`}
              >
                {messageCount}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <textarea
              id="contact-message"
              rows={5}
              name="message"
              className={`mt-1.5 px-4 py-2.5 rounded-sm border bg-[#FAF2E2]/90 text-[#241407] font-serif text-sm placeholder:text-[#8C6B46]/70 focus:outline-none focus:border-[#8C3E14] focus:ring-1 focus:ring-[#8C3E14]/30 shadow-inner transition-colors ${
                fieldErrors.message || isMessageOverLimit ? "border-[#A82B14] focus:border-[#A82B14]" : "border-[#A67543]/40"
              }`}
              placeholder={t("messagePlaceholder")}
              required
              value={form.message}
              onChange={handleInputChange}
            />
            {fieldErrors.message && (
              <span className="text-xs text-[#A82B14] font-serif font-medium mt-1">
                {fieldErrors.message}
              </span>
            )}
          </label>

          <div className="flex justify-center pt-2 sm:pt-4">
            <WaxSealButton
              type="submit"
              variant="seal"
              size="md"
              disabled={isTransmitting || isMessageOverLimit}
              ariaLabel={isTransmitting ? t("sendingBtn") : t("sendBtn")}
            >
              <span>{isTransmitting ? t("sendingBtn") : t("sendBtn")}</span>
            </WaxSealButton>
          </div>
        </form>
      </div>
    </ParchmentPage>
  );
};

export default Contact;
