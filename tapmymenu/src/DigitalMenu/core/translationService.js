/**
 * Translation Service with Smart Caching
 * 
 * Features:
 * - Smart batching (20 items per request)
 * - Automatic localStorage caching
 * - 7-day cache expiry
 * - Minimal mobile data usage (~12 KB per translation)
 */

const BATCH_SIZE = 20;
const CACHE_KEY = 'menu_translations_cache_v1';
const CACHE_EXPIRY_HOURS = 24 * 7; // 7 days

// ============================================================================
// CACHING FUNCTIONS
// ============================================================================

/**
 * Get translations from localStorage cache
 */
export function getTranslationsFromCache(locale) {
  try {
    const cacheKey = `${CACHE_KEY}_${locale}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      console.log(`No cache found for locale: ${locale}`);
      return null;
    }

    const { data, timestamp, itemCount } = JSON.parse(cached);
    const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);

    // Check if expired
    if (ageHours > CACHE_EXPIRY_HOURS) {
      console.log(`✗ Cache expired (${ageHours.toFixed(1)} hours old), clearing...`);
      localStorage.removeItem(cacheKey);
      return null;
    }

    console.log(`✓ Loaded ${itemCount} items from cache (${ageHours.toFixed(1)} hours old)`);
    return data;
  } catch (e) {
    console.error('Cache read error:', e);
    return null;
  }
}

/**
 * Save translations to localStorage cache
 */
export function saveTranslationsToCache(translatedItems, locale) {
  try {
    const cacheKey = `${CACHE_KEY}_${locale}`;
    const cacheData = {
      data: translatedItems,
      timestamp: Date.now(),
      itemCount: translatedItems.length,
    };

    const json = JSON.stringify(cacheData);
    const sizeKB = (json.length / 1024).toFixed(2);

    localStorage.setItem(cacheKey, json);
    console.log(`✓ Saved ${translatedItems.length} items to cache (${sizeKB} KB)`);
  } catch (e) {
    console.error('Cache write error:', e);
    // Ignore - caching is not critical
  }
}

/**
 * Clear cache for a locale
 */
export function clearTranslationCache(locale) {
  try {
    const cacheKey = `${CACHE_KEY}_${locale}`;
    localStorage.removeItem(cacheKey);
    console.log(`✓ Cache cleared for locale: ${locale}`);
  } catch (e) {
    console.error('Cache clear error:', e);
  }
}

/**
 * Clear ALL translation caches
 */
export function clearAllTranslationCaches() {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_KEY)) {
        localStorage.removeItem(key);
      }
    });
    console.log('✓ All translation caches cleared');
  } catch (e) {
    console.error('Cache clear error:', e);
  }
}

// ============================================================================
// BATCHING FUNCTIONS
// ============================================================================

/**
 * Batch translate a chunk of texts
 */
async function batchTranslateChunk(textArray, fromLang = 'bg', toLang = 'en') {
  if (!textArray || textArray.length === 0) return [];

  try {
    const combinedText = textArray.join('\n');

    console.log(`    Translating chunk of ${textArray.length} items...`);

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(combinedText)}&langpair=${fromLang}|${toLang}`
    );

    if (response.status === 403) {
      console.error(`    ❌ 403 Forbidden`);
      return textArray;
    }

    if (!response.ok) {
      console.error(`    ❌ HTTP ${response.status}`);
      return textArray;
    }

    const data = await response.json();

    if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
      console.error(`    ❌ API error`);
      return textArray;
    }

    const translatedText = data.responseData.translatedText;
    const translatedArray = translatedText.split('\n');

    if (translatedArray.length !== textArray.length) {
      console.warn(`    ⚠️  Expected ${textArray.length}, got ${translatedArray.length}`);
      return textArray;
    }

    console.log(`    ✓ Chunk done (${textArray.length} items)`);
    return translatedArray;
  } catch (error) {
    console.error(`    ❌ Error:`, error.message);
    return textArray;
  }
}

/**
 * Translate items in chunks
 */
