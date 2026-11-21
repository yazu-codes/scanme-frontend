// UI copy for Lantern. Dish names and descriptions come from the API;
// these are only the theme's own labels, picked from the same app_locale
// cookie the LocaleWidget writes. Any other locale falls back to English.

const STRINGS = {
  bg: {
    menu: "Меню",
    items: (n) => (n === 1 ? "1 предложение" : `${n} предложения`),
    categoriesCount: (n) => (n === 1 ? "1 категория" : `${n} категории`),
    call: "Обаждане",
    info: "Информация",
    allCategories: "Всички категории",
    openMenu: "Отвори навигацията",
    navigation: "Навигация",
    contacts: "Контакти",
    reviews: "Оценете ни",
    wifi: "Wi-Fi",
    all: "Всички",
    viewAll: "Виж всички",
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
    allCategories: "All categories",
    openMenu: "Open navigation",
    navigation: "Navigation",
    contacts: "Contacts",
    reviews: "Review us",
    wifi: "Wi-Fi",
    all: "All",
    viewAll: "View all",
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

export default function getStrings(locale) {
  return STRINGS[locale] || STRINGS.en;
}
