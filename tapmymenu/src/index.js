import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './tailwind.css';

// "/" shows the landing page from public/index.html; every other path starts the React app.
if (!window.__TMM_LANDING__) {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}