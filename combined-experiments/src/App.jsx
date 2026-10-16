import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navbar } from "./components/Navbar";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { PwaManager } from "./components/PwaManager";
import { logActivity } from "./utils/logger";

import "./App.css";

// Lazy-loaded pages with React.lazy and dynamic code splitting
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home || m.default })));
const Hotels = lazy(() => import("./pages/Hotels").then((m) => ({ default: m.Hotels || m.default })));
const HotelDetails = lazy(() => import("./pages/HotelDetails").then((m) => ({ default: m.HotelDetails || m.default })));
const BookingLayout = lazy(() => import("./pages/BookingLayout").then((m) => ({ default: m.BookingLayout || m.default })));
const BookingRoom = lazy(() => import("./pages/BookingRoom").then((m) => ({ default: m.BookingRoom || m.default })));
const BookingGuest = lazy(() => import("./pages/BookingGuest").then((m) => ({ default: m.BookingGuest || m.default })));
const BookingSummary = lazy(() => import("./pages/BookingSummary").then((m) => ({ default: m.BookingSummary || m.default })));
const Checkout = lazy(() => import("./pages/Checkout").then((m) => ({ default: m.Checkout || m.default })));
const Confirmation = lazy(() => import("./pages/Confirmation").then((m) => ({ default: m.Confirmation || m.default })));
const RegistrationDetails = lazy(() => import("./pages/RegistrationDetails").then((m) => ({ default: m.RegistrationDetails || m.default })));
const MyBookings = lazy(() => import("./pages/MyBookings").then((m) => ({ default: m.MyBookings || m.default })));
const Login = lazy(() => import("./pages/Login").then((m) => ({ default: m.Login || m.default })));

function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    logActivity("NAVIGATE", `Navigated to: ${location.pathname}${location.search}`, {
      path: location.pathname,
      search: location.search
    });
  }, [location]);

  return null;
}

export default function App() {
  useEffect(() => {
    logActivity("SYSTEM", "LuxeStay Hotel Registration App Initialized & Ready");
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BookingProvider>
          <BrowserRouter>
            <RouteLogger />
            <div className="app-shell">
              <PwaManager />
              <Navbar />
              <main className="main-content">
                <Suspense fallback={<LoadingSpinner message="Loading LuxeStay..." />}>
                  <Routes>
                    {/* Public Discovery Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/hotels" element={<Hotels />} />
                    <Route path="/hotel/:id" element={<HotelDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Login defaultMode="register" />} />

                    {/* Multi-step Room Booking Flow */}
                    <Route path="/booking" element={<BookingLayout />}>
                      <Route index element={<Navigate to="room" replace />} />
                      <Route path="room" element={<BookingRoom />} />
                      <Route path="guest" element={<BookingGuest />} />
                      <Route path="summary" element={<BookingSummary />} />
                    </Route>

                    {/* Payment & Checkout */}
                    <Route path="/checkout" element={<Checkout />} />

                    {/* Booking Confirmation & Registration Details */}
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/registration/:id" element={<RegistrationDetails />} />
                    <Route path="/registration-confirmed" element={<Confirmation />} />

                    {/* User's Booking History */}
                    <Route path="/registrations" element={<MyBookings />} />

                    {/* Catch-all fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>

              <footer className="footer-shell">
                <div className="footer-inner">
                  <div className="footer-brand">
                    <span className="logo-icon">🏨</span>
                    <span><strong>LuxeStay</strong> Hotel Room Booking & Registration Portal</span>
                  </div>
                  <p className="footer-copy">
                    © {new Date().getFullYear()} LuxeStay Hospitality Services. All rights reserved. Instant online room booking and guest registration verification.
                  </p>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </BookingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
