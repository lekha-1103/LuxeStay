import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { initialHotels } from "../data/hotelsData";
import { HotelCard } from "../components/HotelCard";

export function Home() {
  const [quickLocation, setQuickLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (quickLocation.trim()) {
      navigate(`/hotels?q=${encodeURIComponent(quickLocation.trim())}`);
    } else {
      navigate("/hotels");
    }
  };

  const featuredHotels = initialHotels.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Premium Hotel Room Booking Portal</span>
          <h1 className="hero-title">
            Reserve Your Dream Stay with Instant Hotel Registration
          </h1>
          <p className="hero-subtitle">
            Experience handcrafted luxury, seamless room registration, and verified amenities across India's top destinations.
          </p>

          <form onSubmit={handleSearch} className="hero-search-box">
            <div className="search-field">
              <span className="field-icon">📍</span>
              <input
                type="text"
                placeholder="Where are you traveling? (e.g., Chennai, Goa, Bangalore)"
                value={quickLocation}
                onChange={(e) => setQuickLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="hero-search-btn">
              Search Hotels
            </button>
          </form>

          <div className="hero-quick-tags">
            <span>Popular Cities:</span>
            {["Chennai", "Goa", "Bangalore", "Jaipur", "Mumbai"].map((city) => (
              <button
                key={city}
                onClick={() => navigate(`/hotels?q=${city}`)}
                className="city-pill-btn"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Value Highlights */}
      <section className="features-grid-section">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant Room Registration</h3>
          <p>Book single, double, or deluxe rooms in 3 quick steps with instant booking confirmation.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Verified Hotel Partners</h3>
          <p>Handpicked heritage palaces, beachfront resorts, and business hotels with 100% verified ratings.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💳</div>
          <h3>Flexible Payment Methods</h3>
          <p>Pay securely via UPI, Credit/Debit cards, Net Banking, or opt for Cash on Arrival.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Detailed Registration Records</h3>
          <p>Instant digital receipt with complete hotel registration breakdown, tax breakdown, and guest voucher.</p>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Luxury Stays</h2>
            <p className="section-desc">Hand-curated accommodations with top guest reviews and premier amenities.</p>
          </div>
          <Link to="/hotels" className="btn-view-all">
            View All Hotels ({initialHotels.length}) →
          </Link>
        </div>

        <div className="hotels-grid">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
}
