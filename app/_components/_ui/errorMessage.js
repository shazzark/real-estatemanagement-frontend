"use client";

import { XCircle } from "lucide-react";

export default function ErrorMessage({
  message = "Something went wrong.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-8 text-center">
      <XCircle className="text-red-500 w-12 h-12 mb-4" />
      <p className="text-lg text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
        >
          Retry
        </button>
      )}
    </div>
  );
}
