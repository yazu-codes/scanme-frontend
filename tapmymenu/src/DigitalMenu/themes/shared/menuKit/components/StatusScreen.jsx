import React from "react";

// Loading / error screen. The theme passes its own emblem as children.
export default function StatusScreen({ status, strings, children }) {
  const error = status === "error";
  return (
    <div className="mk-status" role={error ? "alert" : "status"}>
      <div className={error ? "mk-status-emblem" : "mk-status-emblem mk-pulse"}>{children}</div>
      <p>{error ? strings.error : strings.loading}</p>
    </div>
  );
}
