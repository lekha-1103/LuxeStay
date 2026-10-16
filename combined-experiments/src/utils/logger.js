// Centralized Logger for Hotel Room Booking & Registration
// Logs formatted entries to browser console and maintains a live event feed

const subscribers = new Set();
const logHistory = [];

export function logActivity(category, message, details = null) {
  const timestamp = new Date().toLocaleTimeString("en-IN", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const entry = {
    id: Date.now() + Math.random(),
    timestamp,
    category,
    message,
    details
  };

  logHistory.unshift(entry);
  if (logHistory.length > 100) logHistory.pop();

  // Distinctive colored styling in DevTools Console
  const colors = {
    NAVIGATE: "background: #2563eb; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    HOTEL: "background: #7c3aed; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    ROOM: "background: #0284c7; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    BOOKING: "background: #059669; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    FILTER: "background: #d97706; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    INPUT: "background: #475569; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    AUTH: "background: #dc2626; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    PRICING: "background: #0891b2; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    API: "background: #0d9488; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;"
  };

  const style = colors[category] || "background: #334155; color: #fff; padding: 2px 6px; border-radius: 3px;";

  if (details !== null && details !== undefined) {
    console.log(`%c[${category}]%c ${timestamp} - ${message}`, style, "color: inherit;", details);
  } else {
    console.log(`%c[${category}]%c ${timestamp} - ${message}`, style, "color: inherit;");
  }

  // Notify active listeners for on-screen console monitor
  subscribers.forEach((cb) => cb([...logHistory]));
}

// DevTools Network-style Request Inspector in Console Tab (matches Network Headers panel)
export function logNetworkInspector(method, path, statusCode = 200, payload = null, response = null) {
  const origin = window.location.origin;
  const fullUrl = `${origin}${path}`;
  const statusText = statusCode === 201 ? "201 Created" : statusCode === 204 ? "204 No Content" : `${statusCode} OK`;
  const token = localStorage.getItem("auth_token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikxla2hhIiwiZW1haWwiOiJsZWtoYUB0cmF2ZWxlci5jb20iLCJyb2xlIjoiZ3Vlc3QiLCJpYXQiOjE3OTIxMjA1OTAsImV4cCI6MTc5MjIwNjk5MH0.bHV4ZXN0YXlfand0X3NpZ25hdHVyZV9zZWN1cmVfMjAyNg";

  const methodColor = method === "GET" ? "#059669" : method === "POST" ? "#2563eb" : method === "PUT" ? "#d97706" : "#dc2626";

  console.groupCollapsed(
    `%c${method}%c ${fullUrl} %c🟢 ${statusText}%c`,
    `background: ${methodColor}; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;`,
    "font-weight: bold; color: inherit; margin: 0 4px;",
    "background: #10b981; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    "color: inherit;"
  );

  console.group("▼ General");
  console.log("Request URL:    ", fullUrl);
  console.log("Request Method: ", method);
  console.log("Status Code:    ", `🟢 ${statusText}`);
  console.log("Remote Address: ", `[::1]:${window.location.port || "5173"}`);
  console.log("Referrer Policy:", "strict-origin-when-cross-origin");
  console.groupEnd();

  console.group("▼ Response headers");
  console.log("Access-Control-Allow-Origin:", origin);
  console.log("Cache-Control:              ", "no-cache");
  console.log("Connection:                 ", "keep-alive");
  console.log("Content-Type:               ", "application/json; charset=utf-8");
  console.groupEnd();

  console.group("▼ Request headers");
  console.log("Accept:        ", "application/json, text/plain, */*");
  console.log("Authorization: ", `Bearer ${token}`);
  console.log("Content-Type:  ", "application/json");
  console.groupEnd();

  if (payload) {
    console.group("▼ Payload");
    console.log(payload);
    console.groupEnd();
  }

  if (response) {
    console.group("▼ Response");
    console.log(response);
    console.groupEnd();
  }

  console.groupEnd();
}

export function subscribeToLogs(callback) {
  subscribers.add(callback);
  callback([...logHistory]);
  return () => subscribers.delete(callback);
}

export function clearLogs() {
  logHistory.length = 0;
  subscribers.forEach((cb) => cb([]));
  console.clear();
  console.log("%c[CONSOLE CLEARED]%c All activity logs reset.", "background: #64748b; color: #fff; padding: 2px 6px; border-radius: 3px;", "color: inherit;");
}
