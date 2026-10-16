import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "../pages/Home";
import { Hotels } from "../pages/Hotels";
import { AuthProvider } from "../context/AuthContext";
import { BookingProvider } from "../context/BookingContext";

const renderWithProviders = (ui, { route = "/" } = {}) => {
  return render(
    <AuthProvider>
      <BookingProvider>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </BookingProvider>
    </AuthProvider>
  );
};

describe("Experiment 1: Hotel Browsing, Search, and Filtering", () => {
  test("1. Renders Home page with hero banner and featured properties", () => {
    renderWithProviders(<Home />);

    expect(screen.getByText(/Reserve Your Dream Stay/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Luxury Stays/i)).toBeInTheDocument();
    expect(screen.getByText("Grand Palace Hotel")).toBeInTheDocument();
  });

  test("2. Renders Hotel List page with catalog hotels", () => {
    renderWithProviders(<Hotels />);

    expect(screen.getByText(/Explore Available Hotels/i)).toBeInTheDocument();
    expect(screen.getByText("Grand Palace Hotel")).toBeInTheDocument();
    expect(screen.getByText("Ocean View Resort")).toBeInTheDocument();
    expect(screen.getByText("Green Park Hotel")).toBeInTheDocument();
  });

  test("3. Searches and filters hotels by location or hotel name", () => {
    renderWithProviders(<Hotels />);

    const searchInput = screen.getByPlaceholderText(/e\.g\. Chennai, Goa, Grand Palace\.\.\./i);
    fireEvent.change(searchInput, { target: { value: "Goa" } });

    expect(screen.getByText("Ocean View Resort")).toBeInTheDocument();
    expect(screen.queryByText("Grand Palace Hotel")).not.toBeInTheDocument();
  });

  test("4. Displays no-results message when filter matches no hotels", () => {
    renderWithProviders(<Hotels />);

    const searchInput = screen.getByPlaceholderText(/e\.g\. Chennai, Goa, Grand Palace\.\.\./i);
    fireEvent.change(searchInput, { target: { value: "NonExistentCityXYZ" } });

    expect(screen.getByText(/No hotels match your filters/i)).toBeInTheDocument();
  });

  test("5. Filters hotels by star rating using combobox", () => {
    renderWithProviders(<Hotels />);

    const selects = screen.getAllByRole("combobox");
    const ratingSelect = selects[0];
    fireEvent.change(ratingSelect, { target: { value: "5" } });

    expect(screen.getByText("Grand Palace Hotel")).toBeInTheDocument();
  });
});
