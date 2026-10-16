import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import crypto from "crypto";

function generateUniqueJWT(user) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    id: user.id || Math.floor(1000 + Math.random() * 9000),
    name: user.name || "Guest",
    email: user.email || "guest@traveler.com",
    role: user.role || "guest",
    jti: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400
  })).toString("base64url");

  const signature = crypto
    .createHmac("sha256", "luxestay_jwt_secret_key_2026")
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

const INITIAL_HOTELS = [
  {
    id: 101,
    name: "Grand Palace Hotel",
    tagline: "Luxury Heritage Stay in the Heart of Chennai",
    location: "Chennai",
    rating: 5,
    price: 3000,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      { type: "Single", price: 2400, capacity: 1, desc: "Single bed with WiFi" },
      { type: "Double", price: 3000, capacity: 2, desc: "Double bedroom with skyline view" },
      { type: "Deluxe", price: 4200, capacity: 3, desc: "Premium suite with balcony" }
    ],
    amenities: ["Free WiFi", "Swimming Pool", "Restaurant", "Valet Parking"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Located centrally in Chennai, Grand Palace Hotel features royal colonial architecture.",
    address: "48 Anna Salai, Central Chennai - 600002"
  },
  {
    id: 102,
    name: "Ocean View Resort",
    tagline: "Beachfront Paradise with Panoramic Coastal Views",
    location: "Goa",
    rating: 4,
    price: 4000,
    checkInTime: "02:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      { type: "Single", price: 3200, capacity: 1, desc: "Garden-view cozy room" },
      { type: "Double", price: 4000, capacity: 2, desc: "Ocean-facing double room" },
      { type: "Deluxe", price: 5800, capacity: 4, desc: "Private beachside villa" }
    ],
    amenities: ["Free WiFi", "Private Beach Access", "Infinity Pool", "Beach Bar"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "Nestled directly on Goa beaches, offering tranquil waves and sunset deck cocktails.",
    address: "Calangute-Baga Coastal Road, North Goa - 403516"
  },
  {
    id: 103,
    name: "Green Park Hotel",
    tagline: "Eco-Friendly Tech City Retreat",
    location: "Bangalore",
    rating: 4,
    price: 2500,
    checkInTime: "01:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      { type: "Single", price: 2000, capacity: 1, desc: "Quiet compact studio room" },
      { type: "Double", price: 2500, capacity: 2, desc: "Executive double room" },
      { type: "Deluxe", price: 3600, capacity: 3, desc: "Luxury suite with lounge area" }
    ],
    amenities: ["Free WiFi", "Gym & Sauna", "Airport Shuttle"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "Surrounded by lush greenery in Bangalore, ideal for corporate and leisure travelers.",
    address: "12 Residency Road, Bangalore - 560025"
  },
  {
    id: 104,
    name: "Royal Heritage Haveli",
    tagline: "Regal Rajasthani Hospitality & Golden Sand Forts",
    location: "Jaipur",
    rating: 5,
    price: 5500,
    checkInTime: "12:30 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      { type: "Single", price: 3800, capacity: 1, desc: "Courtyard facing heritage room" },
      { type: "Double", price: 5500, capacity: 2, desc: "Maharaja king room with carved jharokha" },
      { type: "Deluxe", price: 7900, capacity: 3, desc: "Royal Haveli suite with private terrace" }
    ],
    amenities: ["Free WiFi", "Rooftop Restaurant", "Folk Music Nights", "Ayurvedic Spa"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    description: "Step into Rajputana royalty with ornate jharokhas, traditional folk evenings, and courtyard dining.",
    address: "Amer Fort Road, Amber, Jaipur - 302001"
  }
];

let registeredUsersStore = [
  { id: 1, name: "Lekha", email: "lekha@traveler.com", password: "welcome123", role: "guest" },
  { id: 2, name: "Rajesh Sharma", email: "rajesh.sharma@traveler.com", password: "welcome123", role: "guest" }
];

let activeSessionsStore = new Set();

