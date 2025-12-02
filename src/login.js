const API_URL = "https://3d-forge-backend-production.up.railway.app";

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 제출 막기

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const token = data?.result?.accessToken;

        if (token) {
          localStorage.setItem("token", token); // 토큰 저장
          alert("로그인 성공!");
          window.location.href = "dashboard.html"; // 이동
        } else {
          alert("로그인 성공했지만 토큰을 찾을 수 없습니다.");
        }
      } else {
        alert("로그인 실패: " + (data.message || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("로그인 요청 중 오류:", error);
      alert("서버와의 연결에 실패했습니다.");
    }
  });
