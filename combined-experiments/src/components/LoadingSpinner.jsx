import React from "react";

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="lazy-loading-container">
      <div className="lazy-spinner-wrapper">
        <div className="lazy-spinner"></div>
        <p className="lazy-loading-text">{message}</p>
      </div>
    </div>
  );
}
