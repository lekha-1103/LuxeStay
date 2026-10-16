import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function Checkout() {
  const { currentBooking, pricing, updatePaymentMethod, completeRegistration } = useBooking();
  const navigate = useNavigate();

  const [paymentOption, setPaymentOption] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentBooking.hotel) {
    return (
      <div className="checkout-page empty-checkout">
        <h2>No Active Reservation</h2>
        <p>Please select a hotel and complete room configuration first.</p>
        <Link to="/hotels" className="btn-primary-sm">
          Browse Available Hotels
        </Link>
      </div>
    );
  }

  const handlePaymentChange = (method) => {
    setPaymentOption(method);
    updatePaymentMethod(method);
    setError("");
  };

  const handleConfirmRegistration = (e) => {
    e.preventDefault();

    if (paymentOption === "UPI") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setError("Please enter a valid UPI ID (e.g., name@okaxis or mobile@upi)");
        return;
      }
    } else if (paymentOption === "Card") {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length < 16) {
        setError("Please enter a valid 16-digit card number");
        return;
      }
      if (!cardExpiry.trim()) {
        setError("Please enter card expiry date (MM/YY)");
        return;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        setError("Please enter a valid 3-digit CVV");
        return;
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      const record = completeRegistration();
      setIsProcessing(false);
      navigate("/confirmation", { state: { booking: record } });
    }, 400);
  };

  return (
    <div className="checkout-page">
      <div className="page-header">
        <h1>Payment & Registration Finalization</h1>
        <p>Select your payment method to finalize registration for {currentBooking.hotel.name}.</p>
      </div>

      <div className="checkout-grid">
        {/* Payment Form */}
        <div className="checkout-form-card">
          <h2 className="card-title">Choose Payment Method</h2>

          <div className="payment-method-selector">
            {[
              { id: "UPI", label: "UPI (Google Pay / PhonePe / Paytm)", icon: "📱" },
              { id: "Card", label: "Credit / Debit Card (Visa / Mastercard / RuPay)", icon: "💳" },
              { id: "Net Banking", label: "Net Banking (All Major Indian Banks)", icon: "🏛️" },
              { id: "Cash on Arrival", label: "Pay at Hotel Desk (Cash / Card on Check-in)", icon: "🏨" }
            ].map((method) => (
              <label
                key={method.id}
                className={`payment-option-tile ${paymentOption === method.id ? "selected" : ""}`}
                onClick={() => handlePaymentChange(method.id)}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentOption === method.id}
                  onChange={() => handlePaymentChange(method.id)}
                />
                <span className="method-icon">{method.icon}</span>
                <span className="method-label">{method.label}</span>
              </label>
            ))}
          </div>

          <form onSubmit={handleConfirmRegistration} className="payment-fields-form">
            {paymentOption === "UPI" && (
              <div className="payment-sub-fields">
                <label>Enter Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  placeholder="e.g. yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setError("");
                  }}
                  required
                />
                <div className="upi-quick-pills">
                  {["@okaxis", "@okhdfcbank", "@paytm", "@ibl"].map((handle) => (
                    <button
                      type="button"
                      key={handle}
                      onClick={() => setUpiId((prev) => (prev ? prev.split("@")[0] + handle : `user${handle}`))}
                      className="upi-pill"
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentOption === "Card" && (
              <div className="payment-sub-fields">
                <div className="form-field">
                  <label>16-Digit Card Number</label>
                  <input
                    type="text"
                    maxLength="19"
                    placeholder="4532 •••• •••• 8892"
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(e.target.value);
                      setError("");
                    }}
                    required
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      maxLength="5"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>CVV / CVC</label>
                    <input
                      type="password"
                      maxLength="3"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentOption === "Net Banking" && (
              <div className="payment-sub-fields">
                <label>Select Bank</label>
                <select className="filter-select">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              </div>
            )}

            {paymentOption === "Cash on Arrival" && (
              <div className="cash-note-box">
                <p>
                  ✓ <strong>No Advance Payment Required:</strong> You can pay the total amount directly at the hotel front desk upon physical check-in.
                </p>
              </div>
            )}

            {error && <div className="payment-error-alert">{error}</div>}

            <button
              type="submit"
              disabled={isProcessing}
              className="btn-confirm-payment"
            >
              {isProcessing
                ? "Verifying & Generating Registration..."
                : `Confirm & Complete Registration (₹${pricing.totalAmount.toLocaleString("en-IN")})`}
            </button>
          </form>
        </div>

        {/* Stay Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="sidebar-card">
            <h3>Reservation Summary</h3>
            <div className="sidebar-hotel-header">
              <img
                src={currentBooking.hotel.image}
                alt={currentBooking.hotel.name}
                className="sidebar-hotel-thumb"
              />
              <div>
                <h4>{currentBooking.hotel.name}</h4>
                <p>📍 {currentBooking.hotel.location}</p>
                <span className="room-type-tag">{currentBooking.roomType} Suite</span>
              </div>
            </div>

            <div className="sidebar-details-list">
              <div className="row">
                <span>Check-in Date</span>
                <strong>{currentBooking.checkInDate}</strong>
              </div>
              <div className="row">
                <span>Duration</span>
                <strong>{currentBooking.nights} {currentBooking.nights === 1 ? "Night" : "Nights"}</strong>
              </div>
              <div className="row">
                <span>Guests</span>
                <strong>{currentBooking.guests} Person(s)</strong>
              </div>
              <div className="row">
                <span>Guest Name</span>
                <strong>{currentBooking.guestName || "Guest"}</strong>
              </div>
              <div className="row">
                <span>Contact Phone</span>
                <strong>{currentBooking.guestPhone || "Not specified"}</strong>
              </div>
            </div>

            <div className="sidebar-divider"></div>

            <div className="sidebar-pricing">
              <div className="price-row">
                <span>Room Charges</span>
                <span>₹{pricing.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="price-row">
                <span>GST Tax (12%)</span>
                <span>₹{pricing.taxGst.toLocaleString("en-IN")}</span>
              </div>
              <div className="price-total-row">
                <span>Total Amount</span>
                <span className="total-highlight">₹{pricing.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
