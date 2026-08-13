import React from 'react';
import { getLocaleCookie, changeLocaleAndReload } from './cookieUtils';

/**
 * Language selector component
 * Displays language options and saves preference to cookie on change
 * Reloads page when language is changed
 */
function LanguageSelector({ languages = [
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'je', label: 'Jewish', flag: 'je' },
] }) {
  const [currentLocale, setCurrentLocale] = React.useState(() => getLocaleCookie());

  const handleLanguageChange = (locale) => {
    if (locale !== currentLocale) {
      setCurrentLocale(locale);
      changeLocaleAndReload(locale);
    }
  };

  return (
    <div className="language-selector">
      <div className="language-buttons">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`lang-btn ${currentLocale === lang.code ? 'active' : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
            title={`Switch to ${lang.label}`}
          >
            <span className="flag">{lang.flag}</span>
            <span className="label">{lang.label}</span>
          </button>
        ))}
      </div>
      <style jsx>{`
        .language-selector {
          display: flex;
          gap: 8px;
          padding:10px;
          align-items: center;
        }

        .language-buttons {
          display: flex;
          gap: 8px;
          background: #f5f5f5;
          padding: 8px;
          border-radius: 8px;
        }

        .lang-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border: 1px solid transparent;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          color: #333;
        }

        .lang-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .lang-btn.active {
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          color: #000;
          font-weight: 600;
        }

        .flag {
          font-size: 18px;
          line-height: 1;
        }

        .label {
          display: none;
        }

        @media (min-width: 600px) {
          .label {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}

export default LanguageSelector;