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
