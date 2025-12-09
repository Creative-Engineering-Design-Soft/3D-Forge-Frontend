//const API_BASE = "https://3d-forge-backend-production.up.railway.app";
const API_BASE = "https://3d-forge-backend-production.up.railway.app";
const token = localStorage.getItem("token");
const HARDWARE_ID = "pi-lab-101";

if (!token) {
  alert("로그인이 필요합니다.");
  window.location.href = "/login.html";
}

// 날짜 포맷 함수
function formatDate(dateString) {
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

// 모델 목록 불러오기
async function fetchModels() {
  try {
    const res = await fetch(`${API_BASE}/models/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("모델 목록을 불러오지 못했습니다.");

    const data = await res.json();
    const list = data.result;

    const tbody = document.querySelector(".model-table tbody");
    tbody.innerHTML = ""; // 기존 샘플 제거

    list.forEach((model) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                    <td>${model.id}</td>
                    <td><strong>${model.name}</strong></td>
                    <td>${formatDate(model.createdAt)}</td>
                    <td>
                        <button class="action-btn btn-print" onclick="printModel(${
                          model.id
                        })">🖨️ 출력하기</button>
                        <button class="action-btn btn-delete" onclick="deleteModel(${
                          model.id
                        })">🗑️ 삭제</button>
                    </td>
                `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    alert("모델 데이터를 불러오는 중 오류 발생");
  }
}

// 출력하기 버튼 행동
async function printModel(modelId) {
  const res = await fetch(`${API_BASE}/printers/${HARDWARE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      modelId,
    }),
  });
  const data = await res.json();
  if(data.status!=200) {
    console.error(data);
    return;
  }
  alert(data.message);
}

// 삭제 API
async function deleteModel(id) {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  try {
    const res = await fetch(`${API_BASE}/models/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("삭제 실패");

    alert("삭제되었습니다.");
    fetchModels(); // 목록 새로 불러오기
  } catch (err) {
    alert("삭제 중 오류 발생");
  }
}

// 페이지 로드 시 실행
fetchModels();
