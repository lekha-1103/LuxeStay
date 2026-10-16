import { useState, useMemo, useCallback } from "react";
import { initialHotels } from "../data/hotelsData";
import { logActivity } from "../utils/logger";

export function useHotels() {
  const [hotels] = useState(initialHotels);
  const [search, setSearchState] = useState("");
  const [maxPrice, setMaxPriceState] = useState(6000);
  const [rating, setRatingState] = useState(0);
  const [selectedAmenity, setSelectedAmenityState] = useState("All");
  const [sortBy, setSortByState] = useState("recommended");

  const setSearch = useCallback((val) => {
    setSearchState(val);
    if (val.trim()) {
      logActivity("FILTER", `Search query: "${val}"`);
    }
  }, []);

  const setMaxPrice = useCallback((val) => {
    setMaxPriceState(val);
    logActivity("FILTER", `Max price filter adjusted to ₹${val.toLocaleString("en-IN")}`);
  }, []);

  const setRating = useCallback((val) => {
    setRatingState(val);
    logActivity("FILTER", `Star rating filter changed: ${val === 0 ? "All Ratings" : val + "+ Stars"}`);
  }, []);

  const setSelectedAmenity = useCallback((val) => {
    setSelectedAmenityState(val);
    logActivity("FILTER", `Amenity filter: ${val}`);
  }, []);

  const setSortBy = useCallback((val) => {
    setSortByState(val);
    logActivity("FILTER", `Sorting order changed: ${val}`);
  }, []);

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const matchesSearch =
          hotel.name.toLowerCase().includes(search.toLowerCase()) ||
          hotel.location.toLowerCase().includes(search.toLowerCase());

        const matchesPrice = hotel.price <= maxPrice;
        const matchesRating = Number(hotel.rating) >= Number(rating);

        const matchesAmenity =
          selectedAmenity === "All" ||
          hotel.amenities.some((a) =>
            a.toLowerCase().includes(selectedAmenity.toLowerCase())
          );

        return matchesSearch && matchesPrice && matchesRating && matchesAmenity;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return a.id - b.id;
      });
  }, [hotels, search, maxPrice, rating, selectedAmenity, sortBy]);

  const resetFilters = useCallback(() => {
    logActivity("FILTER", "All hotel filters reset to default");
    setSearchState("");
    setMaxPriceState(6000);
    setRatingState(0);
    setSelectedAmenityState("All");
    setSortByState("recommended");
  }, []);

  return {
    hotels,
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
    totalCount: hotels.length,
    matchedCount: filteredHotels.length
  };
}
