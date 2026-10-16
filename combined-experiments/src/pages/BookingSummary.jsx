import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function BookingSummary() {
  const { currentBooking, pricing, completeRegistration } = useBooking();
  const navigate = useNavigate();

  const hotel = currentBooking.hotel;

  const checkIn = new Date(currentBooking.checkInDate || Date.now());
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + (currentBooking.nights || 1));

  const formattedCheckIn = checkIn.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const formattedCheckOut = checkOut.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const handleProceedToPayment = () => {
    navigate("/checkout");
  };

  const handleInstantConfirm = () => {
    const record = completeRegistration();
    navigate("/confirmation", { state: { booking: record } });
  };

  return (
    <div className="booking-step-content">
      <div className="step-heading">
        <h2>Step 3: Review Registration & Cost Summary</h2>
        <p>Verify your stay parameters and guest information before finalizing your booking.</p>
      </div>

      <div className="summary-cards-grid">
        {/* Left Column: Stay & Guest Details */}
        <div className="summary-left-col">
          <div className="summary-info-block">
            <h3 className="block-title">🏨 Hotel & Property Details</h3>
            <div className="info-row">
              <span className="info-key">Hotel Name:</span>
              <strong className="info-val">{hotel?.name || "Grand Palace Hotel"}</strong>
            </div>
            <div className="info-row">
              <span className="info-key">City / Location:</span>
              <span className="info-val">{hotel?.location || "Chennai"}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Address:</span>
              <span className="info-val">{hotel?.address || "Central Chennai, Tamil Nadu"}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Star Rating:</span>
              <span className="info-val">★ {hotel?.rating || 5}.0 Luxury Standard</span>
            </div>
          </div>

          <div className="summary-info-block">
            <h3 className="block-title">🛏️ Stay & Room Configuration</h3>
            <div className="info-row">
              <span className="info-key">Selected Room:</span>
              <strong className="info-val">{currentBooking.roomType} Room Suite</strong>
            </div>
            <div className="info-row">
              <span className="info-key">Dates of Stay:</span>
              <span className="info-val">{formattedCheckIn} → {formattedCheckOut}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Duration:</span>
              <span className="info-val">{currentBooking.nights} {currentBooking.nights === 1 ? "Night" : "Nights"}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Total Guests:</span>
              <span className="info-val">{currentBooking.guests} {currentBooking.guests === 1 ? "Person" : "Persons"}</span>
            </div>
          </div>

          <div className="summary-info-block">
            <h3 className="block-title">👤 Registered Guest Information</h3>
            <div className="info-row">
              <span className="info-key">Guest Name:</span>
              <strong className="info-val">{currentBooking.guestName || "Rajesh Sharma"}</strong>
            </div>
            <div className="info-row">
              <span className="info-key">Contact Phone:</span>
              <span className="info-val">{currentBooking.guestPhone || "9876543210"}</span>
            </div>
            <div className="info-row">
              <span className="info-key">Email ID:</span>
              <span className="info-val">{currentBooking.guestEmail || "guest@traveler.com"}</span>
            </div>
            {currentBooking.specialRequests && (
              <div className="info-row">
                <span className="info-key">Special Requests:</span>
                <span className="info-val">{currentBooking.specialRequests}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing Breakdown */}
        <div className="summary-right-col">
          <div className="price-receipt-card">
            <h3>Billing & Pricing Breakdown</h3>

            <div className="receipt-line">
              <span>{currentBooking.roomType} Room (₹{pricing.roomRate.toLocaleString("en-IN")} × {currentBooking.nights} {currentBooking.nights === 1 ? "night" : "nights"})</span>
              <strong>₹{pricing.subtotal.toLocaleString("en-IN")}</strong>
            </div>

            <div className="receipt-line">
              <span>Hotel GST Tax (12%)</span>
              <strong>₹{pricing.taxGst.toLocaleString("en-IN")}</strong>
            </div>

            <div className="receipt-line discount">
              <span>Online Booking Discount</span>
              <span className="free-tag">Free Included</span>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-total-line">
              <span>Total Payable Amount</span>
              <span className="total-figure">₹{pricing.totalAmount.toLocaleString("en-IN")}</span>
            </div>

            <p className="inclusive-note">Includes all applicable room taxes and complimentary amenities.</p>

            <button
              onClick={handleInstantConfirm}
              className="btn-confirm-instant"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#ffffff",
                border: "none",
                padding: "0.9rem",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: "pointer",
                marginBottom: "0.75rem",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)"
              }}
            >
              ✓ Confirm Booking & View Details
            </button>

            <button
              onClick={handleProceedToPayment}
              className="btn-proceed-pay"
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.08)",
                color: "#93c5fd",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "1rem"
              }}
            >
              💳 Choose Payment Method (UPI / Card) →
            </button>

            <div className="security-assurances">
              <span>🔒 256-Bit SSL Encrypted</span>
              <span>• Instant Confirmation Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <Link to="/booking/guest" className="btn-secondary">
          ← Edit Guest Details
        </Link>
      </div>
    </div>
  );
}
