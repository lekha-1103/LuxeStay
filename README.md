# Hotel Room Booking & Registration Web Application

A full-stack modern React hotel room booking and guest registration portal. The application allows users to discover luxury hotels across top destinations, filter rooms, complete multi-step guest registration, and view comprehensive registration slips and digital vouchers.

---

### Features

- **Hotel Discovery & Filtering**: Search hotels by city, price range, star rating, and amenities.
- **Dynamic Property Details**: View detailed hotel property records, room categories, addresses, and check-in/out policies.
- **Multi-Step Room Registration**:
  - **Step 1 - Room & Dates**: Select room categories (Single, Double, Deluxe), stay duration, and guest counts.
  - **Step 2 - Guest Identification**: Enter verified guest names, 10-digit mobile numbers, email addresses, and special preferences.
  - **Step 3 - Summary & Breakdown**: Detailed price calculation with GST room taxes and real-time computation.
- **Payment & Checkout**: Secure checkout with UPI, Credit/Debit cards, Net Banking, or Cash on Arrival.
- **Registration Voucher Slip**: Complete digital receipt detailing hotel registration parameters, registration reference ID, stay dates, guest profile, billing breakdown, and print voucher action.
- **Guest Authentication**: Secure user login with profile badges and protected registration flows.

---

### Project Structure

```
d:/unit 3/
├── combined-experiments/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # User authentication & session state
│   │   │   └── BookingContext.jsx       # Room booking & registration management
│   │   ├── hooks/
│   │   │   └── useHotels.js             # Filter, search & sort logic
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar & user profile
│   │   │   ├── HotelCard.jsx            # Reusable property card
│   │   │   ├── ProtectedRoute.jsx       # Auth route guards
│   │   │   └── ErrorBoundary.jsx        # Fallback error recovery
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Landing page & quick search
│   │   │   ├── Hotels.jsx               # Property catalog & filters
│   │   │   ├── HotelDetails.jsx         # Property details & room selector
│   │   │   ├── BookingLayout.jsx        # 3-step registration layout
│   │   │   ├── BookingRoom.jsx          # Room selection & date step
│   │   │   ├── BookingGuest.jsx         # Guest personal details step
│   │   │   ├── BookingSummary.jsx       # Summary & billing breakdown
│   │   │   ├── Checkout.jsx             # Payment method selection
│   │   │   ├── RegistrationDetails.jsx  # Complete hotel registration slip
│   │   │   ├── MyBookings.jsx           # Guest registrations history
│   │   │   └── Login.jsx                # Guest sign-in form
│   │   ├── data/
│   │   │   └── hotelsData.js            # Hotel inventory dataset
│   │   ├── App.jsx                      # Master application router
│   │   ├── App.css                      # Modern responsive styling
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

---

### How to Run

From the project root:
```bash
npm run dev
```

Or navigate to `combined-experiments`:
```bash
cd combined-experiments && npm run dev
```

---

## Experiment 3: Deploy Hotel Booking Application
**Topics:** Netlify, Vercel, GitHub Pages

### a) Create the Production Build
```bash
# Standard Production Build (for Netlify & Vercel)
npm run build

# GitHub Pages Production Build (with repository subfolder base /LuxeStay/)
npm run build:gh
```
Output directory: `combined-experiments/dist/`

### b) Deploy on GitHub Pages
- **Live Branch:** `gh-pages` (containing built static assets)
- **CI/CD:** Automated via `.github/workflows/deploy.yml`
- **SPA Routing:** Supported with `public/404.html` redirection trick and query decoder in `index.html`.
- **Live URL:** [https://lekha-1103.github.io/LuxeStay/](https://lekha-1103.github.io/LuxeStay/)

### c) Deploy on Netlify
- **Configuration:** `netlify.toml` with `base = "combined-experiments"` and `publish = "dist"`.
- **SPA Routing:** Configured via `public/_redirects` (`/*  /index.html  200`).
- **Dashboard Import:** Connect `lekha-1103/LuxeStay` on Netlify for automatic continuous deployment.

### d) Deploy on Vercel
- **Configuration:** `vercel.json` with build command, output directory, and rewrite rules.
- **Dashboard Import:** Connect `lekha-1103/LuxeStay` on Vercel for zero-config automatic continuous deployment.

### e) Verify Functionality
All test suites pass (25/25 tests passed):
```bash
npm test
```
Tested features: Hotel browsing, search & filters, multi-step booking, billing calculation, checkout, registration slip, and PWA offline support.

### f) Deployment Comparison
| Criteria | GitHub Pages | Netlify | Vercel |
| :--- | :--- | :--- | :--- |
| **Hosting Model** | Static repository hosting | Global Edge CDN | Global Edge CDN |
| **SPA Routing** | `404.html` redirect trick | Native 200 rewrite (`_redirects`) | Native rewrite (`vercel.json`) |
| **Base URL** | `/LuxeStay/` subfolder | Root domain (`/`) | Root domain (`/`) |
| **Deploy Previews** | Manual | Automatic on PRs | Automatic on PRs |
| **Build Time** | ~1m 30s (Actions) | ~35s | ~30s |

