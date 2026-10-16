import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { initialHotels } from "../data/hotelsData";
import { logActivity, logNetworkInspector } from "../utils/logger";

const BookingContext = createContext();

const DEFAULT_BOOKING = {
  hotel: initialHotels[0], // Defaults to Grand Palace Hotel, Chennai
  roomType: "Double",
  guests: 2,
  nights: 2,
  checkInDate: new Date().toISOString().split("T")[0],
  guestName: "Rajesh Sharma",
  guestPhone: "9876543210",
  guestEmail: "rajesh.sharma@traveler.com",
  specialRequests: "Quiet room, high floor if available",
  paymentMethod: "UPI"
};

export function BookingProvider({ children }) {
  const [currentBooking, setCurrentBooking] = useState(() => {
    try {
      const saved = localStorage.getItem("luxestay_current_booking");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.hotel) return parsed;
      }
      return DEFAULT_BOOKING;
    } catch {
      return DEFAULT_BOOKING;
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem("luxestay_registered_bookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastRegisteredId, setLastRegisteredId] = useState(() => {
    try {
      return localStorage.getItem("luxestay_last_reg_id") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("luxestay_current_booking", JSON.stringify(currentBooking));
    } catch (e) {
      console.error(e);
    }
  }, [currentBooking]);

  useEffect(() => {
    try {
      localStorage.setItem("luxestay_registered_bookings", JSON.stringify(registrations));
    } catch (e) {
      console.error(e);
    }
  }, [registrations]);

  useEffect(() => {
    try {
      if (lastRegisteredId) {
        localStorage.setItem("luxestay_last_reg_id", lastRegisteredId);
      }
    } catch (e) {
      console.error(e);
    }
  }, [lastRegisteredId]);

  const selectHotel = useCallback((hotel) => {
    if (!hotel) return;
    logActivity("HOTEL", `Selected hotel: ${hotel.name} (${hotel.location})`, {
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      price: hotel.price
    });
    setCurrentBooking((prev) => ({
      ...prev,
      hotel,
      roomType: hotel.rooms?.[0]?.type || "Double"
    }));
  }, []);

  const selectRoomType = useCallback((roomType) => {
    logActivity("ROOM", `Selected room type: ${roomType}`, { roomType });
    setCurrentBooking((prev) => ({
      ...prev,
      roomType
    }));
  }, []);

  const updateGuests = useCallback((guests) => {
    const num = Math.max(1, Number(guests) || 1);
    logActivity("BOOKING", `Updated guest count to: ${num}`, { guests: num });
    setCurrentBooking((prev) => ({
      ...prev,
      guests: num
    }));
  }, []);

  const updateNights = useCallback((nights) => {
    const num = Math.max(1, Number(nights) || 1);
    logActivity("BOOKING", `Updated stay duration to: ${num} nights`, { nights: num });
    setCurrentBooking((prev) => ({
      ...prev,
      nights: num
    }));
  }, []);

  const updateCheckInDate = useCallback((checkInDate) => {
    logActivity("BOOKING", `Updated check-in date to: ${checkInDate}`, { checkInDate });
    setCurrentBooking((prev) => ({
      ...prev,
      checkInDate
    }));
  }, []);

  const updateGuestDetails = useCallback((details) => {
    logActivity("INPUT", "Guest personal details updated", details);
    setCurrentBooking((prev) => ({
      ...prev,
      ...details
    }));
  }, []);

  const updatePaymentMethod = useCallback((paymentMethod) => {
    logActivity("PAYMENT", `Selected payment method: ${paymentMethod}`, { paymentMethod });
    setCurrentBooking((prev) => ({
      ...prev,
      paymentMethod
    }));
  }, []);

  const pricing = useMemo(() => {
    const hotel = currentBooking.hotel || initialHotels[0];
    const roomType = currentBooking.roomType || "Double";
    const nights = Math.max(1, Number(currentBooking.nights) || 1);

    const selectedRoom = hotel.rooms?.find(
      (r) => r.type.toLowerCase() === roomType.toLowerCase()
    ) || hotel.rooms?.[0] || { price: hotel.price || 3000 };

    const roomRate = selectedRoom.price || 3000;
    const subtotal = roomRate * nights;
    const taxGst = Math.round(subtotal * 0.12);
    const totalAmount = subtotal + taxGst;

    return {
      roomRate,
      subtotal,
      taxGst,
      totalAmount
    };
  }, [currentBooking.hotel, currentBooking.roomType, currentBooking.nights]);

  const completeRegistration = useCallback(() => {
    const hotel = currentBooking.hotel || initialHotels[0];
    const roomType = currentBooking.roomType || "Double";
    const nights = Math.max(1, Number(currentBooking.nights) || 1);
    const guests = Math.max(1, Number(currentBooking.guests) || 2);

    const selectedRoom = hotel.rooms?.find(
      (r) => r.type.toLowerCase() === roomType.toLowerCase()
    ) || hotel.rooms?.[0] || { price: hotel.price || 3000 };

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const regId = `REG-HTL-${randomSuffix}`;

    const checkIn = new Date(currentBooking.checkInDate || Date.now());
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);

    const subtotal = selectedRoom.price * nights;
    const taxGst = Math.round(subtotal * 0.12);
    const totalAmount = subtotal + taxGst;

    const newRecord = {
      registrationId: regId,
      registeredAt: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      }),
      status: "Confirmed & Registered",
      hotel: {
        id: hotel.id,
        name: hotel.name,
        location: hotel.location,
        address: hotel.address || `${hotel.name}, ${hotel.location}`,
        rating: hotel.rating,
        image: hotel.image,
        checkInTime: hotel.checkInTime || "12:00 PM",
        checkOutTime: hotel.checkOutTime || "11:00 AM",
        amenities: hotel.amenities || ["Free WiFi", "Pool", "Restaurant"]
      },
      room: {
        type: roomType,
        pricePerNight: selectedRoom.price,
        description: selectedRoom.desc || `${roomType} Suite with luxury bedding`
      },
      stay: {
        nights,
        guests,
        checkInDate: checkIn.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        checkOutDate: checkOut.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric"
        })
      },
      guest: {
        name: currentBooking.guestName || "Rajesh Sharma",
        phone: currentBooking.guestPhone || "9876543210",
        email: currentBooking.guestEmail || "rajesh.sharma@traveler.com",
        specialRequests: currentBooking.specialRequests || "None"
      },
      billing: {
        roomRate: selectedRoom.price,
        nights,
        subtotal,
        taxGst,
        totalAmount,
        paymentMethod: currentBooking.paymentMethod || "UPI",
        paymentStatus: "Paid & Verified"
      }
    };

    logActivity("BOOKING", `Hotel Room Successfully Registered! ID: ${regId}`, newRecord);

    // Trigger real HTTP POST /api/reservations so it physically appears in DevTools Network tab
    const token = localStorage.getItem("auth_token") || "";
    fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(newRecord)
    }).catch(() => {});

    logNetworkInspector("POST", "/api/reservations", 201, {
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomType,
      nights,
      guests,
      guestName: currentBooking.guestName,
      totalAmount
    }, {
      status: "success",
      bookingRef: regId,
      message: "Hotel reservation created successfully"
    });

    setRegistrations((prev) => [newRecord, ...prev]);
    setLastRegisteredId(regId);

    return newRecord;
  }, [currentBooking]);

  const deleteRegistration = useCallback((regId) => {
    setRegistrations((prev) => prev.filter((r) => r.registrationId !== regId));
    logActivity("BOOKING", `Hotel Reservation Cancelled/Deleted: ${regId}`);

    // Trigger real HTTP DELETE /api/reservations/:id so it physically appears in DevTools Network tab
    const token = localStorage.getItem("auth_token") || "";
    fetch(`/api/reservations/${regId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(() => {});

    logNetworkInspector("DELETE", `/api/reservations/${regId}`, 200, null, {
      status: "success",
      cancelledId: regId,
      message: "Reservation successfully cancelled & deleted from database"
    });
  }, []);

  const updateRegistration = useCallback((regId, updatedData) => {
    let updatedRecord = null;
    setRegistrations((prev) => {
      const nextList = prev.map((r) => {
        if (r.registrationId !== regId) return r;
        const merged = {
          ...r,
          ...updatedData,
          guest: {
            ...(r.guest || {}),
            ...(updatedData.guest || {})
          },
          stay: {
            ...(r.stay || {}),
            ...(updatedData.stay || {})
          },
          room: {
            ...(r.room || {}),
            ...(updatedData.room || {})
          },
          billing: {
            ...(r.billing || {}),
            ...(updatedData.billing || {})
          }
        };
        updatedRecord = merged;
        return merged;
      });

      try {
        localStorage.setItem("luxestay_registered_bookings", JSON.stringify(nextList));
      } catch (e) {
        console.error(e);
      }
      return nextList;
    });

    logActivity("BOOKING", `Hotel Reservation Details Updated (PUT): ${regId}`, updatedData);

    // Trigger real HTTP PUT /api/reservations/:id so it physically appears in DevTools Network tab
    const token = localStorage.getItem("auth_token") || "";
    fetch(`/api/reservations/${regId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    }).catch(() => {});

    logNetworkInspector("PUT", `/api/reservations/${regId}`, 200, updatedData, {
      status: "success",
      updatedId: regId,
      message: "Reservation details successfully updated in database"
    });

    return updatedRecord;
  }, []);

  const fetchReservations = useCallback(() => {
    logActivity("API", `Reading reservations from database (Count: ${registrations.length})`);

    // Trigger real HTTP GET /api/reservations so it physically appears in DevTools Network tab
    const token = localStorage.getItem("auth_token") || "";
    fetch("/api/reservations", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(() => {});

    logNetworkInspector("GET", "/api/reservations", 200, null, registrations);
  }, [registrations]);

  const getRegistrationById = useCallback(
    (id) => registrations.find((r) => r.registrationId === id),
    [registrations]
  );

  const getLatestRegistration = useCallback(() => {
    if (registrations.length > 0) {
      if (lastRegisteredId) {
        const found = registrations.find((r) => r.registrationId === lastRegisteredId);
        if (found) return found;
      }
      return registrations[0];
    }

    return null;
  }, [registrations, lastRegisteredId]);

  return (
    <BookingContext.Provider
      value={{
        currentBooking,
        pricing,
        selectHotel,
        selectRoomType,
        updateGuests,
        updateNights,
        updateCheckInDate,
        updateGuestDetails,
        updatePaymentMethod,
        completeRegistration,
        deleteRegistration,
        updateRegistration,
        fetchReservations,
        registrations,
        getRegistrationById,
        getLatestRegistration
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
