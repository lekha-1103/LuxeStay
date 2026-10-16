import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function HotelCard({ hotel }) {
  const { selectHotel } = useBooking();
  const navigate = useNavigate();

  const handleBookNow = () => {
    selectHotel(hotel);
    navigate("/booking/room");
  };

  return (
    <div className="hotel-card">
      <div className="hotel-card-image-wrap">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="hotel-card-image"
          loading="lazy"
        />
        <div className="rating-pill">
          ★ {hotel.rating}.0
        </div>
        <div className="location-pill">
          📍 {hotel.location}
        </div>
      </div>

      <div className="hotel-card-body">
        <h3 className="hotel-card-title">{hotel.name}</h3>
        <p className="hotel-card-tagline">{hotel.tagline}</p>

        <div className="hotel-amenities-tags">
          {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity-chip">
              {amenity}
            </span>
          ))}
          {hotel.amenities?.length > 3 && (
            <span className="amenity-chip more">
              +{hotel.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="hotel-card-footer">
          <div className="hotel-price-block">
            <span className="price-label">Starts from</span>
            <div className="price-value">
              <span className="currency">₹</span>
              <span className="amount">{hotel.price.toLocaleString("en-IN")}</span>
              <span className="unit">/ night</span>
            </div>
          </div>

          <div className="hotel-card-buttons">
            <Link to={`/hotel/${hotel.id}`} className="btn-secondary-sm">
              Details
            </Link>
            <button onClick={handleBookNow} className="btn-primary-sm">
              Register Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
