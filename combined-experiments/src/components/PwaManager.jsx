import { useState, useEffect } from "react";
import { logActivity } from "../utils/logger";

export function PwaManager() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swUpdateAvailable, setSwUpdateAvailable] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      logActivity("PWA", "Network status: Online restored");
    };

    const handleOffline = () => {
      setIsOffline(true);
      logActivity("PWA", "Network status: Offline detected. Safe offline mode activated.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for PWA installation prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      logActivity("PWA", "PWA Install prompt captured and ready");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Check if app is running as installed standalone PWA
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    // Check for Service Worker updates if supported
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setSwUpdateAvailable(true);
                logActivity("PWA", "Service Worker update ready");
              }
            });
          }
        });
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      setShowInstallHelp(!showInstallHelp);
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    logActivity("PWA", `Install prompt outcome: ${outcome}`);
    if (outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  const handleUpdateApp = () => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      {/* 1. Offline Notification Banner */}
      {isOffline && (
        <div className="offline-banner" role="alert" data-testid="offline-banner">
          <div className="offline-banner-content">
            <span className="offline-icon">📡</span>
            <div className="offline-text">
              <strong>Offline Mode Active:</strong> You are browsing cached hotels and pages. Live room reservations, authentication, and payments require an internet connection.
            </div>
          </div>
        </div>
      )}

      {/* 2. Service Worker Update Notification */}
      {swUpdateAvailable && (
        <div className="pwa-update-bar" data-testid="pwa-update-banner">
          <span>🚀 A new version of LuxeStay is available!</span>
          <button className="btn-pwa-update" onClick={handleUpdateApp}>
            Update & Refresh
          </button>
        </div>
      )}

      {/* 3. PWA Install Floating Prompt / Header Bar */}
      {!isInstalled && installPrompt && (
        <div className="pwa-install-banner" data-testid="pwa-install-banner">
          <div className="pwa-install-info">
            <span className="pwa-app-icon">🏨</span>
            <div>
              <strong>Install Hotel Room Booking</strong>
              <p>Add to your home screen for instant offline access and fast bookings</p>
            </div>
          </div>
          <div className="pwa-install-actions">
            <button className="btn-pwa-install" onClick={handleInstallClick}>
              Install App
            </button>
            <button
              className="btn-pwa-dismiss"
              onClick={() => setInstallPrompt(null)}
              aria-label="Dismiss installation prompt"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
