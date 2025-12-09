import * as THREE from "/js/three.module.js";
import { OrbitControls } from "/js/OrbitControls.js";
import { STLLoader } from "/js/STLLoader.js";

const container = document.getElementById("model-viewer");
let scene, camera, renderer, object;
let clippingPlane; // 클리핑 평면 변수 추가

// 모델의 최소/최대 Z 값 (높이)을 저장할 변수
let minZ = 0;
let maxZ = 0;
let heightRange = 0;

function setProgress(percentage) {
  if (!object) return;

  const completedMesh = object.children[0];
  const remainingMesh = object.children[1];

  const progressZ = minZ + heightRange * (percentage / 100);

  // 파란색: progressZ 아래만 보이기
  completedMesh.material.clippingPlanes[0].constant = progressZ;

  // 주황색: progressZ 위만 보이기
  remainingMesh.material.clippingPlanes[0].constant = -progressZ;

  completedMesh.material.opacity = percentage === 0 ? 0 : 0.8;
}


function animate() {
  // 다음 프레임에 animate 함수를 다시 호출
  requestAnimationFrame(animate);

  // OrbitControls 업데이트 ( damping이 활성화된 경우 필수)
  if (object) {
    // object가 로드된 후에만 컨트롤 업데이트
  }

  // 씬과 카메라로 화면을 그림
  renderer.render(scene, camera);
}

// 잊지 말고 꼭 호출해야 해!
init();
// ... (이전 코드 생략)

function init() {
  // 씬 설정
  scene = new THREE.Scene();
  // 배경색을 회색으로 설정 (검은색 화면 방지)
  scene.background = new THREE.Color(0xeeeeee);

  // 🌟 1. 카메라 설정 (원근 투영 카메라)
  camera = new THREE.PerspectiveCamera(
    60, // 시야각 (FOV)
    container.clientWidth / container.clientHeight, // 화면 비율
    0.1, // Near
    1000 // Far
  );
  // 카메라 위치 설정 (모델을 위에서 내려다보는 느낌으로)
  camera.position.set(200, 200, 200);

  // 🌟 2. 렌더러 설정 및 HTML에 추가
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  renderer.localClippingEnabled = true;

  // 🌟 3. 조명(Light) 추가 (MeshPhongMaterial을 쓰려면 필수!)
  // AmbientLight: 전체적으로 은은하게 빛을 줌
  const ambientLight = new THREE.AmbientLight(0x404040, 3); // (색상, 강도)
  scene.add(ambientLight);

  // DirectionalLight: 태양처럼 방향성 있는 빛을 줌 (입체감을 살려줘)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.set(100, 150, 50);
  scene.add(directionalLight);

  // 🌟 4. OrbitControls 추가 (마우스로 모델 회전 가능!)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  // controls의 목표 지점을 씬의 중심(0,0,0)으로 설정
  controls.target.set(0, 0, 0);

  // ... (clippingPlane 설정 생략)

  // 모델 로드 함수 호출
  loadModel();

  // 🌟 5. 애니메이션 루프 실행
  animate();
}

// ... (loadModel 함수와 setProgress 함수 생략)

function loadModel() {
  const loader = new STLLoader();
  loader.load("/public/xyzCalibration_cube.stl", function (geometry) {
    // 1. 모델의 높이(Z축) 범위 계산
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    minZ = box.min.z;
    maxZ = box.max.z;
    heightRange = maxZ - minZ;

    // 2. 완성된 부분(불투명) 재질
    const completedMaterial = new THREE.MeshPhongMaterial({
      color: 0x0077ff, // 파란색
      specular: 0x111111,
      shininess: 30,
      transparent: true, // 반투명
      opacity: 0.8, // 투명도 조절
      // 🌟 클리핑 설정: Z축 위쪽(남은 부분)을 자름
      clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)],
      clipShadows: true,
    });

    // 3. 남은 부분(반투명) 재질
    const remainingMaterial = new THREE.MeshPhongMaterial({
      color: 0xff7700, // 주황색
      specular: 0x111111,
      shininess: 30,
      transparent: true, // 반투명
      opacity: 0.6, // 투명도 조절
      // 🌟 클리핑 설정: Z축 아래쪽(완성된 부분)을 자름
      clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)],
      clipShadows: true,
    });

    // 4. 모델 생성 및 씬에 추가
    // 두 개의 Mesh를 만들어서 서로 다른 클리핑을 적용
    const completedMesh = new THREE.Mesh(geometry, completedMaterial);
    const remainingMesh = new THREE.Mesh(geometry, remainingMaterial);

    // object 변수에 두 Mesh를 포함하는 Group을 할당
    object = new THREE.Group();
    object.add(completedMesh);
    object.add(remainingMesh);

    // 5. 모델 크기 조정 (Scaling)
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const scaleFactor = 100 / maxDimension;
    object.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // 6. 스케일 적용
    object.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // 7. object 중심 이동
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center.multiplyScalar(scaleFactor));

    // 🚨🚨🚨 이동 + 스케일 적용된 실제 bounding box 다시 구하기 🚨🚨🚨
    const fullBox = new THREE.Box3().setFromObject(object);
    minZ = fullBox.min.z;
    maxZ = fullBox.max.z;
    heightRange = maxZ - minZ;

    scene.add(object); // 초기 진행률 설정 (0%로 가정)

    setProgress(0);
  });
}

let percent = 0;
let max_percent = 0;

async function fetchProgress() {
  try {
    const res = await fetch(`${API_BASE}/printers/${HARDWARE_ID}/status`);
    const data = await res.json();

    if (!data.result) {
      console.error(`Error[${data.statusCode}] >> ${data.message}`);
      return;
    }
    max_percent = data.result.percent;
    //max_percent = 70;
    if(percent < max_percent)
        percent += 5;
    else
        percent = max_percent;
    setProgress(percent);
  } catch {
    
  }
}


setInterval(fetchProgress, 50)