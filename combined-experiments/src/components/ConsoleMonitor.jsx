import { useState, useEffect } from "react";
import { subscribeToLogs, clearLogs } from "../utils/logger";

export function ConsoleMonitor() {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return subscribeToLogs(setLogs);
  }, []);

  const handleCopy = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.category}] ${l.message} ${l.details ? JSON.stringify(l.details) : ""}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeColors = {
    NAVIGATE: "#2563eb",
    HOTEL: "#7c3aed",
    ROOM: "#0284c7",
    BOOKING: "#059669",
    FILTER: "#d97706",
    INPUT: "#475569",
    AUTH: "#dc2626",
    PRICING: "#0891b2"
  };

  return (
    <div className="console-monitor-container no-print">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="console-toggle-pill"
          title="Open Live Console Feed"
        >
          <span className="dot"></span>
          💻 Console Output ({logs.length})
        </button>
      ) : (
        <div className="console-panel">
          <div className="console-panel-header">
            <div className="title-area">
              <span className="terminal-icon">📟</span>
              <strong>Activity Console Monitor</strong>
              <span className="event-count-chip">{logs.length} events</span>
            </div>
            <div className="header-actions">
              <button
                onClick={handleCopy}
                className="btn-console-tool"
                title="Copy all logs"
              >
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>
              <button
                onClick={clearLogs}
                className="btn-console-tool"
                title="Clear console"
              >
                🗑️ Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-console-tool close-btn"
                title="Minimize console"
              >
                ▼ Minimize
              </button>
            </div>
          </div>

          <div className="console-logs-feed">
            {logs.length === 0 ? (
              <div className="console-empty">
                Listening for actions... Click around, select hotels, rooms, or fill forms to see console output.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="console-log-row">
                  <span className="log-time">{log.timestamp}</span>
                  <span
                    className="log-category-badge"
                    style={{ backgroundColor: badgeColors[log.category] || "#475569" }}
                  >
                    {log.category}
                  </span>
                  <span className="log-message">{log.message}</span>
                  {log.details && (
                    <pre className="log-details-block">
                      {typeof log.details === "object"
                        ? JSON.stringify(log.details, null, 2)
                        : String(log.details)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
