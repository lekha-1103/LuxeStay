import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center"
        }}>
          <div style={{
            background: "#ffffff",
            padding: "2.5rem",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            maxWidth: "500px",
            border: "1px solid #fee2e2"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 style={{ color: "#991b1b", marginBottom: "0.5rem" }}>Something went wrong</h2>
            <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
              An unexpected error occurred while rendering this page.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                padding: "0.75rem 1.75rem",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