let reservationsStore = [
  {
    registrationId: "REG-HTL-101",
    registeredAt: "16 Oct 2026, 09:30 AM",
    status: "Confirmed & Registered",
    hotel: { name: "Grand Palace Hotel", location: "Chennai", price: 3000 },
    room: { type: "Double", pricePerNight: 3000 },
    stay: { nights: 2, guests: 2, checkInDate: "18 Oct 2026", checkOutDate: "20 Oct 2026" },
    guest: { name: "Lekha", email: "lekha@traveler.com", phone: "9876543210" },
    billing: { totalAmount: 6720, paymentMethod: "UPI", paymentStatus: "Paid & Verified" }
  }
];

function apiMockPlugin() {
  return {
    name: "vite-api-mock",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith("/api/")) {
          return next();
        }

        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          return res.end();
        }

        // 1. GET /api/hotels
        if (req.url.startsWith("/api/hotels") && req.method === "GET") {
          const urlObj = new URL(req.url, "http://localhost:5173");
          const search = (urlObj.searchParams.get("search") || "").toLowerCase();
          const filtered = search
            ? INITIAL_HOTELS.filter(h => h.name.toLowerCase().includes(search) || h.location.toLowerCase().includes(search))
            : INITIAL_HOTELS;
          res.statusCode = 200;
          return res.end(JSON.stringify(filtered));
        }

        // 2. POST /api/auth/login (Strict authentication & Single active session enforcement)
        if (req.url.startsWith("/api/auth/login") && req.method === "POST") {
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", () => {
            const parsed = body ? JSON.parse(body) : {};
            const input = (parsed.email || "").toLowerCase().trim();
            const password = parsed.password || "";
            const force = !!parsed.force;

            const existing = registeredUsersStore.find(
              u => u.email.toLowerCase() === input || u.name.toLowerCase() === input
            );

            // Reject unregistered users
            if (!existing) {
              res.statusCode = 401;
              return res.end(JSON.stringify({
                status: "error",
                error: "Account not registered",
                message: `No registered account found for "${input}". Only registered accounts can log in.`
              }));
            }

            // Verify password
            if (existing.password && password !== existing.password) {
              res.statusCode = 401;
              return res.end(JSON.stringify({
                status: "error",
                error: "Invalid password",
                message: "Incorrect password entered for this registered account."
              }));
            }

            // RULE: Two users cannot log in with the same email ID simultaneously
            if (!force && activeSessionsStore.has(existing.email.toLowerCase())) {
              res.statusCode = 409;
              return res.end(JSON.stringify({
                status: "error",
                error: "Active session conflict",
                code: "CONCURRENT_LOGIN_BLOCKED",
                message: `Two users cannot log in with the same email ID (${existing.email}) simultaneously. A session is currently active.`
              }));
            }

            // Mark session active
            activeSessionsStore.add(existing.email.toLowerCase());

            const token = generateUniqueJWT(existing);
            res.statusCode = 200;
            return res.end(JSON.stringify({
              message: "Authentication successful",
              token,
              user: existing
            }));
          });
          return;
        }

        // 2b. POST /api/auth/logout
        if (req.url.startsWith("/api/auth/logout") && req.method === "POST") {
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", () => {
            const parsed = body ? JSON.parse(body) : {};
            const email = (parsed.email || "").toLowerCase().trim();
            if (email) {
              activeSessionsStore.delete(email);
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ message: "Session closed successfully" }));
          });
          return;
        }

        // 2c. POST /api/auth/register (Rule: Two users cannot sign up with the same email ID)
        if (req.url.startsWith("/api/auth/register") && req.method === "POST") {
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", () => {
            const parsed = body ? JSON.parse(body) : {};
            const email = (parsed.email || "").toLowerCase().trim();
            const name = parsed.username || "New Guest";

            // Reject duplicate email: Two users cannot sign up with same email ID
            const isTaken = registeredUsersStore.some(u => u.email.toLowerCase() === email);
            if (isTaken) {
              res.statusCode = 409;
              return res.end(JSON.stringify({
                status: "error",
                error: "Duplicate email ID",
                message: `Two users cannot sign up with the same email ID. The email "${email}" is already registered.`
              }));
            }

            const user = {
              id: Math.floor(1000 + Math.random() * 9000),
              name,
              email: email || "newguest@traveler.com",
              password: parsed.password || "welcome123",
              role: "guest"
            };
            registeredUsersStore.push(user);
            activeSessionsStore.add(user.email.toLowerCase());
            const token = generateUniqueJWT(user);
            res.statusCode = 201;
            return res.end(JSON.stringify({
              message: "User account created successfully",
              token,
              user
            }));
          });
          return;
        }

        // 3. GET /api/reservations
        if (req.url === "/api/reservations" && req.method === "GET") {
          res.statusCode = 200;
          return res.end(JSON.stringify(reservationsStore));
        }

        // 4. POST /api/reservations
        if (req.url === "/api/reservations" && req.method === "POST") {
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", () => {
            const data = body ? JSON.parse(body) : {};
            const bookingRef = data.registrationId || ("REG-HTL-" + Math.floor(10000 + Math.random() * 90000));
            const newRes = { ...data, registrationId: bookingRef, status: "Confirmed & Registered" };
            reservationsStore.unshift(newRes);
            res.statusCode = 201;
            return res.end(JSON.stringify({
              status: "success",
              bookingRef,
              reservation: newRes
            }));
          });
          return;
        }

        // 5. DELETE /api/reservations/:id
        if (req.url.startsWith("/api/reservations/") && req.method === "DELETE") {
          const parts = req.url.split("/");
          const id = parts[parts.length - 1];
          reservationsStore = reservationsStore.filter(r => r.registrationId !== id);
          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: "success",
            cancelledId: id,
            message: `Reservation ${id} successfully cancelled and deleted from database`
          }));
        }

        // 6. PUT /api/reservations/:id (Edit & Update Details)
        if (req.url.startsWith("/api/reservations/") && req.method === "PUT") {
          const parts = req.url.split("?")[0].split("/");
          const id = parts[parts.length - 1];
          let body = "";
          req.on("data", chunk => { body += chunk; });
          req.on("end", () => {
            try {
              const updatedData = body ? JSON.parse(body) : {};
              const index = reservationsStore.findIndex(r => r.registrationId === id);
              if (index !== -1) {
                reservationsStore[index] = {
                  ...reservationsStore[index],
                  ...updatedData,
                  guest: {
                    ...(reservationsStore[index].guest || {}),
                    ...(updatedData.guest || {})
                  },
                  stay: {
                    ...(reservationsStore[index].stay || {}),
                    ...(updatedData.stay || {})
                  },
                  room: {
                    ...(reservationsStore[index].room || {}),
                    ...(updatedData.room || {})
                  },
                  billing: {
                    ...(reservationsStore[index].billing || {}),
                    ...(updatedData.billing || {})
                  }
                };
                res.statusCode = 200;
                return res.end(JSON.stringify({
                  status: "success",
                  message: `Reservation ${id} successfully updated in database`,
                  reservation: reservationsStore[index]
                }));
              } else {
                const newRes = { registrationId: id, ...updatedData };
                reservationsStore.unshift(newRes);
                res.statusCode = 200;
                return res.end(JSON.stringify({
                  status: "success",
                  message: `Reservation ${id} successfully updated in database`,
                  reservation: newRes
                }));
              }
            } catch {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: "Invalid JSON request body" }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  server: { port: 5176 },
  plugins: [
    react(),
    apiMockPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Hotel Room Booking',
        short_name: 'HotelBooking',
        description: 'Luxury Hotel Room Booking & Registration Web Application',
        theme_color: '#1e293b',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/\^\/api/],
        runtimeCaching: [
          {
            // Static Google Fonts
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Hotel images
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'hotel-images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Sensitive API requests (auth, payment, reservations) MUST NOT be cached
            urlPattern: /\/api\/(?:auth|reservations)/i,
            handler: 'NetworkOnly'
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-router') || id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('workbox')) {
              return 'vendor-pwa';
            }
            return 'vendor-libs';
          }
        }
      }
    }
  }
});
