const API_URL = "https://3d-forge-backend-production.up.railway.app";


async function loadUserInfo() {
    const token = localStorage.getItem("token");
    const loginBtn = document.querySelector(".login-btn");

    if (!loginBtn) return; // 버튼 없으면 무시

    if (!token) {
        loginBtn.textContent = "Login";
        loginBtn.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.status === 200) {
            // 사용자 이름 표시
            loginBtn.textContent = `${data.name}`;
            loginBtn.href = ""; // 클릭 시 계정 설정페이지로 가게 하기
        } else {
            // 토큰이 잘못됨 → 로그인 버튼으로 원복
            loginBtn.textContent = "Login";
            loginBtn.href = "login.html";
        }

    } catch (err) {
        loginBtn.textContent = "Login";
        loginBtn.href = "login.html";
    }
}

loadUserInfo();