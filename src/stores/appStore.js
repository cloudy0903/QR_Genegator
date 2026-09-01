import { writable } from 'svelte/store';

// Helper for localStorage persistence
function persistentStore(key, initialValue) {
  let value = initialValue;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        value = JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Error reading localStorage for ${key}:`, e);
    }
  }
  const store = writable(value);
  store.subscribe((val) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        console.warn(`Error writing localStorage for ${key}:`, e);
      }
    }
  });
  return store;
}

// Current view: 'home' or slug of tool
export const activeToolSlug = writable(null);

// Selected category filter on home ('all' or category id)
export const selectedCategory = writable('all');

// Global search query
export const searchQuery = writable('');

// Dark mode store (defaults to system preference or false)
const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
export const isDarkMode = persistentStore('quicktools_theme_dark', systemPrefersDark);

// Favorites list (array of tool slugs)
export const favoriteTools = persistentStore('quicktools_favorites', [
  'qr-generator',
  'image-compressor',
  'json-formatter',
  'password-generator'
]);

// Recently used tools (array of { slug, timestamp })
export const recentTools = persistentStore('quicktools_recent', []);

export function recordToolUsage(slug) {
  recentTools.update((list) => {
    const filtered = list.filter(item => item.slug !== slug);
    return [{ slug, timestamp: Date.now() }, ...filtered].slice(0, 10);
  });
}

export function toggleFavorite(slug) {
  favoriteTools.update((list) => {
    if (list.includes(slug)) {
      return list.filter(s => s !== slug);
    } else {
      return [...list, slug];
    }
  });
}

// Toast notification system
export const toasts = writable([]);

let toastId = 0;
export function showToast(message, type = 'info', duration = 3500) {
  const id = ++toastId;
  toasts.update(current => [...current, { id, message, type }]);
  setTimeout(() => {
    toasts.update(current => current.filter(t => t.id !== id));
  }, duration);
}
