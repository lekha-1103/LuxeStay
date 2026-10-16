// ==============================================================================
// HomePage Component - LuxeStay Luxury Hotel Booking
// ==============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hotelLogger } from '../utils/logger';

export function HomePage() {
  const [quickCity, setQuickCity] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    hotelLogger.touch(`Hero Quick Search triggered for city: "${quickCity || 'All'}"`);
    navigate(`/hotels${quickCity ? `?city=${encodeURIComponent(quickCity)}` : ''}`);
  };

  const destinations = [
    { name: 'Mumbai', hotels: '14 Properties', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
    { name: 'Goa', hotels: '22 Resorts', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Bengaluru', hotels: '18 Properties', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Delhi', hotels: '16 Palaces', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-eyebrow">✨ Welcome to LuxeStay Hospitality</span>
          <h1 className="hero-title">Experience India's Finest Luxury Stays &amp; Heritage Palaces</h1>
          <p className="hero-subtitle">
            Handpicked 5-star properties, ocean-facing beachfront resorts, and royal suites with verified tariffs,
            instant reservations, and zero cancellation fee.
          </p>

          {/* Quick Search Form */}
          <form onSubmit={handleQuickSearch} className="hero-search-bar">
            <div className="search-field">
              <span className="field-icon">📍</span>
              <select
                className="search-select"
                value={quickCity}
                onChange={(e) => setQuickCity(e.target.value)}
                aria-label="Select destination city"
              >
                <option value="">Where would you like to stay?</option>
                <option value="Mumbai">Mumbai (Gateway &amp; Marine Drive)</option>
                <option value="Goa">Goa (Beaches &amp; Coastal Resorts)</option>
                <option value="Bengaluru">Bengaluru (Garden City &amp; Tech Hub)</option>
                <option value="Delhi">Delhi (Diplomatic Enclave &amp; Palaces)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-hero-search">
              Explore Hotels
            </button>
          </form>

          {/* Trust stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Luxury Hotels</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Guest Rating</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Verified Stays</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="destinations-section">
        <div className="section-header-center">
          <h2 className="section-heading">Popular Destinations</h2>
          <p className="section-subheading">Choose your next unforgettable luxury getaway across prime Indian destinations.</p>
        </div>

        <div className="destinations-grid">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="destination-card"
              onClick={() => {
                hotelLogger.touch(`Clicked destination: ${dest.name}`);
                navigate(`/hotels?city=${encodeURIComponent(dest.name)}`);
              }}
              role="button"
              tabIndex={0}
            >
              <img src={dest.img} alt={dest.name} className="dest-image" loading="lazy" />
              <div className="dest-overlay">
                <h3 className="dest-name">{dest.name}</h3>
                <span className="dest-count">{dest.hotels}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose LuxeStay */}
      <section className="features-section">
        <div className="section-header-center">
          <h2 className="section-heading">Why Book with LuxeStay</h2>
          <p className="section-subheading">Uncompromising standards designed for an effortless booking experience.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">💎</span>
            <h3 className="feature-title">Curated 5-Star Luxury</h3>
            <p className="feature-desc">Every hotel and resort in our portfolio undergoes rigorous on-site quality inspection.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3 className="feature-title">Instant Token Confirmation</h3>
            <p className="feature-desc">Real-time room inventory reservation with verified booking reference generated instantly.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🛡️</span>
            <h3 className="feature-title">Flexible Reservation Updates</h3>
            <p className="feature-desc">Easily update your stay dates, guest count, or cancel your booking with zero hassle.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🏷️</span>
            <h3 className="feature-title">Exclusive Member Tariffs</h3>
            <p className="feature-desc">Enjoy direct corporate rates and promotional coupon discounts on all premium suites.</p>
          </div>
        </div>
      </section>

      {/* Direct Booking Call to Action */}
      <section className="cta-banner">
        <div className="cta-content">
          <h2>Ready to plan your luxury stay?</h2>
          <p>Browse our catalog of iconic properties and reserve your room today.</p>
          <Link
            to="/hotels"
            className="btn btn-cta"
            onClick={() => hotelLogger.touch('Clicked CTA: Browse All Hotels')}
          >
            Browse All Hotels &amp; Suites
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
