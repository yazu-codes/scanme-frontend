// Picks the line icon for a category from keywords in its title.
//
// Always call this with the category's ORIGINAL title (the Bulgarian one,
// as the owner typed it), never a translation: translations vary between
// requests and languages, the original doesn't, so a category keeps the
// same icon whatever language the guest picked. English keywords are
// kept too, for menus whose original language is English.
//
// Keywords match at the START of a word, so "алкохол" doesn't fire inside
// "Безалкохолни" and "ром" doesn't fire inside "Промоции". Rules are
// checked top to bottom; the first match wins, so specific rules (e.g.
// "Селекция ракии") come before broad ones (e.g. "селекция" = wine).

const RULES = [
  ["promo", ["промо", "оферт", "специалн", "предложени", "promo", "offer", "special", "deal"]],
  ["coffee", ["кафе", "чай", "чаен", "топли напитки", "горещ", "coffee", "tea", "hot drink", "espresso"]],
  ["champagne", ["шампанск", "просеко", "пенлив", "игрист", "champagne", "prosecco", "sparkling", "cava"]],
  ["beer", ["бира", "бири", "пиво", "сайдер", "beer", "cider", "ale", "lager"]],
  ["rakia", ["ракия", "ракии", "анасон", "анис", "узо", "мастик", "rakia", "ouzo", "anis", "mastika", "aniseed"]],
  ["whisky", ["уиски", "бърбън", "коняк", "бренди", "ром", "whisk", "bourbon", "cognac", "brandy", "rum", "scotch"]],
  ["cocktail", ["коктейл", "джин", "водка", "текила", "аперитив", "ликьор", "дижестив", "cocktail", "gin", "vodka", "tequila", "aperitif", "liqueur", "digestif", "spirit"]],
  ["wine", ["вин", "розе", "шардоне", "селекция", "шато", "домейн", "изба", "wine", "rosé", "rose", "selection", "estate", "chateau", "château", "domaine", "cellar"]],
  ["soft", ["безалкохол", "студени напитки", "сок", "фреш", "вода", "лимонад", "смути", "soft", "juice", "water", "lemonade", "smoothie", "cold drink"]],
  ["drinks", ["напит", "бар", "алкохол", "drink", "beverage", "bar", "alcohol"]],
  ["dessert", ["десерт", "сладк", "торт", "сладолед", "палачинк", "dessert", "sweet", "cake", "ice cream", "pancake"]],
  ["side", ["гарнитур", "картоф", "side", "fries", "garnish"]],
  ["bread", ["хляб", "хлеб", "питк", "тестен", "погач", "bread", "bakery", "pastr"]],
  ["soup", ["супа", "супи", "чорба", "крем супа", "soup", "broth"]],
  ["salad", ["салат", "salad"]],
  ["pasta", ["паст", "спагет", "ризот", "ньоки", "лазаня", "pasta", "spaghetti", "risotto", "gnocchi", "lasagn"]],
  ["pizza", ["пиц", "pizza"]],
  ["burger", ["бургер", "сандвич", "дюнер", "бургери", "burger", "sandwich", "wrap", "doner"]],
  ["egg", ["яйц", "яйчн", "омлет", "закуск", "egg", "omelet", "omelette", "breakfast", "brunch"]],
  ["fish", ["риба", "рибн", "морск", "скарид", "миди", "сьомга", "fish", "seafood", "shrimp", "salmon"]],
  ["chicken", ["пиле", "пилешк", "пуешк", "chicken", "poultry", "turkey", "wings"]],
  ["meat", ["свинск", "телешк", "агнешк", "говежд", "месо", "меса", "месни", "скара", "грил", "стек", "pork", "beef", "lamb", "veal", "meat", "grill", "steak", "bbq"]],
  ["lean", ["постн", "вегетариан", "веган", "зеленчук", "lean", "vegan", "vegetarian", "veggie", "vegetable"]],
  ["starter", ["предяст", "мезе", "мезета", "антипаст", "разядк", "starter", "appetizer", "antipast", "meze", "tapas"]],
  ["main", ["основн", "ястия", "ястие", "main", "dishes", "entree"]],
];

const LETTER = "\\p{L}";
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// One regex per icon: any of its keywords at the start of a word.
const MATCHERS = RULES.map(([key, words]) => [
  key,
  new RegExp(`(?:^|[^${LETTER}])(?:${words.map(escape).join("|")})`, "iu"),
]);

export const DEFAULT_ICON = "cloche";

// Returns the icon key for an original category title, or DEFAULT_ICON.
export function getCategoryIconKey(originalTitle) {
  const title = String(originalTitle || "").trim();
  if (!title) return DEFAULT_ICON;
  for (const [key, re] of MATCHERS) {
    if (re.test(title)) return key;
  }
  return DEFAULT_ICON;
}
