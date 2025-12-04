// =====================
// 3D Progress Visualization
// =====================
import * as THREE from "/js/three.module.js";
import { OrbitControls } from "/js/OrbitControls.js";
import { STLLoader } from "/js/STLLoader.js";

const HARDWARE_ID = "pi-lab-101"; // 실제 hardwareId로 변경해줘
const API_BASE = "http://localhost:3000"; 
//const API_BASE = "https://3d-forge-backend-production.up.railway.app"; 

let scene, camera, renderer, controls;
let stlMesh = null;
let maxZ = 20;

// HTML div
const container = document.getElementById("model-viewer");

// Renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.localClippingEnabled = true;
container.appendChild(renderer.domElement);

// Scene & Camera
scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

camera = new THREE.PerspectiveCamera(
  50,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(80, 80, 80);

controls = new OrbitControls(camera, renderer.domElement);

// Lights
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const d = new THREE.DirectionalLight(0xffffff, 0.8);
d.position.set(100, 100, 50);
scene.add(d);

// Grid
scene.add(new THREE.GridHelper(200, 40));

// Load STL

const loader = new STLLoader();
loader.load(`${API_BASE}/public/upload/model/Tux-print-10cm-ht.stl`, (geometry) => {
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();

  maxZ = geometry.boundingBox.max.z;

  const material = new THREE.MeshStandardMaterial({
    color: 0x66aaff,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.9,
    clippingPlanes: [],
  });

  stlMesh = new THREE.Mesh(geometry, material);
  stlMesh.rotation.x = -Math.PI / 2;  // -90도 세우기
  scene.add(stlMesh);
});

// Update clipping
function setProgress(percent) {
  if (!stlMesh) return;

  const targetZ = (percent / 100) * maxZ;

  stlMesh.material.clippingPlanes = [
    new THREE.Plane(new THREE.Vector3(0, 0, -1), targetZ),
  ];
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// =====================
// 서버에서 진행률 받아오기
// =====================

async function fetchProgress() {
  try {
    const res = await fetch(`${API_BASE}/printers/${HARDWARE_ID}/status`);
    const data = await res.json();

    // data.percent 예: 0~100
    setProgress(data.result.percent);
  } catch (e) {
    console.log("progress fetch error", e);
  }
}

// 1초마다 진행률 갱신
setInterval(fetchProgress, 1000);