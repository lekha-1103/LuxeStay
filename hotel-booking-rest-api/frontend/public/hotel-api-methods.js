// ==============================================================================
// HOTEL ROOM BOOKING - REST API HTTP METHODS (GET, POST, PUT, DELETE)
// ==============================================================================
// This file is exposed directly in the DevTools Sources tab under localhost:5173.
// Covers:
// - Experiment 1: GET Hotels with Search & Filters
// - Experiment 3: SQLite CRUD (GET, POST, PUT, DELETE Reservations)
// - Experiment 4: POST Login & Token Management (auth_token)
// ==============================================================================

const API_BASE = '/api';

// ==============================================================================
// 1. HTTP GET METHOD - Fetch All Hotel Properties (Experiment 1)
// ==============================================================================
async function httpGetHotels(search = '', location = '') {
  console.log('%c[HTTP GET]%c Fetching hotels from backend database...', 'background: #059669; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;', 'color: inherit;');
  const url = `${API_BASE}/hotels?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  });
  const data = await response.json();
  console.log('[HTTP GET SUCCESS] Hotels received:', data);
  return data;
}

// ==============================================================================
// 2. HTTP POST METHOD - User Login & Token Generation (Experiment 4)
// ==============================================================================
async function httpPostLogin(email = 'student@college.edu', password = 'admin123') {
  console.log('%c[HTTP POST]%c Authenticating user & generating auth_token...', 'background: #dc2626; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;', 'color: inherit;');
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  
  // Store token in Application tab
  if (data.token) {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    sessionStorage.setItem('auth_token', data.token);
    document.cookie = `auth_token=${data.token}; path=/; max-age=86400`;
    console.log('%c[APPLICATION TAB]%c auth_token stored successfully:', 'background: #4338ca; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;', data.token);
  }
  return data;
}

// ==============================================================================
// 3. HTTP GET METHOD - Retrieve Reservation History (SQLite CRUD: READ)
// ==============================================================================
async function httpGetReservations(token = localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikxla2hhIiwiZW1haWwiOiJsZWtoYUB0cmF2ZWxlci5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3OTIxMjA1OTAsImV4cCI6MTc5MjIwNjk5MH0.bHV4ZXN0YXlfand0X3NpZ25hdHVyZV9zZWN1cmVfMjAyNg') {
  console.log('%c[HTTP GET CRUD]%c Reading reservations from SQLite database...', 'background: #0d9488; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;', 'color: inherit;');
  const response = await fetch(`${API_BASE}/reservations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  const data = await response.json();
  console.log('[HTTP GET CRUD SUCCESS] Reservations:', data);
  return data;
}

// ==============================================================================
// 4. HTTP POST METHOD - Create New Hotel Reservation (SQLite CRUD: CREATE)
// ==============================================================================
async function httpPostReservation(reservationData, token = localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikxla2hhIiwiZW1haWwiOiJsZWtoYUB0cmF2ZWxlci5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3OTIxMjA1OTAsImV4cCI6MTc5MjIwNjk5MH0.bHV4ZXN0YXlfand0X3NpZ25hdHVyZV9zZWN1cmVfMjAyNg') {
  console.log('%c[HTTP POST CRUD]%c Creating new reservation in SQLite database...', 'background: #059669; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;', 'color: inherit;');
  const response = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reservationData)
  });
  const data = await response.json();
  console.log('[HTTP POST CRUD SUCCESS] Created Ref:', data.booking_ref, data);
  return data;
}

// ==============================================================================
// 5. HTTP PUT METHOD - Update Existing Reservation Details (SQLite CRUD: UPDATE)
// ==============================================================================
async function httpPutReservation(reservationId, updatedData, token = localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikxla2hhIiwiZW1haWwiOiJsZWtoYUB0cmF2ZWxlci5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3OTIxMjA1OTAsImV4cCI6MTc5MjIwNjk5MH0.bHV4ZXN0YXlfand0X3NpZ25hdHVyZV9zZWN1cmVfMjAyNg') {
  console.log(`%c[HTTP PUT CRUD]%c Updating reservation #${reservationId} in SQLite database...`, 'background: #d97706; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;', 'color: inherit;');
  const response = await fetch(`${API_BASE}/reservations/${reservationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  });
  const data = await response.json();
  console.log('[HTTP PUT CRUD SUCCESS] Updated reservation:', data);
  return data;
}

// ==============================================================================
// 6. HTTP DELETE METHOD - Cancel Reservation (SQLite CRUD: DELETE)
// ==============================================================================
async function httpDeleteReservation(reservationId, token = localStorage.getItem('auth_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikxla2hhIiwiZW1haWwiOiJsZWtoYUB0cmF2ZWxlci5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3OTIxMjA1OTAsImV4cCI6MTc5MjIwNjk5MH0.bHV4ZXN0YXlfand0X3NpZ25hdHVyZV9zZWN1cmVfMjAyNg') {
  console.log(`%c[HTTP DELETE CRUD]%c Cancelling reservation #${reservationId} in SQLite database...`, 'background: #dc2626; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;', 'color: inherit;');
  const response = await fetch(`${API_BASE}/reservations/${reservationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log('[HTTP DELETE CRUD SUCCESS] Cancelled status:', data);
  return data;
}

// Expose on global window object so student can also run directly in DevTools Console!
window.hotelApi = {
  GET_Hotels: httpGetHotels,
  POST_Login: httpPostLogin,
  GET_Reservations: httpGetReservations,
  POST_Reservation: httpPostReservation,
  PUT_Reservation: httpPutReservation,
  DELETE_Reservation: httpDeleteReservation
};

console.log('%c[REST API READY]%c Methods exposed: GET, POST, PUT, DELETE. Inspect in Sources tab -> hotel-api-methods.js', 'background: #2563eb; color: #fff; padding: 2px 6px; border-radius: 3px;', 'color: inherit;');
