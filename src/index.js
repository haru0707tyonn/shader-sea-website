import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import skyImage from "./textures/sky.jpg"; 

const gui = new dat.GUI({ width: 300 });

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(skyImage); // 48
scene.background = skyTexture;

// Geometry
const geometry = new THREE.PlaneGeometry(8, 8, 512, 512); // セグメント数を上げることで細かく表現できる　2の累乗で上げることをおすすめ

// color 36
const colorObject = {};
colorObject.depthColor = "#2d81ae"; // 深みのある色
colorObject.surfaceColor = "#66c1f9"; // 表面（波の高い部分の色）


// Material
const material = new THREE.ShaderMaterial({ // 30
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: { // グローバル変数
    uWaveLength: { value: 0.38 },
    uFrequency: { value: new THREE.Vector2(5.0, 2.5) }, // 33 波の周波数に使う
    uTime: { value: 0 }, // 35 animate関数内で時間経過によって値を変更 
    uWaveSpeed: { value: 0.75 }, // 35 波の速さ
    uDepthColor: { value: new THREE.Color(colorObject.depthColor) }, // 36
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) }, // 36
    uColorOffset: { value: 0.03 }, // 38
    uColorMutiplier: { value: 9.0 }, // 38
    uSmallWaveElevation: { value: 0.15 }, // 42 振幅
    uSmallWaveFrequecy : { value: 3.0 }, // 42
    uSmallWaveSpeed : { value: 0.2 }, // 42
  },
});

// デバッグ
gui
  .add(material.uniforms.uWaveLength, "value") // 32
  .min(0)     // 最小値
  .max(1)     // 最大値
  .step(0.001)  // ステップ数
  .name("uWaveLength");  // GUI上に表示される名前
gui
  .add(material.uniforms.uFrequency.value, "x") // 34
  .min(0)     // 最小値
  .max(10)     // 最大値
  .step(0.001)  // ステップ数
  .name("uFrequencyX");  // GUI上に表示される名前
gui
  .add(material.uniforms.uFrequency.value, "y") // 34
  .min(0)     // 最小値
  .max(10)     // 最大値
  .step(0.001)  // ステップ数
  .name("uFrequencyY");  // GUI上に表示される名前
gui
  .add(material.uniforms.uWaveSpeed, "value") // 35
  .min(0)     // 最小値
  .max(4)     // 最大値
  .step(0.001)  // ステップ数
  .name("uWaveSpeed");  // GUI上に表示される名前
gui
  .add(material.uniforms.uColorOffset, "value") // 38
  .min(0)     // 最小値
  .max(1)     // 最大値
  .step(0.001)  // ステップ数
  .name("uColorOffset");  // GUI上に表示される名前
gui
  .add(material.uniforms.uColorMutiplier, "value") // 38
  .min(0)     // 最小値
  .max(10)     // 最大値
  .step(0.001)  // ステップ数
  .name("uColorMutiplier");  // GUI上に表示される名前
gui
  .add(material.uniforms.uSmallWaveElevation, "value") // 42
  .min(0)     // 最小値
  .max(1)     // 最大値
  .step(0.001)  // ステップ数
  .name("uSmallWaveElevation");  // GUI上に表示される名前
gui
  .add(material.uniforms.uSmallWaveFrequecy, "value") // 42
  .min(0)     // 最小値
  .max(30)     // 最大値
  .step(0.001)  // ステップ数
  .name("uSmallWaveFrequecy");  // GUI上に表示される名前
gui
  .add(material.uniforms.uSmallWaveSpeed, "value") // 42
  .min(0)     // 最小値
  .max(30)     // 最大値
  .step(0.001)  // ステップ数
  .name("uSmallWaveSpeed");  // GUI上に表示される名前

// 色を変えるGUI 36
gui.addColor(colorObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});
// 色を変えるGUI 36
gui.addColor(colorObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
});

// gui.show(false); // UIデバッグを非表示にする

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2; // x軸に対して90度回転
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0.23, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  // カメラを円周上に周回させる 46
  camera.position.x = Math.sin(elapsedTime * 0.17) * 3.0; // 3.0が半径
  camera.position.z = Math.cos(elapsedTime * 0.17) * 3.0;

  // camera.lookAt(0, 0, 0); // カメラを固定する場合
  camera.lookAt(Math.cos(elapsedTime), Math.sin(elapsedTime) * 0.5, Math.sin(elapsedTime) * 0.4); // 47


  // controls.update(); // ドラッグするとカメラの位置が変えられるのを今回は使わない 47 152行目もコメントアウト

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
