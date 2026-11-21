import React from "react";

export default function Toast({ toast }) {
  return (
    <div className="cv-toast-wrap" role="status" aria-live="polite">
      {toast ? (
        <span key={toast.id} className="cv-toast">
          {toast.text}
        </span>
      ) : null}
    </div>
  );
}
