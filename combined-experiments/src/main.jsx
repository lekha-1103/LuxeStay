import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { logNetworkInspector } from "./utils/logger";

// Expose hotelApi on window for instant testing in DevTools Console & Network Tab
window.hotelApi = {
  GET_Hotels: async (search = "") => {
    const url = `/api/hotels${search ? `?search=${encodeURIComponent(search)}` : ""}`;
    const res = await fetch(url);
    const list = await res.json();
    logNetworkInspector("GET", url, 200, null, list);
    return list;
  },
  POST_Login: async (email = "lekha@traveler.com", password = "admin123") => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      sessionStorage.setItem("auth_token", data.token);
      document.cookie = `auth_token=${data.token}; path=/; max-age=86400`;
    }
    logNetworkInspector("POST", "/api/auth/login", 200, { email, password: "••••••" }, data);
    return data;
  },
  GET_Reservations: async () => {
    const token = localStorage.getItem("auth_token") || "";
    const res = await fetch('/api/reservations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const list = await res.json();
    logNetworkInspector("GET", "/api/reservations", 200, null, list);
    return list;
  },
  POST_Reservation: async (reservationData = {}) => {
    const token = localStorage.getItem("auth_token") || "";
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reservationData)
    });
    const result = await res.json();
    logNetworkInspector("POST", "/api/reservations", 201, reservationData, result);
    return result;
  },
  DELETE_Reservation: async (reservationId = "REG-HTL-101") => {
    const token = localStorage.getItem("auth_token") || "";
    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    logNetworkInspector("DELETE", `/api/reservations/${reservationId}`, 200, null, data);
    return data;
  }
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
