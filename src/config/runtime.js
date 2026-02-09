const PROD_API_FALLBACK = "https://webchat-backend-69d4.onrender.com/api";
const PROD_SOCKET_FALLBACK = "https://webchat-backend-69d4.onrender.com";
const DEV_API_FALLBACK = "http://localhost:3000/api";
const DEV_SOCKET_FALLBACK = "http://localhost:3000";

const isLocalUrl = (value = "") => /localhost|127\.0\.0\.1/i.test(value);

const pickApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_URL || "").trim();
  if (import.meta.env.PROD) {
    if (!raw || isLocalUrl(raw)) return PROD_API_FALLBACK;
    return raw;
  }
  return raw || DEV_API_FALLBACK;
};

const pickSocketBaseUrl = () => {
  const raw = (import.meta.env.VITE_SOCKET_URL || "").trim();
  if (import.meta.env.PROD) {
    if (!raw || isLocalUrl(raw)) return PROD_SOCKET_FALLBACK;
    return raw;
  }
  return raw || DEV_SOCKET_FALLBACK;
};

export const API_BASE_URL = pickApiBaseUrl();
export const SOCKET_BASE_URL = pickSocketBaseUrl();