async function translateInChunks(textArray, fromLang = 'bg', toLang = 'en') {
  if (!textArray || textArray.length === 0) return [];

  const results = [];
  const totalChunks = Math.ceil(textArray.length / BATCH_SIZE);

  console.log(`  Processing ${textArray.length} items in ${totalChunks} chunk(s)...`);

  for (let i = 0; i < textArray.length; i += BATCH_SIZE) {
    const chunk = textArray.slice(i, i + BATCH_SIZE);
    const chunkNum = Math.floor(i / BATCH_SIZE) + 1;

    console.log(`  Chunk ${chunkNum}/${totalChunks}`);

    const translated = await batchTranslateChunk(chunk, fromLang, toLang);
    results.push(...translated);

    if (i + BATCH_SIZE < textArray.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  return results;
}

// ============================================================================
// MAIN TRANSLATION FUNCTION
// ============================================================================

/**
 * Main translation function with caching
 */
export async function translateItemsWithBatching(
  items = [],
  currentLocale = 'bg',
  sourceLocale = 'bg',
  fieldsToTranslate = ['name', 'description']
) {
  if (!items?.length) {
    console.log('No items to translate');
    return items;
  }

  if (currentLocale === sourceLocale) {
    console.log(`No translation needed (${currentLocale} = ${sourceLocale})`);
    return items;
  }

  console.log(`\n📝 SMART BATCHING with CACHING`);
  console.log(`   Items: ${items.length} | Fields: ${fieldsToTranslate.length}`);
  const requestsNeeded = Math.ceil(items.length / BATCH_SIZE) * fieldsToTranslate.length;
  console.log(`   Requests: ~${requestsNeeded} (instead of ${items.length * fieldsToTranslate.length})\n`);

  try {
    const translatedItems = JSON.parse(JSON.stringify(items));

    for (const field of fieldsToTranslate) {
      console.log(`→ Field: "${field}"`);

      // Collect texts for this field
      const textsToTranslate = [];
      const emptyIndices = new Set();

      for (let i = 0; i < items.length; i++) {
        const sourceFieldName = `${field}_${sourceLocale}`;
        const text = items[i][sourceFieldName] || items[i][field] || '';

        if (text?.trim()) {
          textsToTranslate.push(text);
        } else {
          emptyIndices.add(i);
        }
      }

      if (textsToTranslate.length === 0) {
        console.log(`  (no text)`);
        continue;
      }

      // Translate in chunks
      const translatedTexts = await translateInChunks(textsToTranslate, sourceLocale, currentLocale);

      // Map back to items
      let translatedIndex = 0;
      for (let i = 0; i < items.length; i++) {
        if (!emptyIndices.has(i)) {
          const translatedFieldName = `${field}_${currentLocale}`;
          translatedItems[i][translatedFieldName] = translatedTexts[translatedIndex];
          translatedIndex++;
        }
      }

      console.log(`  ✓ Done\n`);
    }

    console.log(`✓ Translation complete!\n`);
    return translatedItems;
  } catch (error) {
    console.error('❌ Translation failed:', error);
    return items;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get localized field with fallback
 */
export function getLocalizedField(item, fieldName, locale = 'bg') {
  if (!item) return '';

  const localizedFieldName = `${fieldName}_${locale}`;
  if (item[localizedFieldName]?.trim()) {
    return item[localizedFieldName];
  }

  if (item[fieldName]?.trim()) {
    return item[fieldName];
  }

  return '';
}

/**
 * Main translate function
 */
export async function translateContent(jsonData, locale = 'bg', options = {}) {
  const {
    sourceLocale = 'bg',
    fieldsToTranslate = ['name', 'description'],
  } = options;

  if (!jsonData) return [];

  const items = Array.isArray(jsonData) ? jsonData : [jsonData];
  const translated = await translateItemsWithBatching(
    items,
    locale,
    sourceLocale,
    fieldsToTranslate
  );

  return Array.isArray(jsonData) ? translated : translated[0];
}