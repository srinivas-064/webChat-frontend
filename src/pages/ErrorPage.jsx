import React from "react";
import { useNavigate, useRouteError, isRouteErrorResponse } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

function ErrorPage({ variant = "auto" }) {
  const navigate = useNavigate();
  const routeError = useRouteError();

  const forced404 = variant === "404";

  let code = "500";
  let title = "Something went wrong";
  let subtitle = "An unexpected error occurred. Please try again.";

  if (forced404) {
    code = "404";
    title = "Page not found";
    subtitle = "The page you’re looking for doesn’t exist or was moved.";
  } else if (routeError) {
    if (isRouteErrorResponse(routeError)) {
      code = String(routeError.status);
      title = routeError.status === 404 ? "Page not found" : "Something went wrong";
      subtitle =
        routeError.statusText ||
        routeError.data?.message ||
        subtitle;
    } else if (routeError?.message) {
      subtitle = routeError.message;
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
              <AlertTriangle size={30} className="text-white" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-sm font-semibold text-cyan-700 tracking-wider">
              ERROR {code}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-800">
              {title}
            </h1>
            <p className="mt-2 text-gray-500">
              {subtitle}
            </p>
          </div>

          {/* Error details (only for real errors, not 404) */}
          {!forced404 && routeError && !isRouteErrorResponse(routeError) && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 overflow-auto">
              <pre className="whitespace-pre-wrap">
                {String(routeError?.stack || routeError)}
              </pre>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                         bg-gradient-to-r from-cyan-500 to-teal-500
                         text-white font-semibold
                         hover:from-cyan-600 hover:to-teal-600
                         transition shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
