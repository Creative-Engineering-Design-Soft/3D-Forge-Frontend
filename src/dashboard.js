// === 설정 ===
const HARDWARE_ID = "pi-lab-101"; // 실제 hardwareId로 변경해줘
const API_BASE = "https://3d-forge-backend-production.up.railway.app"; // 실제 API 주소로 변경

// === DOM 요소 가져오기 ===
const nozzleLabel = document.querySelector(".gauge-label:nth-child(2)");
const bedLabel = document.querySelector(".gauge-wrapper:nth-child(2) .gauge-label");

const nozzleFill = document.querySelector(".gauge-wrapper:nth-child(1) .gauge-fill");
const nozzlePointer = document.querySelector(".gauge-wrapper:nth-child(1) .gauge-pointer");

const bedFill = document.querySelector(".gauge-wrapper:nth-child(2) .gauge-fill");
const bedPointer = document.querySelector(".gauge-wrapper:nth-child(2) .gauge-pointer");

const statusText = document.querySelector(".status-info span");
const timeText = document.querySelector(".status-info p:nth-child(3)");
const fileNameText = document.querySelector(".status-info p:nth-child(1)");

const percentageText = document.getElementsByClassName("percentage-text")[0];
const percentageFill = document.getElementsByClassName("progress-fill")[0];

// === 온도를 게이지 각도로 변환하는 함수 ===
// 게이지 범위: 약 -90deg ~ +90deg
function tempToDeg(temp, min = -10, max = 250) {
    const clamped = Math.max(min, Math.min(temp, max)); // 범위 제한
    const percent = (clamped - min) / (max - min);      // 0~1 비율 변환
    return 0 + percent * 180;                         // -90deg ~ +90deg
}

async function fetchStatus() {
    try {
        const res = await fetch(`${API_BASE}/printers/${HARDWARE_ID}/status`);
        const data = await res.json();

        if(!data.result){
            console.error(`Error[${data.statusCode}] >> ${data.message}`);
            return;
        }

        const {
            bedTemp,
            nozzleTemp,
            isPrinting,
            isConnected,
            x, y, z,
            percent,
            state
        } = data.result;

        // ===== 게이지 텍스트 업데이트 =====
        nozzleLabel.innerHTML = `Nozzle: ${nozzleTemp}°C`;
        bedLabel.innerHTML = `Bed: ${bedTemp}°C`;

        // ===== 게이지 시각화 반영 =====
        const nozzleDeg = tempToDeg(nozzleTemp, -10, 250);
        nozzleFill.style.transform = `rotate(${nozzleDeg}deg)`;
        nozzlePointer.style.transform = `translateX(-50%) rotate(${nozzleDeg - 90}deg)`;

        const bedDeg = tempToDeg(bedTemp, -10, 70);
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

        percentageText.innerHTML = `${percent}%`
        percentageFill.style.width = `${percent}%`

    } catch (e) {
        console.error("Failed to fetch printer status:", e);
    }
}

// === 2초마다 업데이트 ===
setInterval(fetchStatus, 2000);
fetchStatus();
