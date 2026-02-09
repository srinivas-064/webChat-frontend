import { useEffect } from "react";
import { useToast } from "../../context/ToastContext.jsx";

export function GlobalErrorToast() {
  const { addToast } = useToast();

  useEffect(() => {
    const onUnhandledRejection = (event) => {
      const message =
        event?.reason?.response?.data?.message ||
        event?.reason?.message ||
        "Something went wrong";
      addToast({ title: "Error", description: message });
    };
    const onError = (event) => {
      const message = event?.error?.message || event?.message || "Unexpected error";
      addToast({ title: "Error", description: message });
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
    };
  }, [addToast]);

  return null;
}
