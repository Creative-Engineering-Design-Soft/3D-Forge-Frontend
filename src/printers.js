// === API 설정 ===
const API_BASE = "https://3d-forge-backend-production.up.railway.app"; // 실제 API 주소로 변경

async function fetchPrinters() {
    //const token = localStorage.getItem("token"); // JWT 토큰 가져오기
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJrb3JlYW4xNzkwQGdtYWlsLmNvbSIsIm5hbWUiOiJUZXJyeSIsImlhdCI6MTc2NDY0ODM0MiwiZXhwIjoxNzY0NjkxNTQyfQ.n19NGUYDWuhw1UrF1L8BtS7SkQLUKjsA8_IA2wuMNeI'; // JWT 토큰 가져오기

    if (!token) {
        console.error("토큰이 없습니다. 로그인 필요!");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/printers/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        const printers = data.result;

        if (!printers) return;

        updatePrinterTable(printers);

    } catch (err) {
        console.error("프린터 목록 가져오기 실패:", err);
    }
}

function updatePrinterTable(printers) {
    const tbody = document.querySelector(".printer-table tbody");
    let content = '';

    // 상태 뱃지
    for(const printer of printers) {
        const connectedBadge = printer.isConnected
            ? `<span class="status-badge connected">연결됨</span>`
            : `<span class="status-badge disconnected">연결 끊김</span>`;

        const printBadge =
            printer.isConnected === false
                ? `<span class="status-badge disconnected">오프라인</span>`
                : printer.isPrinting
                    ? `<span class="status-badge printing">출력중</span>`
                    : `<span class="status-badge waiting">대기중</span>`;
        // TODO: 잘 해놓기!
        const printStatusBadge = `<span class="status-badge waiting">대기중</span>`
        content += `
            <tr>
                <td>${printer.name}</td>
                <td>${printer.address}</td>
                <td>${printer.hardwareId}</td>
                <td>${connectedBadge}</td>
                <td>${printBadge}</td>
                <td>${printStatusBadge}</td>
            </tr>
        `;
    }
    tbody.innerHTML = content;
}

// === 2초마다 실시간 갱신 ===
//setInterval(fetchPrinters, 2000);
fetchPrinters();
