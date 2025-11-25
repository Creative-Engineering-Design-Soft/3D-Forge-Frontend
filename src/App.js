import { useState } from "react";
import "./style.css";

// 3. 프린터 목록 컴포넌트 정의
function PrinterList() {
  // 실제 데이터는 API 호출 등으로 가져와야 하지만, 여기서는 예시 데이터를 사용합니다.
  const printers = [
    { name: "Ender 3 Pro", ip: "192.168.1.101", hwId: "XYZ-123456", connected: true, status: "Printing" },
    { name: "CR-10 Max", ip: "192.168.1.102", hwId: "ABC-789012", connected: false, status: "Waiting" },
    { name: "Prusa i3 MK3S+", ip: "192.168.1.103", hwId: "DEF-345678", connected: true, status: "Waiting" },
  ];

  const getStatusBadge = (status, type) => {
    const statusMap = {
      connected: "연결됨", disconnected: "연결 끊김",
      Printing: "출력중", Waiting: "대기중",
    };
    const className = type === 'connection' 
      ? (status ? "connected" : "disconnected") 
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
              <td data-label="연결 상태">{getStatusBadge(p.connected, 'connection')}</td>
              <td data-label="프린트 상태">{getStatusBadge(p.status, 'print')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 기존 대시보드 내용을 별도의 컴포넌트로 분리 (선택 사항이지만 관리 용이)
function DashboardView({ Gauge }) {
  return (
    <>
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
    </>
  );
}

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  // 1. 새로운 state 정의: 'dashboard' 또는 'printers'
  const [activeMenu, setActiveMenu] = useState('dashboard'); 

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
            <img
              src="logo.png"
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
                {/* 2. Dashboard 메뉴에 onClick 추가 */}
                <li 
                  className={activeMenu === 'dashboard' ? 'active' : ''}
                  onClick={() => setActiveMenu('dashboard')}
                >
                  <span className="icon">🟧</span> Dashboard
                </li>
                
                {/* 2. Printers 메뉴에 onClick 추가 */}
                <li
                  className={activeMenu === 'printers' ? 'active' : ''}
                  onClick={() => setActiveMenu('printers')}
                >
                  <span className="icon">🖨️</span> Printers
                </li>
                
                <li className={activeMenu === 'history' ? 'active' : ''} onClick={() => setActiveMenu('history')}>
                  <span className="icon">📜</span> History
                </li>
                <li className={activeMenu === 'settings' ? 'active' : ''} onClick={() => setActiveMenu('settings')}>
                  <span className="icon">⚙️</span> Settings
                </li>
              </ul>
            </nav>
          </aside>

          <main className="main-content">
            {/* 4. main 영역 조건부 렌더링 */}
            {activeMenu === 'dashboard' && <DashboardView Gauge={Gauge} />}
            {activeMenu === 'printers' && <PrinterList />}
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