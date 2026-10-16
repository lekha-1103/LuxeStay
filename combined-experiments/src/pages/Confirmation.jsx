import { Link, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function Confirmation() {
  const { getLatestRegistration, currentBooking, pricing } = useBooking();
  const location = useLocation();

  const registration = location.state?.booking || getLatestRegistration() || {
    registrationId: "REG-HTL-" + Math.floor(10000 + Math.random() * 90000),
    registeredAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    }),
    status: "Confirmed & Registered",
    hotel: currentBooking.hotel || {
      id: 101,
      name: "Grand Palace Hotel",
      location: "Chennai",
      address: "48 Anna Salai, Central Chennai, Tamil Nadu - 600002",
      rating: 5,
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
      amenities: ["Free WiFi", "Swimming Pool", "Multi-Cuisine Restaurant", "Valet Parking"]
    },
    room: {
      type: currentBooking.roomType || "Double",
      pricePerNight: pricing.roomRate || 3000,
      description: "Comfortable spacious room with premium bedding and city skyline view"
    },
    stay: {
      nights: currentBooking.nights || 2,
      guests: currentBooking.guests || 2,
      checkInDate: new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      checkOutDate: new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    },
    guest: {
      name: currentBooking.guestName || "Rajesh Sharma",
      phone: currentBooking.guestPhone || "9876543210",
      email: currentBooking.guestEmail || "guest@traveler.com",
      specialRequests: currentBooking.specialRequests || "Quiet room requested"
    },
    billing: {
      roomRate: pricing.roomRate || 3000,
      nights: currentBooking.nights || 2,
      subtotal: pricing.subtotal || 6000,
      taxGst: pricing.taxGst || 720,
      totalAmount: pricing.totalAmount || 6720,
      paymentMethod: currentBooking.paymentMethod || "UPI",
      paymentStatus: "Paid & Verified"
    }
  };

  const {
    registrationId,
    registeredAt,
    status,
    hotel,
    room,
    stay,
    guest,
    billing
  } = registration;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="confirmation-page">
      {/* Success Hero Banner */}
      <div className="booking-success-banner">
        <div className="success-icon-badge">✓</div>
        <h1 className="success-title">Booking Confirmed!</h1>
        <p className="success-subtitle">
          Your hotel room has been successfully booked. Here are your complete booking and registration details:
        </p>
      </div>

      {/* Official Booking Details Slip */}
      <div className="registration-voucher-card printable-slip">
        {/* Voucher Header */}
        <div className="voucher-header">
          <div className="voucher-brand">
            <span className="brand-icon">🏨</span>
            <div>
              <h2 className="brand-title">LuxeStay Hotels</h2>
              <span className="brand-subtitle">Official Booking & Registration Confirmation</span>
            </div>
          </div>

          <div className="voucher-meta">
            <div className="reg-id-badge">
              <span className="label">Booking Ref:</span>
              <span className="code">{registrationId}</span>
            </div>
            <div className="reg-date-badge">
              <span className="label">Booked on:</span>
              <span className="val">{registeredAt}</span>
            </div>
          </div>
        </div>

        <div className="voucher-divider"></div>

        {/* 4 Summary Metric Tiles */}
        <div className="voucher-metrics-grid">
          <div className="metric-box">
            <span className="metric-label">Check-in</span>
            <span className="metric-val">{stay.checkInDate}</span>
            <span className="metric-sub">From {hotel.checkInTime || "12:00 PM"}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Check-out</span>
            <span className="metric-val">{stay.checkOutDate}</span>
            <span className="metric-sub">By {hotel.checkOutTime || "11:00 AM"}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Room Category</span>
            <span className="metric-val">{room.type} Suite</span>
            <span className="metric-sub">{stay.nights} {stay.nights === 1 ? "Night" : "Nights"} Duration</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Guests</span>
            <span className="metric-val">{stay.guests} {stay.guests === 1 ? "Guest" : "Guests"}</span>
            <span className="metric-sub">Confirmed Status</span>
          </div>
        </div>

        {/* 4 Key Details Cards */}
        <div className="voucher-sections-grid">
          {/* Hotel Property Details */}
          <div className="voucher-section-card">
            <h3 className="section-title">🏨 Hotel Property Details</h3>
            <div className="details-table">
              <div className="detail-row">
                <span className="key">Hotel Name</span>
                <span className="val highlight">{hotel.name}</span>
              </div>
              <div className="detail-row">
                <span className="key">Location</span>
                <span className="val">{hotel.location}</span>
              </div>
              <div className="detail-row">
                <span className="key">Address</span>
                <span className="val">{hotel.address}</span>
              </div>
              <div className="detail-row">
                <span className="key">Rating</span>
                <span className="val">★ {hotel.rating}.0 Star Luxury Property</span>
              </div>
              <div className="detail-row">
                <span className="key">Amenities Included</span>
                <span className="val">{hotel.amenities?.join(", ") || "Free WiFi, Pool, Parking"}</span>
              </div>
            </div>
          </div>

          {/* Guest Personal Information */}
          <div className="voucher-section-card">
            <h3 className="section-title">👤 Registered Guest Information</h3>
            <div className="details-table">
              <div className="detail-row">
                <span className="key">Primary Guest</span>
                <span className="val highlight">{guest.name}</span>
              </div>
              <div className="detail-row">
                <span className="key">Phone Number</span>
                <span className="val">{guest.phone}</span>
              </div>
              <div className="detail-row">
                <span className="key">Email Address</span>
                <span className="val">{guest.email}</span>
              </div>
              <div className="detail-row">
                <span className="key">Special Requests</span>
                <span className="val">{guest.specialRequests || "None"}</span>
              </div>
              <div className="detail-row">
                <span className="key">Booking Status</span>
                <span className="val status-pill-success">✓ {status}</span>
              </div>
            </div>
          </div>

          {/* Room Configuration */}
          <div className="voucher-section-card">
            <h3 className="section-title">🛏️ Room & Stay Configuration</h3>
            <div className="details-table">
              <div className="detail-row">
                <span className="key">Room Category</span>
                <span className="val">{room.type} Suite</span>
              </div>
              <div className="detail-row">
                <span className="key">Room Rate</span>
                <span className="val">₹{room.pricePerNight?.toLocaleString("en-IN")} / night</span>
              </div>
              <div className="detail-row">
                <span className="key">Stay Duration</span>
                <span className="val">{stay.nights} {stay.nights === 1 ? "Night" : "Nights"}</span>
              </div>
              <div className="detail-row">
                <span className="key">Occupancy</span>
                <span className="val">{stay.guests} {stay.guests === 1 ? "Guest" : "Guests"}</span>
              </div>
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="voucher-section-card">
            <h3 className="section-title">💳 Billing & Payment Breakdown</h3>
            <div className="details-table">
              <div className="detail-row">
                <span className="key">Room Subtotal</span>
                <span className="val">₹{billing.subtotal?.toLocaleString("en-IN")}</span>
              </div>
              <div className="detail-row">
                <span className="key">Hotel GST Tax (12%)</span>
                <span className="val">₹{billing.taxGst?.toLocaleString("en-IN")}</span>
              </div>
              <div className="detail-row">
                <span className="key">Payment Mode</span>
                <span className="val">{billing.paymentMethod}</span>
              </div>
              <div className="detail-row total-highlight-row">
                <span className="key">Total Paid Amount</span>
                <span className="val total-cost">₹{billing.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="voucher-footer">
          <p className="checkin-instruction">
            <strong>Check-in Notice:</strong> Please present your booking confirmation ID <strong>{registrationId}</strong> along with a valid ID card at the front desk of {hotel.name} upon check-in.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="voucher-actions no-print">
        <button onClick={handlePrint} className="btn-print-voucher">
          🖨️ Print Booking Voucher
        </button>
        <Link to="/registrations" className="btn-view-all-reg">
          📋 View All My Bookings
        </Link>
        <Link to="/hotels" className="btn-book-another">
          🏨 Book Another Hotel
        </Link>
        <Link to="/" className="btn-secondary-sm">
          Home
        </Link>
      </div>
    </div>
  );
}
