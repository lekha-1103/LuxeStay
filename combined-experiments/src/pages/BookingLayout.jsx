import { NavLink, Outlet, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function BookingLayout() {
  const { currentBooking } = useBooking();

  return (
    <div className="booking-layout-page">
      <div className="booking-layout-header">
        <h1>Hotel Room Registration</h1>
        <p>Complete the 3 registration steps below to confirm your hotel reservation.</p>

        {currentBooking.hotel ? (
          <div className="selected-hotel-strip">
            <span className="hotel-dot">🏨</span>
            <span className="hotel-name-selected">
              Registering at: <strong>{currentBooking.hotel.name}</strong> ({currentBooking.hotel.location})
            </span>
            <Link to="/hotels" className="change-hotel-link">
              Change Hotel
            </Link>
          </div>
        ) : (
          <div className="no-hotel-warning-strip">
            ⚠️ Please <Link to="/hotels">choose a hotel first</Link> to complete registration.
          </div>
        )}

        {/* Step Indicator Tabs using NavLink */}
        <div className="booking-steps-nav">
          <NavLink
            to="/booking/room"
            className={({ isActive }) => (isActive ? "step-tab active" : "step-tab")}
          >
            <span className="step-num">1</span>
            <span className="step-label">Room & Dates</span>
          </NavLink>

          <span className="step-divider">→</span>

          <NavLink
            to="/booking/guest"
            className={({ isActive }) => (isActive ? "step-tab active" : "step-tab")}
          >
            <span className="step-num">2</span>
            <span className="step-label">Guest Details</span>
          </NavLink>

          <span className="step-divider">→</span>

          <NavLink
            to="/booking/summary"
            className={({ isActive }) => (isActive ? "step-tab active" : "step-tab")}
          >
            <span className="step-num">3</span>
            <span className="step-label">Summary & Cost</span>
          </NavLink>
        </div>
      </div>

      <div className="booking-outlet-card">
        <Outlet />
      </div>
    </div>
  );
}
