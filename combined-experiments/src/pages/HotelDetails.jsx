import { useParams, useNavigate, Link } from "react-router-dom";
import { initialHotels } from "../data/hotelsData";
import { useBooking } from "../context/BookingContext";

export function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectHotel, selectRoomType } = useBooking();

  const hotel = initialHotels.find((h) => h.id === Number(id));

  if (!hotel) {
    return (
      <div className="hotel-not-found">
        <h2>Hotel Not Found</h2>
        <p>We could not find any hotel matching the requested ID #{id}.</p>
        <Link to="/hotels" className="btn-primary-sm">
          Return to Hotel Catalog
        </Link>
      </div>
    );
  }

  const handleSelectRoomAndBook = (roomType) => {
    selectHotel(hotel);
    selectRoomType(roomType);
    navigate("/booking/room");
  };

  return (
    <div className="hotel-details-page">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/hotels">Hotels</Link>
        <span>/</span>
        <span className="current">{hotel.name}</span>
      </nav>

      {/* Main Details Banner */}
      <div className="details-hero">
        <div className="details-hero-image-wrap">
          <img src={hotel.image} alt={hotel.name} className="details-hero-image" />
          <div className="rating-badge-large">★ {hotel.rating}.0 / 5.0</div>
        </div>

        <div className="details-hero-info">
          <div className="hotel-title-group">
            <span className="hotel-city-tag">📍 {hotel.location}</span>
            <h1 className="hotel-name">{hotel.name}</h1>
            <p className="hotel-address">{hotel.address}</p>
          </div>

          <p className="hotel-description">{hotel.description}</p>

          <div className="hotel-timings-grid">
            <div className="timing-box">
              <span className="timing-label">🕒 Check-in</span>
              <span className="timing-val">{hotel.checkInTime}</span>
            </div>
            <div className="timing-box">
              <span className="timing-label">🕚 Check-out</span>
              <span className="timing-val">{hotel.checkOutTime}</span>
            </div>
            <div className="timing-box">
              <span className="timing-label">⭐ Rating</span>
              <span className="timing-val">{hotel.rating} Stars ({hotel.reviewsCount} verified reviews)</span>
            </div>
          </div>

          <div className="amenities-section">
            <h3>Hotel Amenities & Perks</h3>
            <div className="amenities-chips-wrap">
              {hotel.amenities?.map((amenity, idx) => (
                <span key={idx} className="amenity-badge">
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Room Categories */}
      <section className="rooms-section">
        <div className="section-header">
          <div>
            <h2>Select Room Category</h2>
            <p>Choose from our available single, double, or deluxe accommodations.</p>
          </div>
        </div>

        <div className="rooms-grid">
          {hotel.rooms?.map((room, idx) => (
            <div key={idx} className="room-card">
              <div className="room-card-header">
                <span className="room-badge">{room.type} Room</span>
                <span className="room-capacity">👥 Up to {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}</span>
              </div>
              <h3 className="room-title">{room.type} Suite</h3>
              <p className="room-desc">{room.desc}</p>

              <div className="room-price-row">
                <div>
                  <span className="price-tag">₹{room.price.toLocaleString("en-IN")}</span>
                  <span className="price-term"> / night</span>
                </div>
                <button
                  onClick={() => handleSelectRoomAndBook(room.type)}
                  className="btn-book-room"
                >
                  Register This Room →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
