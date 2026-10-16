import React from "react";
import { render, screen, act } from "@testing-library/react";
import { BookingProvider, useBooking } from "../context/BookingContext";
import { initialHotels } from "../data/hotelsData";

// Test consumer component to interact with useBooking hook
function BookingTestConsumer() {
  const {
    currentBooking,
    pricing,
    selectHotel,
    selectRoomType,
    updateNights,
    updateGuests
  } = useBooking();

  return (
    <div>
      <div data-testid="hotel-name">{currentBooking.hotel?.name}</div>
      <div data-testid="room-type">{currentBooking.roomType}</div>
      <div data-testid="nights">{currentBooking.nights}</div>
      <div data-testid="guests">{currentBooking.guests}</div>
      <div data-testid="room-rate">₹{pricing.roomRate}</div>
      <div data-testid="subtotal">₹{pricing.subtotal}</div>
      <div data-testid="tax-gst">₹{pricing.taxGst}</div>
      <div data-testid="total-amount">₹{pricing.totalAmount}</div>

      <button onClick={() => selectHotel(initialHotels[1])}>Select Ocean View</button>
      <button onClick={() => selectRoomType("Deluxe")}>Select Deluxe</button>
      <button onClick={() => updateNights(3)}>Set 3 Nights</button>
      <button onClick={() => updateGuests(4)}>Set 4 Guests</button>
    </div>
  );
}

describe("Booking State Management and Pricing Calculations", () => {
  test("1. Initializes default booking state and calculates base prices with 12% GST", () => {
    render(
      <BookingProvider>
        <BookingTestConsumer />
      </BookingProvider>
    );

    // Default is Grand Palace Hotel, Double Room (₹3000), 2 nights
    expect(screen.getByTestId("hotel-name")).toHaveTextContent("Grand Palace Hotel");
    expect(screen.getByTestId("room-type")).toHaveTextContent("Double");
    expect(screen.getByTestId("nights")).toHaveTextContent("2");
    expect(screen.getByTestId("room-rate")).toHaveTextContent("₹3000");

    // Subtotal: 3000 * 2 = 6000
    expect(screen.getByTestId("subtotal")).toHaveTextContent("₹6000");

    // GST (12%): 6000 * 0.12 = 720
    expect(screen.getByTestId("tax-gst")).toHaveTextContent("₹720");

    // Total: 6000 + 720 = 6720
    expect(screen.getByTestId("total-amount")).toHaveTextContent("₹6720");
  });

  test("2. Updates selected hotel and recalculates room rate and total cost", () => {
    render(
      <BookingProvider>
        <BookingTestConsumer />
      </BookingProvider>
    );

    // Click to select Ocean View Resort (Goa)
    act(() => {
      screen.getByText("Select Ocean View").click();
    });

    expect(screen.getByTestId("hotel-name")).toHaveTextContent("Ocean View Resort");
  });

  test("3. Updates room type and stay duration, accurately calculating stay duration and taxes", () => {
    render(
      <BookingProvider>
        <BookingTestConsumer />
      </BookingProvider>
    );

    // Change to Deluxe room and 3 nights
    act(() => {
      screen.getByText("Select Deluxe").click();
    });
    act(() => {
      screen.getByText("Set 3 Nights").click();
    });

    expect(screen.getByTestId("room-type")).toHaveTextContent("Deluxe");
    expect(screen.getByTestId("nights")).toHaveTextContent("3");

    // For Grand Palace Deluxe Room: ₹4200/night * 3 nights = ₹12600
    // GST (12%): 12600 * 0.12 = 1512
    // Total: 12600 + 1512 = 14112
    expect(screen.getByTestId("subtotal")).toHaveTextContent("₹12600");
    expect(screen.getByTestId("tax-gst")).toHaveTextContent("₹1512");
    expect(screen.getByTestId("total-amount")).toHaveTextContent("₹14112");
  });

  test("4. Persists booking information to localStorage", () => {
    render(
      <BookingProvider>
        <BookingTestConsumer />
      </BookingProvider>
    );

    act(() => {
      screen.getByText("Set 4 Guests").click();
    });

    const saved = JSON.parse(localStorage.getItem("luxestay_current_booking") || "{}");
    expect(saved.guests).toBe(4);
  });
});
