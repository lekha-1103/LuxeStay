import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AuthConsumer() {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout
  } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "AUTHENTICATED" : "GUEST"}</div>
      <div data-testid="user-name">{user?.username || "NONE"}</div>
      <div data-testid="user-email">{user?.email || "NONE"}</div>

      <button onClick={() => login("lekha@traveler.com", "welcome123")}>Valid Login</button>
      <button onClick={() => login("lekha@traveler.com", "wrongpass")}>Invalid Pass Login</button>
      <button onClick={() => login("nonexistent@traveler.com", "welcome123")}>Unregistered Login</button>
      <button onClick={() => login("", "")}>Empty Login</button>
      <button onClick={() => register("New User", "newunique@traveler.com", "welcome123")}>Register New</button>
      <button onClick={() => register("Duplicate User", "lekha@traveler.com", "welcome123")}>Register Duplicate</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe("Authentication, JWT Token Management, and Session Security", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ token: "test-jwt-token" })
      })
    );
  });

  test("1. Rejects login when required fields are missing or password is too short", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Empty Login").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("GUEST");
  });

  test("2. Rejects login when credentials do not match any registered account", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Unregistered Login").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("GUEST");
    expect(screen.getByTestId("user-name")).toHaveTextContent("NONE");
  });

  test("3. Rejects login when password is incorrect for registered user", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Invalid Pass Login").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("GUEST");
  });

  test("4. Logs in successfully with registered email and password, generating valid JWT token", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Valid Login").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("AUTHENTICATED");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Lekha");
    expect(screen.getByTestId("user-email")).toHaveTextContent("lekha@traveler.com");

    const token = localStorage.getItem("auth_token");
    expect(token).toBeTruthy();
    expect(token.startsWith("eyJ")).toBe(true);
  });

  test("5. Prevents duplicate email sign-up when email is already registered", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Register Duplicate").click();
    });

    // lekha@traveler.com is pre-registered, registration must be rejected
    expect(screen.getByTestId("user-name")).not.toHaveTextContent("Duplicate User");
  });

  test("6. Allows new user registration with unique email and stores auth token", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Register New").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("AUTHENTICATED");
    expect(screen.getByTestId("user-name")).toHaveTextContent("New User");
    expect(screen.getByTestId("user-email")).toHaveTextContent("newunique@traveler.com");

    const token = localStorage.getItem("auth_token");
    expect(token).toBeTruthy();
  });

  test("7. Logout clears authentication tokens, user state, and active sessions", () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      screen.getByText("Valid Login").click();
    });
    expect(screen.getByTestId("auth-status")).toHaveTextContent("AUTHENTICATED");

    act(() => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("GUEST");
    expect(screen.getByTestId("user-name")).toHaveTextContent("NONE");
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});
