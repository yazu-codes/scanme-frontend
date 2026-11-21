// Shared UI copy for menuKit themes. A theme can add or override keys
// with makeStrings({ bg: {...}, en: {...} }). Any locale other than bg
// falls back to English.

const BASE = {
  bg: {
    menu: "Меню",
    items: (n) => (n === 1 ? "1 предложение" : `${n} предложения`),
    categoriesCount: (n) => (n === 1 ? "1 категория" : `${n} категории`),
    call: "Обаждане",
    info: "Информация",
    hours: "Работно време",
    allCategories: "Всички категории",
    openMenu: "Отвори навигацията",
    navigation: "Навигация",
    contacts: "Контакти",
    reviews: "Оценете ни",
    wifi: "Wi-Fi",
    all: "Всички",
    weight: "Количество",
    allergens: "Алергени",
    price: "Цена",
    close: "Затвори",
    backToTop: "Към началото",
    showStaff: "Покажете на персонала",
    loading: "Зареждане на менюто…",
    error: "Менюто не можа да се зареди. Моля, опитайте отново след малко.",
    rights: "Всички права запазени.",
    categories: "Категории",
    subcategories: "Подкатегории",
  },
  en: {
    menu: "Menu",
    items: (n) => (n === 1 ? "1 item" : `${n} items`),
    categoriesCount: (n) => (n === 1 ? "1 category" : `${n} categories`),
    call: "Call",
    info: "Info",
    hours: "Opening hours",
    allCategories: "All categories",
    openMenu: "Open navigation",
    navigation: "Navigation",
    contacts: "Contacts",
    reviews: "Review us",
    wifi: "Wi-Fi",
    all: "All",
    weight: "Portion",
    allergens: "Allergens",
    price: "Price",
    close: "Close",
    backToTop: "Back to top",
    showStaff: "Show this to our staff",
    loading: "Loading the menu…",
    error: "We couldn't load this menu. Please try again shortly.",
    rights: "All rights reserved.",
    categories: "Categories",
    subcategories: "Sub-categories",
  },
};

export default function makeStrings(extra = {}) {
  const merged = {
    bg: { ...BASE.bg, ...(extra.bg || {}) },
    en: { ...BASE.en, ...(extra.en || {}) },
  };
  return function getStrings(locale) {
    return merged[locale] || merged.en;
  };
}
