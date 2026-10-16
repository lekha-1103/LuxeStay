import { useState } from "react";
import { useNavigate, useLocation, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Login({ defaultMode = "login" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" || defaultMode === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);

  // Sign In fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Create New User fields
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [sessionConflict, setSessionConflict] = useState(false);
  const {
    login,
    register,
    demoLogin,
    isAuthenticated,
    user,
    logout,
    isEmailRegistered,
    registeredUsers = []
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/hotels";

  const trimmedEmail = regEmail.trim().toLowerCase();
  const isDuplicateEmail = trimmedEmail.length > 0 && isEmailRegistered(trimmedEmail);

  const handleTabSwitch = (newMode) => {
    setMode(newMode);
    setError("");
    setSessionConflict(false);
    setSearchParams(newMode === "register" ? { mode: "register" } : {});
  };

  const generateUniqueEmail = () => {
    let rand = Math.floor(100 + Math.random() * 900);
    let candidate = `guest${rand}@traveler.com`;
    while (isEmailRegistered(candidate)) {
      rand = Math.floor(100 + Math.random() * 900);
      candidate = `guest${rand}@traveler.com`;
    }
    return { email: candidate, num: rand };
  };

  const handleGenerateFreshEmail = () => {
    const { email } = generateUniqueEmail();
    setRegEmail(email);
    setError("");
  };

  const handleQuickFillNewUser = () => {
    const { email, num } = generateUniqueEmail();
    setRegUsername(`Traveler ${num}`);
    setRegEmail(email);
    setRegPhone("9876543210");
    setRegPassword("welcome123");
    setRegConfirmPassword("welcome123");
    setError("");
  };

  const handleLoginSubmit = (e, force = false) => {
    if (e && e.preventDefault) e.preventDefault();
    const result = login(username, password, force);
    if (!result.success) {
      setError(result.error);
      if (result.isConcurrentConflict) {
        setSessionConflict(true);
      }
      return;
    }
    setError("");
    setSessionConflict(false);
    navigate(redirectPath, { replace: true });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // RULE: Two users cannot sign up with the same email ID
    if (isDuplicateEmail) {
      setError(
        `Two users cannot sign up with the same email ID. The email "${trimmedEmail}" is already registered. Please create a new email ID.`
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match. Please verify both passwords.");
      return;
    }

    const result = register(regUsername, regEmail, regPassword, regPhone);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError("");
    navigate(redirectPath, { replace: true });
  };

  const handleDemoLogin = () => {
    demoLogin();
    navigate(redirectPath, { replace: true });
  };

  if (isAuthenticated && user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-icon">👤</div>
          <h2>Already Signed In</h2>
          <p className="welcome-text">
            You are currently signed in as <strong>{user.username}</strong> ({user.memberStatus}).
          </p>
          <div className="logged-in-actions">
            <Link to="/hotels" className="btn-primary-sm">
              Explore Hotels
            </Link>
            <Link to="/registrations" className="btn-secondary-sm">
              My Registrations
            </Link>
            <button onClick={logout} className="btn-outline-danger">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: mode === "register" ? "500px" : "440px" }}>
        
        {/* Toggle Tabs: Sign In / Create New User */}
        <div className="auth-mode-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => handleTabSwitch("login")}
          >
            <span>🔑</span> Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === "register" ? "active" : ""}`}
            onClick={() => handleTabSwitch("register")}
          >
            <span>👤</span> Create New User
          </button>
        </div>

        {mode === "login" ? (
          <>
            <div className="login-header">
              <div className="login-icon">🏨</div>
              <h2>Guest Sign In</h2>
              <p>Strict Authentication: Sign in with your registered username or email and password.</p>
            </div>

            {/* List of active registered accounts for convenient 1-click select */}
            <div className="registered-accounts-notice" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>🔑 Registered Accounts:</strong>
                <span style={{ fontSize: '0.72rem', color: '#93c5fd' }}>Click to auto-fill</span>
              </div>
              <div className="registered-chips-list">
                {registeredUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    className="registered-chip-btn"
                    onClick={() => {
                      setUsername(u.username || u.email);
                      setPassword(u.password || "welcome123");
                      setError("");
                    }}
                    title={`Click to fill: ${u.username} (${u.email})`}
                  >
                    👤 {u.username} ({u.email})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-field">
                <label>Registered Username or Email *</label>
                <input
                  type="text"
                  placeholder="e.g. lekha@traveler.com or registered username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              <div className="form-field">
                <label>Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              {error && <div className="form-error-alert">{error}</div>}

              {sessionConflict && (
                <div style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => handleLoginSubmit(null, true)}
                    className="btn-demo-login"
                    style={{ width: '100%', borderColor: '#ef4444', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.15)' }}
                  >
                    ⚡ Disconnect Other Active Session & Sign In Here
                  </button>
                </div>
              )}

              <button type="submit" className="btn-login-submit">
                Sign In to Account
              </button>

              <div className="divider-or">
                <span>OR QUICK ACCESS</span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="btn-demo-login"
              >
                ⚡ Quick 1-Click Guest Sign In (Lekha)
              </button>
            </form>

            <div className="login-footer">
              <p>
                Don't have an account yet?{" "}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => handleTabSwitch("register")}
                >
                  Create New User
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="login-header">
              <div className="login-icon">✨</div>
              <h2>Create New User</h2>
              <p>Register a brand new guest account. Two users cannot sign up with the same email ID.</p>
            </div>

            {/* List of already registered accounts */}
            <div className="registered-accounts-notice">
              <div>
                <strong>🔒 Rule: Two users cannot sign up with the same email ID.</strong>
              </div>
              <div style={{ marginTop: '4px', fontSize: '0.74rem', color: '#cbd5e1' }}>
                Existing registered emails (already in use):
              </div>
              <div className="registered-chips-list">
                {registeredUsers.map((u) => (
                  <span key={u.email} className="registered-chip">
                    {u.email}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: '5px', fontSize: '0.73rem', color: '#60a5fa' }}>
                💡 Each user must have a unique email ID.
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="form-field">
                <label>Full Name / Username *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={regUsername}
                  onChange={(e) => {
                    setRegUsername(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              <div className="form-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ margin: 0 }}>New Email Address *</label>
                  <button
                    type="button"
                    onClick={handleGenerateFreshEmail}
                    className="btn-generate-email"
                    title="Generate a brand new unique email address"
                  >
                    ✨ Generate New Email
                  </button>
                </div>
                <input
                  type="email"
                  placeholder="e.g. newtraveler@traveler.com"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    setError("");
                  }}
                  required
                />
                {isDuplicateEmail && (
                  <div className="email-status-badge error">
                    ⚠️ <strong>Two users cannot sign up with the same email ID:</strong> The email <code>{trimmedEmail}</code> is already registered. Please create a new email ID.
                  </div>
                )}
                {!isDuplicateEmail && trimmedEmail.length > 3 && trimmedEmail.includes("@") && (
                  <div className="email-status-badge success">
                    ✓ <strong>Available:</strong> New unique email ID ready for registration.
                  </div>
                )}
              </div>

              <div className="form-field">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={regPhone}
                  onChange={(e) => {
                    setRegPhone(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <div className="form-field">
                <label>Password (min 6 characters) *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              <div className="form-field">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={(e) => {
                    setRegConfirmPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              {error && <div className="form-error-alert">{error}</div>}

              <button
                type="submit"
                className="btn-login-submit"
                disabled={isDuplicateEmail}
                style={{ opacity: isDuplicateEmail ? 0.6 : 1, cursor: isDuplicateEmail ? 'not-allowed' : 'pointer' }}
              >
                Create Account & Sign In
              </button>

              <div className="divider-or">
                <span>OR AUTO-FILL NEW USER</span>
              </div>

              <button
                type="button"
                onClick={handleQuickFillNewUser}
                className="btn-demo-login"
              >
                ⚡ Quick Auto-Fill Fresh New User
              </button>
            </form>

            <div className="login-footer">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-switch-link"
                  onClick={() => handleTabSwitch("login")}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
