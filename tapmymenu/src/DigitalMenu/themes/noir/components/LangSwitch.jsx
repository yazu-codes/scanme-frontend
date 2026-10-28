import React from "react";
import { changeLocaleAndReload } from "../../../core/cookieUtils";

// The small "BG / EN" toggle from the reference header. It writes the
// same app_locale cookie (and fires the same "translate" analytics
// event) as the LocaleWidget's LanguageSelector, so the two always agree.
export default function LangSwitch({ locale, track }) {
  const options = ["bg", "en"];
  return (
    <div className="nr-lang" role="group" aria-label="Language">
      {options.map((code, i) => (
        <React.Fragment key={code}>
          {i > 0 ? <span className="nr-lang-sep" aria-hidden="true">/</span> : null}
          <button
            type="button"
            className={"nr-lang-btn" + (locale === code ? " nr-lang-active" : "")}
            aria-pressed={locale === code}
            onClick={() => {
              if (locale !== code) changeLocaleAndReload(code, track);
            }}
          >
            {code.toUpperCase()}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
