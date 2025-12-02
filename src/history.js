const API_URL = "https://3d-forge-backend-production.up.railway.app";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const loginBtn = document.querySelector(".login-btn");

    if (!token) {
        loginBtn.textContent = "Log In";
        loginBtn.onclick = () => (window.location.href = "login.html");
        return;
    }

    // ===== 로그 목록 불러오기 =====
    try {
        const logsRes = await fetch(`${API_URL}/logs/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (logsRes.status !== 200) {
            console.error("로그 조회 실패");
            return;
        }

        const logsData = await logsRes.json();
        const logs = logsData || [];
        console.log(logs)

        const tbody = document.querySelector(".printer-table tbody");
        tbody.innerHTML = ""; // 기존 더미 제거

        logs.forEach((log) => {
            const tr = document.createElement("tr");

            const badge = convertEventToBadge(log.event);

            tr.innerHTML = `
                <td>${log.printerName}</td>
                <td>${formatDate(log.createdAt)}</td>
                <td>${badge}</td>
                <td>${log.address}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("logs/me 에러:", err);
    }
});

/* ===============================
    이벤트 타입 → 뱃지 변환 함수
================================ */
function convertEventToBadge(event) {
    switch (event) {
        case "connect":
            return `<span class="status-badge connected">연결됨</span>`;
        case "disconnect":
            return `<span class="status-badge disconnected">연결 해제</span>`;
        case "operate":
            return `<span class="status-badge operating">작동</span>`;
        case "upload":
            return `<span class="status-badge upload">업로드됨</span>`;
        default:
            return `<span class="status-badge unknown">알 수 없음</span>`;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}