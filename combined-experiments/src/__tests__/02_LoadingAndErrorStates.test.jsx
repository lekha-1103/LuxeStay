import React, { Suspense, lazy } from "react";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorBoundary } from "../components/ErrorBoundary";

// A component that simulates throwing an error for ErrorBoundary testing
function ProblemChild({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error("Simulated rendering crash in hotel room booking");
  }
  return <div>Normal Content Loaded</div>;
}

// A lazy component that resolves asynchronously
const MockLazyComponent = lazy(
  () =>
    new Promise((resolve) =>
      setTimeout(
        () => resolve({ default: () => <div data-testid="lazy-loaded-content">Lazy Loaded Hotel Page</div> }),
        50
      )
    )
);

describe("Loading, Error States, and Lazy Loading with React Suspense", () => {
  test("1. Renders LoadingSpinner fallback with default and custom messages", () => {
    const { rerender } = render(<LoadingSpinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    rerender(<LoadingSpinner message="Loading hotel details and available rooms..." />);
    expect(screen.getByText("Loading hotel details and available rooms...")).toBeInTheDocument();
  });

  test("2. ErrorBoundary catches rendering exceptions and displays friendly error UI", () => {
    // Suppress console.error in this test because React logs boundary errors
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Homepage/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  test("3. React Suspense shows fallback spinner while lazy component loads and renders upon resolution", async () => {
    render(
      <Suspense fallback={<LoadingSpinner message="Loading lazy component..." />}>
        <MockLazyComponent />
      </Suspense>
    );

    // Initial state: fallback spinner is displayed
    expect(screen.getByText("Loading lazy component...")).toBeInTheDocument();

    // After resolution: lazy content appears
    const lazyElement = await screen.findByTestId("lazy-loaded-content");
    expect(lazyElement).toBeInTheDocument();
    expect(screen.queryByText("Loading lazy component...")).not.toBeInTheDocument();
  });
});
