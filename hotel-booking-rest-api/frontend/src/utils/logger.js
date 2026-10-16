// ==============================================================================
// Activity Logger Utility for DevTools Console Tab
// Prints clear, color-coded, step-by-step logs into the browser Console tab
// whenever the user touches any process (hotel selection, room pick, search,
// filters, form typing, Redux actions, API calls, and auth token generation).
// ==============================================================================

const BADGE_STYLES = {
  TOUCH: 'background: #2563eb; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  SEARCH: 'background: #d97706; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  FILTER: 'background: #b45309; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  ROOM: 'background: #0284c7; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  FORM: 'background: #64748b; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  REDUX: 'background: #7c3aed; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  API: 'background: #059669; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  CRUD: 'background: #0d9488; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  AUTH: 'background: #dc2626; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  STORAGE: 'background: #4338ca; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  INFO: 'background: #1e293b; color: #38bdf8; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
};

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export const hotelLogger = {
  // User touch & interaction
  touch(action, details = null) {
    const time = formatTime();
    console.log(`%c[TOUCH]%c ${time} » ${action}`, BADGE_STYLES.TOUCH, 'color: inherit; font-weight: 500;', details || '');
  },

  // Search & filter interactions
  search(query) {
    const time = formatTime();
    console.log(`%c[SEARCH]%c ${time} » Hotel search term changed: "${query}"`, BADGE_STYLES.SEARCH, 'color: inherit;');
  },

  filter(type, value) {
    const time = formatTime();
    console.log(`%c[FILTER]%c ${time} » Applied filter [${type}]: ${value}`, BADGE_STYLES.FILTER, 'color: inherit;');
  },

  // Room & Hotel selection
  hotel(hotelName, city) {
    const time = formatTime();
    console.log(`%c[HOTEL]%c ${time} » Selected Property: ${hotelName} (${city})`, BADGE_STYLES.TOUCH, 'color: inherit;');
  },

  room(roomName, pricePerNight) {
    const time = formatTime();
    console.log(`%c[ROOM]%c ${time} » Selected Room Type: ${roomName} (₹${pricePerNight.toLocaleString()}/night)`, BADGE_STYLES.ROOM, 'color: inherit;');
  },

  // Form input changes
  form(fieldName, value) {
    const time = formatTime();
    console.log(`%c[FORM INPUT]%c ${time} » Field [${fieldName}] updated:`, BADGE_STYLES.FORM, 'color: inherit;', value);
  },

  // Redux Toolkit state actions
  redux(actionType, payload = null) {
    const time = formatTime();
    console.log(`%c[REDUX ACTION]%c ${time} » Dispatched: ${actionType}`, BADGE_STYLES.REDUX, 'color: inherit;', payload ? { payload } : '');
  },

  // REST API calls (GET, POST, PUT, DELETE)
  api(method, url, data = null) {
    const time = formatTime();
    console.log(`%c[API ${method}]%c ${time} » ${url}`, BADGE_STYLES.API, 'color: inherit; font-weight: bold;', data || '');
  },

  // SQLite CRUD operations
  crud(operation, message, data = null) {
    const time = formatTime();
    console.log(`%c[SQLITE CRUD ${operation}]%c ${time} » ${message}`, BADGE_STYLES.CRUD, 'color: inherit;', data || '');
  },

  // Authentication & Token management
  auth(action, details = null) {
    const time = formatTime();
    console.log(`%c[AUTH]%c ${time} » ${action}`, BADGE_STYLES.AUTH, 'color: inherit; font-weight: bold;', details || '');
  },

  // Browser Application Tab (Local Storage, Session Storage, Cookies)
  storage(action, key, value) {
    const time = formatTime();
    console.log(`%c[APPLICATION TAB]%c ${time} » ${action} [${key}]:`, BADGE_STYLES.STORAGE, 'color: inherit;', value);
  },

  // General info
  info(message) {
    const time = formatTime();
    console.log(`%c[LuxeStay]%c ${time} » ${message}`, BADGE_STYLES.INFO, 'color: inherit;');
  }
};
