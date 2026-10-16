import React from "react";
import { render, screen, act } from "@testing-library/react";
import { BookingProvider, useBooking } from "../context/BookingContext";

function ReservationCRUDConsumer() {
  const {
    registrations,
    completeRegistration,
    updateRegistration,
    deleteRegistration,
    getRegistrationById
  } = useBooking();

  return (
    <div>
      <div data-testid="reservations-count">{registrations.length}</div>
      <div data-testid="latest-reg-id">{registrations[0]?.registrationId || "NONE"}</div>
      <div data-testid="latest-guest-name">{registrations[0]?.guest?.name || "NONE"}</div>
      <div data-testid="latest-status">{registrations[0]?.status || "NONE"}</div>

      <button onClick={() => completeRegistration()}>Create Reservation</button>
      <button
        onClick={() => {
          if (registrations[0]) {
            updateRegistration(registrations[0].registrationId, {
              guest: { name: "Updated Guest Lekha" }
            });
          }
        }}
      >
        Update Reservation
      </button>
      <button
        onClick={() => {
          if (registrations[0]) {
            deleteRegistration(registrations[0].registrationId);
          }
        }}
      >
        Cancel Reservation
      </button>
    </div>
  );
}

describe("Reservation CRUD Operations (Create, Read, Update, Delete)", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: "success" })
      })
    );
  });

  test("1. Creates a new reservation with auto-generated registration ID and confirmed status", () => {
    render(
      <BookingProvider>
        <ReservationCRUDConsumer />
      </BookingProvider>
    );

    expect(screen.getByTestId("reservations-count")).toHaveTextContent("0");

    act(() => {
      screen.getByText("Create Reservation").click();
    });

    expect(screen.getByTestId("reservations-count")).toHaveTextContent("1");
    expect(screen.getByTestId("latest-status")).toHaveTextContent("Confirmed & Registered");
    expect(screen.getByTestId("latest-reg-id").textContent).toMatch(/^REG-HTL-/);

    // Verifies mock API POST request was initiated
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/reservations",
      expect.objectContaining({ method: "POST" })
    );
  });

  test("2. Updates reservation guest details via PUT operation", () => {
    render(
      <BookingProvider>
        <ReservationCRUDConsumer />
      </BookingProvider>
    );

    // Create reservation first
    act(() => {
      screen.getByText("Create Reservation").click();
    });

    const regId = screen.getByTestId("latest-reg-id").textContent;

    // Trigger update
    act(() => {
      screen.getByText("Update Reservation").click();
    });

    expect(screen.getByTestId("latest-guest-name")).toHaveTextContent("Updated Guest Lekha");

    // Verifies PUT call was dispatched to /api/reservations/:id
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/reservations/${regId}`,
      expect.objectContaining({ method: "PUT" })
    );
  });

  test("3. Cancels and deletes a reservation via DELETE operation", () => {
    render(
      <BookingProvider>
        <ReservationCRUDConsumer />
      </BookingProvider>
    );

    // Create reservation
    act(() => {
      screen.getByText("Create Reservation").click();
    });
    expect(screen.getByTestId("reservations-count")).toHaveTextContent("1");

    const regId = screen.getByTestId("latest-reg-id").textContent;

    // Trigger deletion / cancel
    act(() => {
      screen.getByText("Cancel Reservation").click();
    });

    expect(screen.getByTestId("reservations-count")).toHaveTextContent("0");
    expect(screen.getByTestId("latest-reg-id")).toHaveTextContent("NONE");

    // Verifies DELETE call was dispatched
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/reservations/${regId}`,
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
