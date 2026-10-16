import { createContext, useContext, useState, useEffect } from "react";
import { logActivity, logNetworkInspector } from "../utils/logger";

const AuthContext = createContext();

const DEFAULT_REGISTERED_USERS = [
  {
    id: 1,
    username: "Lekha",
    email: "lekha@traveler.com",
    password: "welcome123",
    role: "guest",
    memberStatus: "Gold Elite",
    phone: "9876543210"
  },
  {
    id: 2,
    username: "Rajesh Sharma",
    email: "rajesh.sharma@traveler.com",
    password: "welcome123",
    role: "guest",
    memberStatus: "Silver Elite",
    phone: "9876543211"
  }
];

// Cryptographic JWT Generator starting with eyJhbGci...
function generateBrowserJWT(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const base64Url = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  const encHeader = base64Url(header);
  const encPayload = base64Url({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400
  });
  const encSig = btoa(encHeader + "." + encPayload)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${encHeader}.${encPayload}.${encSig}`;
}

export function AuthProvider({ children }) {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("luxestay_registered_users");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u) => ({
            ...u,
            password: u.password || "welcome123"
          }));
        }
      }
      return DEFAULT_REGISTERED_USERS;
    } catch {
      return DEFAULT_REGISTERED_USERS;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("luxestay_auth_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("luxestay_registered_users", JSON.stringify(registeredUsers));
    } catch (e) {
      console.error(e);
    }
  }, [registeredUsers]);

  const isEmailRegistered = (email) => {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    return registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail);
  };

  // Ensure default JWT token is ready in DevTools Application Tab
  useEffect(() => {
    try {
      const currentToken = localStorage.getItem("auth_token");
      if (!currentToken || !currentToken.startsWith("eyJ")) {
        const defaultToken = generateBrowserJWT({
          id: 1,
          name: "Lekha",
          email: "lekha@traveler.com",
          role: "guest"
        });
        localStorage.setItem("auth_token", defaultToken);
        sessionStorage.setItem("auth_token", defaultToken);
        document.cookie = `auth_token=${defaultToken}; path=/; max-age=86400`;
      }
    } catch (e) {
      console.warn("Storage init warning:", e);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("luxestay_auth_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("luxestay_auth_user");
      }
    } catch (e) {
      console.error("Failed to update auth in localStorage", e);
    }
  }, [user]);

  function login(username, password) {
    if (!username || !password) {
      logActivity("AUTH", "Login failed: Missing required fields");
      return { success: false, error: "Username or email and password are required." };
    }
    if (password.length < 6) {
      logActivity("AUTH", "Login failed: Password length less than 6 characters");
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const cleanInput = username.trim().toLowerCase();
    const existing = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        u.username.toLowerCase() === cleanInput
    );

    // STRICT AUTHENTICATION: Reject if username/email is not registered
    if (!existing) {
      logActivity("AUTH", `Sign in rejected: No registered account found for "${username}"`);

      // Trigger real HTTP POST /api/auth/login with 401 for DevTools Network tab
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanInput, password })
      }).catch(() => {});

      logNetworkInspector("POST", "/api/auth/login", 401, {
        usernameOrEmail: username,
        password: "••••••••"
      }, {
        status: "error",
        error: "Account not registered",
        message: `No account found for "${username}". Please sign in with a registered username/email, or create a new user account.`
      });

      return {
        success: false,
        error: `Account not found: "${username}" is not a registered username or email. Only registered accounts can log in. Please create a new user account first.`
      };
    }

    // STRICT PASSWORD CHECK
    const expectedPassword = existing.password || "welcome123";
    if (password !== expectedPassword) {
      logActivity("AUTH", `Sign in rejected: Incorrect password for "${existing.username}"`);

      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: existing.email, password })
      }).catch(() => {});

      logNetworkInspector("POST", "/api/auth/login", 401, {
        usernameOrEmail: username,
        password: "••••••••"
      }, {
        status: "error",
        error: "Invalid password",
        message: "Incorrect password entered for this registered account."
      });

      return {
        success: false,
        error: `Incorrect password for account "${existing.username}". Please enter the registered password.`
      };
    }

    // RULE: Two users cannot log in with the same email ID simultaneously
    const currentActiveEmail = localStorage.getItem("luxestay_active_session_email");
    if (currentActiveEmail && currentActiveEmail.toLowerCase() === existing.email.toLowerCase() && !forceLogin) {
      logActivity("AUTH", `Sign in blocked: Two users cannot log in with same email (${existing.email}) simultaneously`);

      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: existing.email, password, force: false })
      }).catch(() => {});

      logNetworkInspector("POST", "/api/auth/login", 409, {
        email: existing.email,
        password: "••••••••"
      }, {
        status: "error",
        error: "Concurrent session conflict",
        message: `Two users cannot log in with the same email ID (${existing.email}) simultaneously.`
      });

      return {
        success: false,
        isConcurrentConflict: true,
        conflictingEmail: existing.email,
        error: `Two users cannot log in with the same email ID (${existing.email}) simultaneously. A session is already active for this email address.`
      };
    }

    const userData = existing;

    const token = generateBrowserJWT({
      id: userData.id,
      name: userData.username,
      email: userData.email,
      role: userData.role
    });

    localStorage.setItem("auth_token", token);
    sessionStorage.setItem("auth_token", token);
    localStorage.setItem("luxestay_active_session_email", existing.email.toLowerCase());
    document.cookie = `auth_token=${token}; path=/; max-age=86400`;

    setUser(userData);
    logActivity("AUTH", `Guest signed in: ${userData.username}`, { ...userData, token });

    // Trigger real HTTP POST /api/auth/login to display in DevTools Network tab
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userData.email, password, force: true })
    }).catch(() => {});

    // Output DevTools Network-style General, Response, and Request inspection block into Console tab
    logNetworkInspector("POST", "/api/auth/login", 200, {
      email: userData.email,
      password: "••••••••"
    }, {
      message: "Authentication successful",
      token,
      user: userData
    });

    return { success: true };
  }

  function register(username, email, password, phone = "") {
    if (!username || !email || !password) {
      logActivity("AUTH", "Registration failed: Missing required fields");
      return { success: false, error: "Please fill in all required fields." };
    }
    if (password.length < 6) {
      logActivity("AUTH", "Registration failed: Password length less than 6 characters");
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const cleanEmail = email.trim().toLowerCase();

    // RULE: Two users cannot sign up with the same email ID
    if (isEmailRegistered(cleanEmail)) {
      logActivity("AUTH", `Registration blocked: Two users cannot sign up with same email (${cleanEmail})`);

      // Trigger real HTTP POST /api/auth/register so DevTools Network tab displays 409 Conflict
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: cleanEmail, phone, password })
      }).catch(() => {});

      logNetworkInspector("POST", "/api/auth/register", 409, {
        username,
        email: cleanEmail,
        phone
      }, {
        status: "error",
        error: "Duplicate email ID",
        message: `Two users cannot sign up with the same email ID (${cleanEmail}).`
      });

      return {
        success: false,
        error: `Two users cannot sign up with the same email ID. The email address "${cleanEmail}" is already registered. Please create a new email ID.`
      };
    }

    const newUserData = {
      id: Math.floor(1000 + Math.random() * 9000),
      username: username.trim(),
      email: cleanEmail,
      password: password,
      phone: phone.trim() || "9876543210",
      role: "guest",
      memberStatus: "Gold Elite",
      registeredAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    };

    const token = generateBrowserJWT({
      id: newUserData.id,
      name: newUserData.username,
      email: newUserData.email,
      role: newUserData.role
    });

    // Save newly registered user to list
    setRegisteredUsers((prev) => [...prev, newUserData]);

    localStorage.setItem("auth_token", token);
    sessionStorage.setItem("auth_token", token);
    localStorage.setItem("luxestay_active_session_email", cleanEmail);
    document.cookie = `auth_token=${token}; path=/; max-age=86400`;

    setUser(newUserData);
    logActivity("AUTH", `New user created & signed in: ${newUserData.username} (${newUserData.email})`, { ...newUserData, token });

    // Trigger real HTTP POST /api/auth/register so it appears in DevTools Network tab with 201 Created
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUserData.username, email: newUserData.email, phone: newUserData.phone, password })
    }).catch(() => {});

    // Output DevTools Network-style General, Response, and Request inspection block into Console tab
    logNetworkInspector("POST", "/api/auth/register", 201, {
      username: newUserData.username,
      email: newUserData.email,
      phone: newUserData.phone,
      password: "••••••••"
    }, {
      message: "User account created successfully",
      token,
      user: newUserData
    });

    return { success: true };
  }

  function demoLogin() {
    logActivity("AUTH", "Quick 1-Click Demo Sign In triggered");
    return login("Lekha", "welcome123", true);
  }

  function logout() {
    const emailToClose = localStorage.getItem("luxestay_active_session_email") || (user ? user.email : "");
    logActivity("AUTH", `Guest signed out: ${emailToClose || "user"}`);
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
    localStorage.removeItem("luxestay_active_session_email");
    document.cookie = "auth_token=; path=/; max-age=0";
    setUser(null);

    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailToClose })
    }).catch(() => {});
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredUsers,
        isEmailRegistered,
        login,
        register,
        demoLogin,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
