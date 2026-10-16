export const initialHotels = [
  {
    id: 101,
    name: "Grand Palace Hotel",
    tagline: "Luxury Heritage Stay in the Heart of Chennai",
    location: "Chennai",
    rating: 5,
    price: 3000,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      { type: "Single", price: 2400, capacity: 1, desc: "Comfortable single bed with high-speed WiFi and work desk" },
      { type: "Double", price: 3000, capacity: 2, desc: "Spacious double bedroom with city skyline view" },
      { type: "Deluxe", price: 4200, capacity: 3, desc: "Premium suite with king-size bed, private balcony & bathtub" }
    ],
    amenities: ["Free WiFi", "Swimming Pool", "Multi-Cuisine Restaurant", "Valet Parking", "Fitness Center"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Located centrally in Chennai, Grand Palace Hotel features royal colonial architecture, luxury amenities, and fine dining.",
    reviewsCount: 420,
    address: "48 Anna Salai, Central Chennai, Tamil Nadu - 600002"
  },
  {
    id: 102,
    name: "Ocean View Resort",
    tagline: "Beachfront Paradise with Panoramic Coastal Views",
    location: "Goa",
    rating: 4,
    price: 4000,
    checkInTime: "02:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      { type: "Single", price: 3200, capacity: 1, desc: "Garden-view cozy room with tropical balcony" },
      { type: "Double", price: 4000, capacity: 2, desc: "Ocean-facing double room with sunset view" },
      { type: "Deluxe", price: 5800, capacity: 4, desc: "Private beachside villa with plunge pool access" }
    ],
    amenities: ["Free WiFi", "Private Beach Access", "Infinity Pool", "Beach Bar", "Complimentary Breakfast"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "Nestled directly on Goa's pristine beaches, offering tranquil waves, sunset deck cocktails, and live music.",
    reviewsCount: 560,
    address: "Calangute-Baga Coastal Road, North Goa - 403516"
  },
  {
    id: 103,
    name: "Green Park Hotel",
    tagline: "Eco-Friendly Tech City Retreat",
    location: "Bangalore",
    rating: 4,
    price: 2500,
    checkInTime: "01:00 PM",
    checkOutTime: "11:00 AM",
    rooms: [
      { type: "Single", price: 2000, capacity: 1, desc: "Quiet compact studio room suited for business travelers" },
      { type: "Double", price: 2500, capacity: 2, desc: "Executive double room with park views" },
      { type: "Deluxe", price: 3600, capacity: 3, desc: "Luxury suite with lounge area & smart automation" }
    ],
    amenities: ["Free WiFi", "Gym & Sauna", "Conference Hall", "Airport Shuttle", "Coffee Bistro"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "Surrounded by lush greenery in Bangalore, ideal for corporate executives and leisure travelers alike.",
    reviewsCount: 310,
    address: "12 Residency Road, Ashok Nagar, Bangalore, Karnataka - 560025"
  },
  {
    id: 104,
    name: "Royal Heritage Haveli",
    tagline: "Timeless Rajput Splendor & Courtyard Hospitality",
    location: "Jaipur",
    rating: 5,
    price: 4500,
    checkInTime: "12:00 PM",
    checkOutTime: "10:00 AM",
    rooms: [
      { type: "Single", price: 3500, capacity: 1, desc: "Historic single room with hand-painted fresco ceilings" },
      { type: "Double", price: 4500, capacity: 2, desc: "Royal deluxe room with antique wooden furnishings" },
      { type: "Deluxe", price: 6500, capacity: 4, desc: "Maharaja grand suite with private terrace courtyard" }
    ],
    amenities: ["Free WiFi", "Folk Dance Evenings", "Rooftop Restaurant", "Ayurvedic Spa", "Royal Courtyard"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    description: "A restored 18th-century palace offering authentic Rajasthani dining, majestic courtyards, and cultural evenings.",
    reviewsCount: 480,
    address: "Heritage Zone, Old Amer Road, Jaipur, Rajasthan - 302002"
  },
  {
    id: 105,
    name: "Azure Bay Luxury Suites",
    tagline: "Ultra-Modern Skyline Living by the Marine Drive",
    location: "Mumbai",
    rating: 5,
    price: 4800,
    checkInTime: "02:00 PM",
    checkOutTime: "12:00 PM",
    rooms: [
      { type: "Single", price: 3800, capacity: 1, desc: "Modern smart room with high-speed fiber connection" },
      { type: "Double", price: 4800, capacity: 2, desc: "Sea-facing room overlooking Arabian Sea" },
      { type: "Deluxe", price: 7200, capacity: 3, desc: "Sky penthouse with private jacuzzi & 24/7 butler service" }
    ],
    amenities: ["Free WiFi", "Rooftop Infinity Pool", "24/7 Butler Service", "Cocktail Lounge", "Valet Parking"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    description: "Iconic high-rise luxury hotel on Mumbai's coast with stunning waterfront sunset views and Michelin-standard dining.",
    reviewsCount: 650,
    address: "7 Marine Drive, Nariman Point, Mumbai, Maharashtra - 400021"
  }
];
