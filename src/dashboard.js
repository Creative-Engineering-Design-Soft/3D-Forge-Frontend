// === 설정 ===
const HARDWARE_ID = "pi-lab-101"; // 실제 hardwareId로 변경해줘
const API_BASE = "https://3d-forge-backend-production.up.railway.app"; // 실제 API 주소로 변경

// === DOM 요소 가져오기 ===
const nozzleLabel = document.querySelector(".gauge-label:nth-child(2)");
const bedLabel = document.querySelector(
  ".gauge-wrapper:nth-child(2) .gauge-label"
);

const nozzleFill = document.querySelector(
  ".gauge-wrapper:nth-child(1) .gauge-fill"
);
const nozzlePointer = document.querySelector(
  ".gauge-wrapper:nth-child(1) .gauge-pointer"
);

const bedFill = document.querySelector(
  ".gauge-wrapper:nth-child(2) .gauge-fill"
);
const bedPointer = document.querySelector(
  ".gauge-wrapper:nth-child(2) .gauge-pointer"
);

const statusText = document.querySelector(".status-info span");
const timeText = document.querySelector(".status-info p:nth-child(3)");
const fileNameText = document.querySelector(".status-info p:nth-child(1)");

const percentageText = document.getElementsByClassName("percentage-text")[0];
const percentageFill = document.getElementsByClassName("progress-fill")[0];

// === 온도를 게이지 각도로 변환하는 함수 ===
// 게이지 범위: 약 -90deg ~ +90deg
function tempToDeg(temp, min = -10, max = 250) {
  const clamped = Math.max(min, Math.min(temp, max)); // 범위 제한
  const percent = (clamped - min) / (max - min); // 0~1 비율 변환
  return 0 + percent * 180; // -90deg ~ +90deg
}

async function fetchStatus() {
  try {
    const res = await fetch(`${API_BASE}/printers/${HARDWARE_ID}/status`);
    const data = await res.json();

    if (!data.result) {
      console.error(`Error[${data.statusCode}] >> ${data.message}`);
      return;
    }

    const {
      bedTemp,
      nozzleTemp,
      isPrinting,
      isConnected,
      x,
      y,
      z,
      percent,
      state,
    } = data.result;

    // ===== 게이지 텍스트 업데이트 =====
    nozzleLabel.innerHTML = `Nozzle: ${nozzleTemp}°C`;
    bedLabel.innerHTML = `Bed: ${bedTemp}°C`;

    // ===== 게이지 시각화 반영 =====
    const nozzleDeg = tempToDeg(nozzleTemp, 0, 250);
    nozzleFill.style.transform = `rotate(${nozzleDeg}deg)`;
    nozzlePointer.style.transform = `translateX(-50%) rotate(${
      nozzleDeg - 90
    }deg)`;

    const bedDeg = tempToDeg(bedTemp, 0, 70);
    bedFill.style.transform = `rotate(${bedDeg}deg)`;
    bedPointer.style.transform = `translateX(-50%) rotate(${bedDeg - 90}deg)`;

    // ===== 상태 텍스트 =====
    if (!isConnected) {
      statusText.innerHTML = `<span style="color: red; font-weight: bold;">Disconnected</span>`;
    } else if (isPrinting) {
      statusText.innerHTML = `<span style="color: #fd7e14; font-weight: bold;">Printing...</span>`;
    } else {
      statusText.innerHTML = `<span style="color: green; font-weight: bold;">Ready</span>`;
    }

    // ===== 예시: 파일명과 남은 시간(실제 API에 없으므로 임시 처리) =====
    fileNameText.innerHTML = `<strong>File:</strong> current_print.gcode`;

    // 좌표 정보 표시 (원하면 확장 가능)
    timeText.innerHTML = `<strong>Position:</strong> X:${x} Y:${y} Z:${z}`;

    percentageText.innerHTML = `${percent}%`;
    percentageFill.style.width = `${Math.floor(percent * 100) / 100}%`;
  } catch (e) {
    console.error("Failed to fetch printer status:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const pauseBtn = document.querySelector(".btn-action");
  const cancelBtn = document.querySelector(".btn-action.btn-cancel");

  let isPaused = false; // 기본 상태 = 실행중

  // ===== Pause / Start 토글 =====
  pauseBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다");

    // 전송할 명령
    const operator = "start";

    try {
      const res = await fetch(`${API_URL}/printers/${HARDWARE_ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operator }),
      });

      if (res.status !== 200) {
        console.error("명령 실패:", res.status);
        return;
      }

      // UI 토글
      isPaused = !isPaused;
      pauseBtn.textContent = "Start";
    } catch (err) {
      console.error("Pause/Start 에러:", err);
    }
  });

  // ===== Cancel → Finish 전송 =====
  cancelBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다");

    try {
      const res = await fetch(`${API_URL}/printers/${HARDWARE_ID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ operator: "finish" }),
      });

      if (res.status !== 200) {
        console.error("취소 실패:", res.status);
        return;
      }

      // UI 변화 (완료 상태로 변경)
      alert("정지 명령 전달");
      cancelBtn.textContent = "Stop";
      cancelBtn.disabled = true;
      pauseBtn.disabled = true;
    } catch (err) {
      console.error("Finish 에러:", err);
    }
  });
});

const liveImage = document.getElementById("live-image")
async function fetchImage() {
  const res = await fetch(`${API_URL}/printers/image`);
  const data = await res.json();

  // 만약 data.image가 Base64라면
  const base64 = data.image;

  // 이미지 렌더링
  liveImage.src = "data:image/png;base64," + base64; // jpeg이면 image/jpeg
}

// === 2초마다 업데이트 ===
setInterval(fetchStatus, 500);
setInterval(fetchImage, 100);
fetchStatus();
