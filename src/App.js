import { useState } from "react";
import "./style.css";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div
      className="app-container"
      style={{
        display: showLogin ? "block" : "grid",
        gridTemplateColumns: "240px 1fr",
        gridTemplateAreas: `"header header" "sidebar main"`,
      }}
    >
      {!showLogin && (
        <>
          <header className="header">
            <img
              src="logoname.png"
              alt="3차원 대장간"
              className="header-logo"
            />
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </header>

          <aside className="sidebar">
            <nav className="sidebar-nav">
              <ul>
                <li className="active">
                  <span className="icon">🟧</span> Dashboard
                </li>
                <li>
                  <span className="icon">🖨️</span> Printers
                </li>
                <li>
                  <span className="icon">📜</span> History
                </li>
                <li>
                  <span className="icon">⚙️</span> Settings
                </li>
              </ul>
            </nav>
          </aside>

          <main className="main-content">
            <div className="card printer-feed">
              <div className="feed-placeholder">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="3D Printer Cam"
                />
              </div>
            </div>

            <div className="card printer-status">
              <h3>Printer Status</h3>
              <div className="status-gauges">
                <Gauge label="Nozzle: 200°C" />
                <Gauge label="Bed: 60°C" />
              </div>

              <div className="status-info">
                <p>
                  <strong>File:</strong> modern_sculpture.gcode
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={{ color: "#fd7e14", fontWeight: "bold" }}>
                    Printing...
                  </span>
                </p>
                <p>
                  <strong>Time:</strong> 04h 12m remaining
                </p>
              </div>
            </div>

            <div className="card live-monitoring">
              <h3>Live Monitoring</h3>
              <div className="progress-container">
                <span className="percentage-text">40%</span>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
              <div className="monitoring-buttons">
                <button className="btn-action">Pause</button>
                <button className="btn-action btn-cancel">Cancel</button>
              </div>
            </div>

            <div className="card gcode-viz">
              <h3>G-Code Visualization</h3>
              <div className="viz-sphere"></div>
            </div>
          </main>
        </>
      )}

      {showLogin && (
        <div className="login-overlay">
          <div className="login-box">
            <h2>Welcome Back</h2>
            <input type="text" className="login-input" placeholder="Username" />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
            />
            <button className="btn-login-submit">Login</button>
          </div>
          <button className="btn-back" onClick={() => setShowLogin(false)}>
            ← Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

function Gauge({ label }) {
  return (
    <div className="gauge-wrapper">
      <div className="gauge-meter">
        <div className="gauge-bg"></div>
        <div className="gauge-fill"></div>
        <div className="gauge-cover"></div>
        <div className="gauge-pointer"></div>
      </div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}
