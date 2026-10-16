import { useParams, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function RegistrationDetails() {
  const { id } = useParams();
  const { getRegistrationById, getLatestRegistration, currentBooking, pricing } = useBooking();

  const registration = (id ? getRegistrationById(id) : null) || getLatestRegistration() || {
    registrationId: id || ("REG-HTL-" + Math.floor(10000 + Math.random() * 90000)),
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
      email: currentBooking.guestEmail || "rajesh.sharma@traveler.com",
      specialRequests: currentBooking.specialRequests || "None"
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
    <div className="registration-details-page">
      {/* Top Banner Notice */}
      <div className="registration-status-banner">
        <div className="status-badge-wrap">
          <span className="status-indicator-dot"></span>
          <span className="status-text">{status}</span>
        </div>
        <h1 className="banner-title">Hotel Room Registration Successful</h1>
        <p className="banner-sub">
          Your room has been registered and verified at {hotel.name}. A confirmation voucher has been generated below.
        </p>
      </div>

      {/* Main Registration Voucher Card */}
      <div className="registration-voucher-card printable-slip">
        {/* Slip Header */}
        <div className="voucher-header">
          <div className="voucher-brand">
            <span className="brand-icon">🏨</span>
            <div>
              <h2 className="brand-title">LuxeStay Hotels</h2>
              <span className="brand-subtitle">Official Hotel Registration Slip</span>
            </div>
          </div>

          <div className="voucher-meta">
            <div className="reg-id-badge">
              <span className="label">Registration ID</span>
              <span className="code">{registrationId}</span>
            </div>
            <div className="reg-date-badge">
              <span className="label">Registered On:</span>
              <span className="val">{registeredAt}</span>
            </div>
          </div>
        </div>

        <div className="voucher-divider"></div>

        {/* 4-Column Metric Summary */}
        <div className="voucher-metrics-grid">
          <div className="metric-box">
            <span className="metric-label">Check-in</span>
            <span className="metric-val">{stay.checkInDate}</span>
            <span className="metric-sub">From {hotel.checkInTime}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Check-out</span>
            <span className="metric-val">{stay.checkOutDate}</span>
            <span className="metric-sub">By {hotel.checkOutTime}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Room Category</span>
            <span className="metric-val">{room.type} Suite</span>
            <span className="metric-sub">{stay.nights} {stay.nights === 1 ? "Night" : "Nights"} Stay</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">Guests Registered</span>
            <span className="metric-val">{stay.guests} {stay.guests === 1 ? "Guest" : "Guests"}</span>
            <span className="metric-sub">Confirmed Booking</span>
          </div>
        </div>

        {/* Details Sections */}
        <div className="voucher-sections-grid">
          {/* Hotel Property Details */}
          <div className="voucher-section-card">
            <h3 className="section-title">🏨 Registered Hotel Property</h3>
            <div className="details-table">
              <div className="detail-row">
                <span className="key">Hotel Name</span>
                <span className="val highlight">{hotel.name}</span>
              </div>
              <div className="detail-row">
                <span className="key">Destination / City</span>
                <span className="val">{hotel.location}</span>
              </div>
              <div className="detail-row">
                <span className="key">Property Address</span>
                <span className="val">{hotel.address}</span>
              </div>
              <div className="detail-row">
                <span className="key">Star Rating</span>
                <span className="val">★ {hotel.rating}.0 Star Luxury Property</span>
              </div>
              <div className="detail-row">
                <span className="key">Included Amenities</span>
                <span className="val">{hotel.amenities?.join(", ") || "Free WiFi, Room Service"}</span>
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
                <span className="key">Contact Phone</span>
                <span className="val">{guest.phone}</span>
              </div>
              <div className="detail-row">
                <span className="key">Email ID</span>
                <span className="val">{guest.email}</span>
              </div>
              <div className="detail-row">
                <span className="key">Special Requests</span>
                <span className="val">{guest.specialRequests || "None"}</span>
              </div>
              <div className="detail-row">
                <span className="key">Registration Status</span>
                <span className="val status-pill-success">✓ Verified & Registered</span>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="voucher-section-card">
            <h3 className="section-title">🛏️ Room Specifications</h3>
            <div className="details-table">
              <div className="detail-row">
                <span className="key">Room Type</span>
                <span className="val">{room.type} Deluxe Suite</span>
              </div>
              <div className="detail-row">
                <span className="key">Rate per Night</span>
                <span className="val">₹{room.pricePerNight?.toLocaleString("en-IN")}</span>
              </div>
              <div className="detail-row">
                <span className="key">Total Nights</span>
                <span className="val">{stay.nights}</span>
              </div>
              <div className="detail-row">
                <span className="key">Features</span>
                <span className="val">{room.description}</span>
              </div>
            </div>
          </div>

          {/* Payment & Billing Breakdown */}
          <div className="voucher-section-card">
            <h3 className="section-title">💳 Billing & Payment Breakdown</h3>
            <div className="details-table">
              <div className="detail-row">
                <span className="key">Room Charges</span>
                <span className="val">₹{billing.subtotal?.toLocaleString("en-IN")}</span>
              </div>
              <div className="detail-row">
                <span className="key">Taxes & GST (12%)</span>
                <span className="val">₹{billing.taxGst?.toLocaleString("en-IN")}</span>
              </div>
              <div className="detail-row">
                <span className="key">Payment Method</span>
                <span className="val">{billing.paymentMethod}</span>
              </div>
              <div className="detail-row total-highlight-row">
                <span className="key">Total Amount</span>
                <span className="val total-cost">₹{billing.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Footer Instructions */}
        <div className="voucher-footer">
          <p className="checkin-instruction">
            <strong>Check-in Requirement:</strong> Please present this registration ID <strong>{registrationId}</strong> along with a valid government photo ID card at the front desk upon arrival.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="voucher-actions no-print">
        <button onClick={handlePrint} className="btn-print-voucher">
          🖨️ Print Registration Slip
        </button>
        <Link to="/registrations" className="btn-view-all-reg">
          📋 View All My Registrations
        </Link>
        <Link to="/hotels" className="btn-book-another">
          🏨 Book Another Hotel
        </Link>
      </div>
    </div>
  );
}
