/**
 * Pure transport boundary module for EmailJS and Mock Mode fallback.
 * Follows Rule 01 (FCIS): pure domain logic, no direct import.meta.env access,
 * no React dependencies.
 */

/**
 * Checks whether all required EmailJS configuration keys are present and non-empty.
 * @param {Record<string, string | undefined> | undefined} env
 * @returns {boolean}
 */
export function isEmailJsConfigured(env) {
  if (!env || typeof env !== "object") {
    return false;
  }

  const serviceId = env.VITE_APP_EMAILJS_SERVICE_ID;
  const templateId = env.VITE_APP_EMAILJS_TEMPLATE_ID;
  const publicKey = env.VITE_APP_EMAILJS_PUBLIC_KEY;

  const isValidString = (val) => typeof val === "string" && val.trim().length > 0;

  return isValidString(serviceId) && isValidString(templateId) && isValidString(publicKey);
}

/**
 * Sends dispatch message through EmailJS when configured,
 * or safely falls back to Mock Mode latency simulation when unconfigured.
 *
 * @param {Object} options
 * @param {Record<string, string | undefined> | undefined} options.env
 * @param {Record<string, unknown>} options.payload
 * @param {number} [options.mockLatencyMs=800]
 * @returns {Promise<{ status: "sent" | "mock-sent", mode: "emailjs" | "mock" }>}
 */
export async function sendDispatch({ env, payload, mockLatencyMs = 800 }) {
  if (isEmailJsConfigured(env)) {
    const emailjsModule = await import("@emailjs/browser");
    const emailjs = emailjsModule.default || emailjsModule;

    await emailjs.send(
      env.VITE_APP_EMAILJS_SERVICE_ID.trim(),
      env.VITE_APP_EMAILJS_TEMPLATE_ID.trim(),
      payload,
      env.VITE_APP_EMAILJS_PUBLIC_KEY.trim()
    );

    return {
      status: "sent",
      mode: "emailjs",
    };
  }

  // Mock Mode fallback: simulate async latency without throwing
  await new Promise((resolve) => setTimeout(resolve, mockLatencyMs));

  return {
    status: "mock-sent",
    mode: "mock",
  };
}
