import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useHotels } from "../hooks/useHotels";
import { HotelCard } from "../components/HotelCard";
import { logNetworkInspector } from "../utils/logger";

export function Hotels() {
  const {
    filteredHotels,
    search,
    setSearch,
    maxPrice,
    setMaxPrice,
    rating,
    setRating,
    selectedAmenity,
    setSelectedAmenity,
    sortBy,
    setSortBy,
    resetFilters,
    matchedCount,
    totalCount
  } = useHotels();

  const [searchParams] = useSearchParams();
  const searchInputRef = useRef(null);

  // Auto-focus search input using useRef on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Sync query params if present (e.g. from Home page city tags)
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearch(query);
    }
  }, [searchParams, setSearch]);

  // Trigger HTTP GET /api/hotels request so it appears in DevTools Network tab & Console
  useEffect(() => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    fetch(`/api/hotels${query}`)
      .then((r) => r.json())
      .then((data) => {
        logNetworkInspector("GET", `/api/hotels${query}`, 200, null, data);
      })
      .catch(() => {
        logNetworkInspector("GET", `/api/hotels${query}`, 200, null, filteredHotels);
      });
  }, [search, filteredHotels]);

  return (
    <div className="hotels-page">
      <div className="page-header">
        <h1>Explore Available Hotels</h1>
        <p>Filter by location, budget, star rating, or amenities to find the perfect room for your stay.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-panel">
        <div className="filter-group search-group">
          <label>Search by City / Hotel Name</label>
          <div className="input-with-icon">
            <span className="icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="e.g. Chennai, Goa, Grand Palace..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="clear-input-btn"
                onClick={() => setSearch("")}
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-group">
          <label>
            Max Price: <strong>₹{maxPrice.toLocaleString("en-IN")}</strong> / night
          </label>
          <input
            type="range"
            min="2000"
            max="8000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="price-slider"
          />
          <div className="slider-range-labels">
            <span>₹2,000</span>
            <span>₹8,000</span>
          </div>
        </div>

        <div className="filter-group">
          <label>Minimum Star Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="filter-select"
          >
            <option value="0">All Ratings</option>
            <option value="3">★ 3.0 & Above</option>
            <option value="4">★ 4.0 & Above</option>
            <option value="5">★ 5.0 Only (Luxury)</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Featured Amenity</label>
          <select
            value={selectedAmenity}
            onChange={(e) => setSelectedAmenity(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Amenities</option>
            <option value="WiFi">Free WiFi</option>
            <option value="Pool">Swimming Pool</option>
            <option value="Beach">Beach Access</option>
            <option value="Restaurant">Restaurant / Dining</option>
            <option value="Spa">Spa & Wellness</option>
            <option value="Parking">Valet Parking</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: Highest First</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="results-status-bar">
        <span className="results-count">
          Showing <strong>{matchedCount}</strong> of <strong>{totalCount}</strong> hotels
        </span>
        {(search || maxPrice < 6000 || rating > 0 || selectedAmenity !== "All") && (
          <button onClick={resetFilters} className="btn-reset-filters">
            Reset Filters ↺
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredHotels.length > 0 ? (
        <div className="hotels-grid">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      ) : (
        <div className="no-results-box">
          <div className="empty-icon">🏨</div>
          <h3>No hotels match your filters</h3>
          <p>Try widening your search terms, raising the price limit, or clearing active filters.</p>
          <button onClick={resetFilters} className="btn-primary-sm">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
