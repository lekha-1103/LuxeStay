import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

export function BookingGuest() {
  const { currentBooking, updateGuestDetails } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    guestName: currentBooking.guestName || user?.username || "",
    guestPhone: currentBooking.guestPhone || "",
    guestEmail: currentBooking.guestEmail || user?.email || "",
    specialRequests: currentBooking.specialRequests || ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && !formData.guestName) {
      setFormData((prev) => ({
        ...prev,
        guestName: user.username,
        guestEmail: user.email || prev.guestEmail
      }));
    }
  }, [user]);

  if (!currentBooking.hotel) {
    return (
      <div className="empty-step-prompt">
        <h3>No Hotel Selected</h3>
        <p>Please select a hotel before entering guest registration details.</p>
        <Link to="/hotels" className="btn-primary-sm">
          Browse Available Hotels
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.guestName.trim()) {
      newErrors.guestName = "Guest full name is required for registration";
    }

    if (!formData.guestPhone.trim()) {
      newErrors.guestPhone = "Contact phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.guestPhone.trim())) {
      newErrors.guestPhone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.guestEmail.trim()) {
      newErrors.guestEmail = "Email address is required for booking voucher delivery";
    } else if (!/\S+@\S+\.\S+/.test(formData.guestEmail.trim())) {
      newErrors.guestEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validate()) {
      updateGuestDetails({
        guestName: formData.guestName.trim(),
        guestPhone: formData.guestPhone.trim(),
        guestEmail: formData.guestEmail.trim(),
        specialRequests: formData.specialRequests.trim()
      });
      navigate("/booking/summary");
    }
  };

  return (
    <div className="booking-step-content">
      <div className="step-heading">
        <h2>Step 2: Guest Registration Information</h2>
        <p>Enter the primary guest's personal details for hotel check-in identification.</p>
      </div>

      <form onSubmit={handleNext} className="booking-form">
        <div className="form-grid-2">
          <div className="form-field">
            <label>
              Full Legal Name <span className="req">*</span>
            </label>
            <input
              type="text"
              name="guestName"
              placeholder="e.g. Ramesh Sharma"
              value={formData.guestName}
              onChange={handleChange}
              className={errors.guestName ? "input-error" : ""}
            />
            {errors.guestName && (
              <span className="field-error-msg">{errors.guestName}</span>
            )}
          </div>

          <div className="form-field">
            <label>
              10-Digit Mobile Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              name="guestPhone"
              placeholder="e.g. 9876543210"
              maxLength="10"
              value={formData.guestPhone}
              onChange={handleChange}
              className={errors.guestPhone ? "input-error" : ""}
            />
            {errors.guestPhone && (
              <span className="field-error-msg">{errors.guestPhone}</span>
            )}
          </div>

          <div className="form-field">
            <label>
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              name="guestEmail"
              placeholder="e.g. guest@traveler.com"
              value={formData.guestEmail}
              onChange={handleChange}
              className={errors.guestEmail ? "input-error" : ""}
            />
            {errors.guestEmail && (
              <span className="field-error-msg">{errors.guestEmail}</span>
            )}
          </div>

          <div className="form-field">
            <label>Special Requests (Optional)</label>
            <input
              type="text"
              name="specialRequests"
              placeholder="e.g. High floor, early check-in, extra towels"
              value={formData.specialRequests}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="id-proof-notice">
          ℹ️ <strong>Identification Note:</strong> Government photo ID (Aadhaar / Passport / Driving License) must be presented upon physical check-in at {currentBooking.hotel.name}.
        </div>

        <div className="step-actions">
          <Link to="/booking/room" className="btn-secondary">
            ← Back to Room Selection
          </Link>
          <button type="submit" className="btn-primary">
            Review Booking Summary →
          </button>
        </div>
      </form>
    </div>
  );
}
