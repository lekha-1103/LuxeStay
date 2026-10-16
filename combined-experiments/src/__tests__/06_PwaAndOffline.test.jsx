import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PwaManager } from "../components/PwaManager";

describe("Progressive Web App (PWA) and Offline Functionality", () => {
  let originalOnLine;

  beforeEach(() => {
    originalOnLine = navigator.onLine;
  });

  afterEach(() => {
    Object.defineProperty(navigator, "onLine", {
      value: originalOnLine,
      configurable: true
    });
  });

  test("1. Displays offline warning banner when network is disconnected", () => {
    // Simulate offline status
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true
    });

    render(<PwaManager />);

    expect(screen.getByTestId("offline-banner")).toBeInTheDocument();
    expect(screen.getByText(/Offline Mode Active:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You are browsing cached hotels and pages/i)
    ).toBeInTheDocument();
  });

  test("2. Hides offline banner when network connection is restored", () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      configurable: true
    });

    render(<PwaManager />);
    expect(screen.getByTestId("offline-banner")).toBeInTheDocument();

    // Trigger online event
    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.queryByTestId("offline-banner")).not.toBeInTheDocument();
  });

  test("3. Captures beforeinstallprompt event and renders PWA install banner", () => {
    render(<PwaManager />);

    // Before the prompt event, install banner is not displayed
    expect(screen.queryByTestId("pwa-install-banner")).not.toBeInTheDocument();

    // Create and dispatch mock beforeinstallprompt event
    const mockInstallEvent = new Event("beforeinstallprompt");
    mockInstallEvent.prompt = jest.fn();
    mockInstallEvent.userChoice = Promise.resolve({ outcome: "accepted" });

    act(() => {
      window.dispatchEvent(mockInstallEvent);
    });

    // Install banner should now be visible
    expect(screen.getByTestId("pwa-install-banner")).toBeInTheDocument();
    expect(screen.getByText("Install Hotel Room Booking")).toBeInTheDocument();

    // Clicking dismiss hides the prompt
    const dismissBtn = screen.getByLabelText("Dismiss installation prompt");
    fireEvent.click(dismissBtn);
    expect(screen.queryByTestId("pwa-install-banner")).not.toBeInTheDocument();
  });
});
