import { useNavigate, Link } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function BookingRoom() {
  const {
    currentBooking,
    selectRoomType,
    updateGuests,
    updateNights,
    updateCheckInDate,
    pricing
  } = useBooking();
  const navigate = useNavigate();

  if (!currentBooking.hotel) {
    return (
      <div className="empty-step-prompt">
        <h3>No Hotel Selected</h3>
        <p>Please select a hotel from our catalog before choosing your room preferences.</p>
        <Link to="/hotels" className="btn-primary-sm">
          Browse Available Hotels
        </Link>
      </div>
    );
  }

  const hotelRooms = currentBooking.hotel.rooms || [
    { type: "Single", price: 2000, desc: "Single bed room" },
    { type: "Double", price: 2500, desc: "Double bed room" },
    { type: "Deluxe", price: 3500, desc: "Deluxe suite" }
  ];

  const handleNext = (e) => {
    e.preventDefault();
    navigate("/booking/guest");
  };

  return (
    <div className="booking-step-content">
      <div className="step-heading">
        <h2>Step 1: Choose Room & Stay Duration</h2>
        <p>Configure room category, guest occupancy, and check-in dates for {currentBooking.hotel.name}.</p>
      </div>

      <form onSubmit={handleNext} className="booking-form">
        <div className="form-section">
          <label className="section-label">Select Room Category</label>
          <div className="room-type-selector-grid">
            {hotelRooms.map((room) => {
              const isSelected =
                currentBooking.roomType.toLowerCase() === room.type.toLowerCase();
              return (
                <div
                  key={room.type}
                  className={`room-select-box ${isSelected ? "selected" : ""}`}
                  onClick={() => selectRoomType(room.type)}
                >
                  <div className="box-top">
                    <span className="room-type-name">{room.type} Room</span>
                    <span className="room-type-price">₹{room.price.toLocaleString("en-IN")}/night</span>
                  </div>
                  <p className="room-type-desc">{room.desc}</p>
                  <div className="radio-indicator">
                    {isSelected ? "● Selected" : "○ Choose"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-grid-3">
          <div className="form-field">
            <label>Check-in Date</label>
            <input
              type="date"
              value={currentBooking.checkInDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateCheckInDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Number of Nights</label>
            <input
              type="number"
              min="1"
              max="30"
              value={currentBooking.nights}
              onChange={(e) => updateNights(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>Number of Guests</label>
            <input
              type="number"
              min="1"
              max="10"
              value={currentBooking.guests}
              onChange={(e) => updateGuests(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="step-live-price-strip">
          <div className="price-item">
            <span>Room Category:</span>
            <strong>{currentBooking.roomType} Suite</strong>
          </div>
          <div className="price-item">
            <span>Duration:</span>
            <strong>{currentBooking.nights} {currentBooking.nights === 1 ? "Night" : "Nights"}</strong>
          </div>
          <div className="price-item">
            <span>Estimated Subtotal:</span>
            <strong>₹{pricing.subtotal.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="step-actions">
          <Link to="/hotels" className="btn-secondary">
            ← Change Hotel
          </Link>
          <button type="submit" className="btn-primary">
            Continue to Guest Details →
          </button>
        </div>
      </form>
    </div>
  );
}
