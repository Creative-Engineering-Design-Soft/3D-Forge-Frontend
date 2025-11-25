import { useState } from "react";
import "./style.css";

// 3. 프린터 목록 컴포넌트 정의 (변경 없음)
function PrinterList() {
  // ... (기존 PrinterList 내용) ...
  const printers = [
    {
      name: "Ender 3 Pro",
      ip: "192.168.1.101",
      hwId: "XYZ-123456",
      connected: true,
      status: "Printing",
    },
    {
      name: "CR-10 Max",
      ip: "192.168.1.102",
      hwId: "ABC-789012",
      connected: false,
      status: "Waiting",
    },
    {
      name: "Prusa i3 MK3S+",
      ip: "192.168.1.103",
      hwId: "DEF-345678",
      connected: true,
      status: "Waiting",
    },
  ];

  const getStatusBadge = (status, type) => {
    const statusMap = {
      connected: "연결됨",
      disconnected: "연결 끊김",
      Printing: "출력중",
      Waiting: "대기중",
    };
    const className =
      type === "connection"
        ? status
          ? "connected"
          : "disconnected"
        : status.toLowerCase();

    return (
      <span className={`status-badge ${className}`}>
        {statusMap[status] || statusMap[className] || status}
      </span>
    );
  };

  return (
    <div className="card full-width">
      <h3>프린터 목록</h3>
      <table className="printer-table">
        <thead>
          <tr>
            <th>프린터 이름</th>
            <th>IP 주소</th>
            <th>하드웨어 ID</th>
            <th>연결 상태</th>
            <th>프린트 상태</th>
          </tr>
        </thead>
        <tbody>
          {printers.map((p, index) => (
            <tr key={index}>
              <td data-label="프린터 이름">{p.name}</td>
              <td data-label="IP 주소">{p.ip}</td>
              <td data-label="하드웨어 ID">{p.hwId}</td>
              <td data-label="연결 상태">
                {getStatusBadge(p.connected, "connection")}
              </td>
              <td data-label="프린트 상태">
                {getStatusBadge(p.status, "print")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 기존 대시보드 내용을 별도의 컴포넌트로 분리
function DashboardView({ Gauge }) {
  return (
    // CSS 그리드 적용을 위해 dashboard-layout으로 감쌌습니다.
    <div className="dashboard-layout">
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
    </div>
  );
}
// 5. 히스토리(기록) 컴포넌트 정의
// 5. 히스토리(기록) 컴포넌트 정의 (열 순서 변경: 이름 <-> 시간)
function HistoryView() {
  const historyLogs = [
    {
      id: 1,
      time: "2023-11-25 14:30:05",
      name: "Ender 3 Pro",
      type: "Connected",
      ip: "192.168.1.101",
    },
    {
      id: 2,
      time: "2023-11-25 09:15:22",
      name: "CR-10 Max",
      type: "Disconnected",
      ip: "192.168.1.102",
    },
    {
      id: 3,
      time: "2023-11-24 18:45:00",
      name: "Prusa i3 MK3S+",
      type: "Connected",
      ip: "192.168.1.103",
    },
    {
      id: 4,
      time: "2023-11-24 10:20:11",
      name: "Ender 3 Pro",
      type: "Disconnected",
      ip: "192.168.1.101",
    },
  ];

  return (
    <div className="card full-width">
      <h3>시스템 연결 기록</h3>
      <table className="printer-table">
        <thead>
          <tr>
            {/* ▼ 1. 헤더 순서 변경 (이름이 먼저, 시간이 나중) */}
            <th>프린터 이름</th>
            <th>시간</th>
            <th>이벤트</th>
            <th>IP 주소</th>
          </tr>
        </thead>
        <tbody>
          {historyLogs.map((log) => (
            <tr key={log.id}>
              {/* ▼ 2. 데이터 표시 순서도 똑같이 변경 */}
              <td>{log.name}</td>
              <td>{log.time}</td>

              <td>
                <span
                  className={`status-badge ${
                    log.type === "Connected" ? "connected" : "disconnected"
                  }`}
                >
                  {log.type === "Connected" ? "연결됨" : "연결 해제"}
                </span>
              </td>
              <td>{log.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

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
            {/* ... (헤더 코드 유지) ... */}
            <img src="logo.png" alt="3차원 대장간" className="header-logo" />
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </header>

          <aside className="sidebar">
            <nav className="sidebar-nav">
              <ul>
                {/* Dashboard 클릭 이벤트 설정 완료 */}
                <li
                  className={activeMenu === "dashboard" ? "active" : ""}
                  onClick={() => setActiveMenu("dashboard")}
                >
                  <span className="icon">🟧</span> Dashboard
                </li>

                {/* Printers 클릭 이벤트 설정 완료 */}
                <li
                  className={activeMenu === "printers" ? "active" : ""}
                  onClick={() => setActiveMenu("printers")}
                >
                  <span className="icon">🖨️</span> Printers
                </li>

                {/* History 클릭 이벤트 추가 (완료) */}
                <li
                  className={activeMenu === "history" ? "active" : ""}
                  onClick={() => setActiveMenu("history")}
                >
                  <span className="icon">📜</span> History
                </li>
                {/* Settings 클릭 이벤트 추가 (완료) */}
                <li
                  className={activeMenu === "settings" ? "active" : ""}
                  onClick={() => setActiveMenu("settings")}
                >
                  <span className="icon">⚙️</span> Settings
                </li>
              </ul>
            </nav>
          </aside>

          <main className="main-content">
            {/* 4. main 영역 조건부 렌더링 */}
            {activeMenu === "dashboard" && <DashboardView Gauge={Gauge} />}
            {activeMenu === "printers" && <PrinterList />}
            {activeMenu === "history" && <HistoryView />}
            {/* History와 Settings 뷰는 아직 정의되지 않았으므로 렌더링되지 않습니다. */}
          </main>
        </>
      )}

      {/* ... (로그인 오버레이 코드 유지) ... */}
      {showLogin && (
        <div className="login-overlay">
          {/* ... 로그인 내용 ... */}
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

// ... (Gauge 컴포넌트 유지) ...
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
