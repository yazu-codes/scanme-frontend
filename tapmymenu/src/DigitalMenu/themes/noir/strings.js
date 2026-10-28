// UI copy for Noir. Menu content itself (dish names, descriptions)
// arrives already localized from the API; these are only the theme's own
// labels, picked from the same app_locale cookie the LocaleWidget writes.

const STRINGS = {
  bg: {
    explore: "Разгледайте нашето меню",
    menu: "Меню",
    viewMenu: "Виж менюто",
    category: "Категория",
    backToMenu: "Обратно към менюто",
    weight: "Грамаж",
    price: "Цена",
    allergens: "Алергени",
    items: (n) => (n === 1 ? "1 предложение" : `${n} предложения`),
    navigation: "Навигация",
    contacts: "Контакти",
    followUs: "Последвайте ни",
    wifi: "Wi-Fi",
    rights: "Всички права запазени.",
    close: "Затвори",
    openMenu: "Отвори навигацията",
    backToTop: "Към началото",
    error: "Менюто не можа да се зареди. Моля, опитайте отново след малко.",
    showStaff: "Покажете на персонала",
    allCategories: "Всички категории",
    viewAll: "Виж всички",
  },
  en: {
    explore: "Explore our menu",
    menu: "Menu",
    viewMenu: "View menu",
    category: "Category",
    backToMenu: "Back to main menu",
    weight: "Weight",
    price: "Price",
    allergens: "Allergens",
    items: (n) => (n === 1 ? "1 item" : `${n} items`),
    navigation: "Navigation",
    contacts: "Contacts",
    followUs: "Follow us",
    wifi: "Wi-Fi",
    rights: "All rights reserved.",
    close: "Close",
    openMenu: "Open navigation",
    backToTop: "Back to top",
    error: "We couldn't load this menu. Please try again shortly.",
    showStaff: "Show this to our staff",
    allCategories: "All categories",
    viewAll: "View all",
  },
};

export default function getStrings(locale) {
  return STRINGS[locale] || STRINGS.en;
}
