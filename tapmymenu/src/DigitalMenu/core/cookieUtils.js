/**
 * Cookie utility functions for managing locale preference
 */

const LOCALE_COOKIE_NAME = 'app_locale';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * Save locale preference to cookie
 * @param {string} locale - Language code (e.g., 'en', 'bg')
 */
export function setLocaleCookie(locale) {
  const date = new Date();
  date.setTime(date.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};${expires};path=/`;
  console.log(`✓ Locale cookie set to: ${locale}`);
}

/**
 * Get locale preference from cookie
 * @returns {string} - Language code, or 'bg' as default
 */
export function getLocaleCookie() {
  const nameEQ = LOCALE_COOKIE_NAME + '=';
  const cookies = document.cookie.split(';');
  
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  
  return 'bg'; // Default to Bulgarian
}

/**
 * Clear locale cookie
 */
export function clearLocaleCookie() {
  document.cookie = `${LOCALE_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  console.log('✓ Locale cookie cleared');
}

/**
 * Change locale, save to cookie, and reload page
 * @param {string} locale - Language code
 */
export function changeLocaleAndReload(locale) {
  setLocaleCookie(locale);
  window.location.reload();
}