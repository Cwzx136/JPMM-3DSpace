export interface Example {
  id: string;
  name: string;
  description: string;
  category: 'threejs' | 'thurston';
  code: string;
}

export const examples: Example[] = [
  {
    id: 'rotating-cube',
    name: 'Rotating Cube',
    description: 'Three.js basics — a lit rotating cube',
    category: 'threejs',
    code: `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Create cube
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x10b981,
  metalness: 0.3,
  roughness: 0.4,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Wireframe overlay
const wireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(geometry),
  new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 })
);
cube.add(wireframe);

// Ground grid
const gridHelper = new THREE.GridHelper(10, 10, 0x444466, 0x333355);
scene.add(gridHelper);

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x10b981, 100, 50);
pointLight.position.set(3, 4, 3);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0x8b5cf6, 80, 50);
pointLight2.position.set(-3, 2, -3);
scene.add(pointLight2);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.008;
  cube.rotation.y += 0.012;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
  },
  {
    id: 'particle-galaxy',
    name: 'Particle Galaxy',
    description: 'Three.js particle system — spiral galaxy',
    category: 'threejs',
    code: `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// Create particle galaxy
const particleCount = 20000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

const colorInside = new THREE.Color(0xff6030);
const colorOutside = new THREE.Color(0x1b3984);

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  const radius = Math.random() * 8;
  const spinAngle = radius * 2.5;
  const branchAngle = ((i % 3) / 3) * Math.PI * 2;

  const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5;
  const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.0;
  const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5;

  positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
  positions[i3 + 1] = randomY;
  positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

  const mixedColor = colorInside.clone();
  mixedColor.lerp(colorOutside, radius / 8);
  colors[i3] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;

  sizes[i] = Math.random() * 2 + 0.5;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const material = new THREE.PointsMaterial({
  size: 0.03,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  sizeAttenuation: true,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Central glow
const centerGeo = new THREE.SphereGeometry(0.3, 32, 32);
const centerMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
const centerSphere = new THREE.Mesh(centerGeo, centerMat);
scene.add(centerSphere);

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
  },
  {
    id: 'geometry-showcase',
    name: 'Geometry Showcase',
    description: 'Multiple geometries with dynamic materials',
    category: 'threejs',
    code: `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f1a);
scene.fog = new THREE.FogExp2(0x0f0f1a, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0x222244, 3);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0x10b981, 200);
spotLight.position.set(5, 10, 5);
spotLight.castShadow = true;
scene.add(spotLight);

const spotLight2 = new THREE.SpotLight(0x8b5cf6, 150);
spotLight2.position.set(-5, 8, -5);
scene.add(spotLight2);

const pointLight = new THREE.PointLight(0xf59e0b, 50, 20);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// Ground
const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMat = new THREE.MeshStandardMaterial({
  color: 0x111122,
  metalness: 0.8,
  roughness: 0.3,
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Geometry array
const geometries = [
  new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16),
  new THREE.IcosahedronGeometry(0.7, 0),
  new THREE.OctahedronGeometry(0.7, 0),
  new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  new THREE.DodecahedronGeometry(0.6, 0),
  new THREE.ConeGeometry(0.5, 1, 32),
  new THREE.TetrahedronGeometry(0.7, 0),
  new THREE.SphereGeometry(0.5, 32, 32),
];

const hueColors = [
  0x10b981, 0x8b5cf6, 0xf59e0b, 0xef4444,
  0x06b6d4, 0xec4899, 0x84cc16, 0x6366f1,
];

const meshes = [];

geometries.forEach((geo, i) => {
  const mat = new THREE.MeshStandardMaterial({
    color: hueColors[i],
    metalness: 0.4,
    roughness: 0.3,
    emissive: hueColors[i],
    emissiveIntensity: 0.1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const angle = (i / geometries.length) * Math.PI * 2;
  mesh.position.set(Math.cos(angle) * 4, 1, Math.sin(angle) * 4);
  mesh.castShadow = true;
  scene.add(mesh);
  meshes.push(mesh);
});

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;
  meshes.forEach((mesh, i) => {
    mesh.rotation.x = t * 0.5 + i;
    mesh.rotation.y = t * 0.3 + i * 0.5;
    mesh.position.y = 1 + Math.sin(t + i * 0.8) * 0.3;
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
  },
  {
    id: 'thurston-torus',
    name: 'Thurston Torus',
    description: '3-dimensional.space — checkerboard lattice in E³',
    category: 'thurston',
    code: `// import the required tools from our library and Three.js
import {
    freeAbelianSet as torus,
    Point,
    PointLight,
    CheckerboardMaterial,
    phongWrap,
    LocalBallShape,
    complement,
    Solid
} from "3ds";
import {ThurstonLite} from "thurstonLite";
import {Color, Vector2} from "three";

// set up the renderer
const thurston = new ThurstonLite(torus, {keyboard: 'us'});

// lights
const light0 = new PointLight(
    new Point(1, 0, 0),
    new Color(1, 1, 1),
);
const light1 = new PointLight(
    new Point(0, 0, -1),
    new Color(1, 1, 1)
);
const light2 = new PointLight(
    new Point(0, 0, 1),
    new Color(1, 1, 1)
);

// checkerboard material
const checkerboardBase = new CheckerboardMaterial(
    new Vector2(Math.PI, 0),
    new Vector2(0, Math.PI),
    new Color(0.9, 0.9, 1),
    new Color(0, 0, 0.1)
)
const checkerboardPhong = phongWrap(checkerboardBase);

// complement of a local ball
const centerBall = new LocalBallShape(
    new Point(0, 0, 0),
    1.3,
);
const latticeShape = complement(centerBall);
const lattice = new Solid(latticeShape, checkerboardPhong);

// add lights and objects in the scene
thurston.add(lattice, light0, light1, light2);
// run the renderer
thurston.run();`,
  },
  {
    id: 'wave-surface',
    name: 'Wave Surface',
    description: 'Dynamic wave surface with vertex coloring',
    category: 'threejs',
    code: `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080818);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4, 5, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Wave mesh
const segW = 120, segH = 120;
const geo = new THREE.PlaneGeometry(12, 12, segW, segH);
geo.rotateX(-Math.PI / 2);

const posAttr = geo.attributes.position;
const colors = new Float32Array(posAttr.count * 3);

const material = new THREE.MeshPhongMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
  shininess: 80,
  specular: 0x444444,
  flatShading: false,
});

const mesh = new THREE.Mesh(geo, material);
scene.add(mesh);

// Wireframe overlay
const wireMat = new THREE.MeshBasicMaterial({
  color: 0x10b981,
  wireframe: true,
  transparent: true,
  opacity: 0.08,
});
const wireMesh = new THREE.Mesh(geo, wireMat);
scene.add(wireMesh);

// Lights
const ambientLight = new THREE.AmbientLight(0x334455, 3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0x10b981, 30, 20);
pointLight1.position.set(-3, 3, -3);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x8b5cf6, 30, 20);
pointLight2.position.set(3, 3, 3);
scene.add(pointLight2);

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const y = Math.sin(x * 0.8 + t) * Math.cos(z * 0.6 + t * 0.7) * 0.8
            + Math.sin(x * 1.5 - t * 0.5) * 0.3
            + Math.cos(z * 1.2 + t * 0.3) * 0.3;
    posAttr.setY(i, y);

    // Height-based coloring
    const normalizedY = (y + 1.4) / 2.8;
    const c1 = new THREE.Color(0x10b981);
    const c2 = new THREE.Color(0x8b5cf6);
    const mixed = c1.clone().lerp(c2, normalizedY);
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }

  posAttr.needsUpdate = true;
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
  },
  {
    id: 'shader-sphere',
    name: 'Shader Sphere',
    description: 'Custom ShaderMaterial with noise displacement',
    category: 'threejs',
    code: `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Vertex shader
const vertexShader = \`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;

    float displacement = snoise(position * 1.5 + uTime * 0.3) * 0.3;
    displacement += snoise(position * 3.0 + uTime * 0.5) * 0.1;

    vec3 newPosition = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
\`;

// Fragment shader
const fragmentShader = \`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vec3 light = normalize(vec3(1.0, 1.0, 1.0));
    float diffuse = max(dot(vNormal, light), 0.0);

    vec3 color1 = vec3(0.063, 0.725, 0.506);
    vec3 color2 = vec3(0.545, 0.361, 0.965);
    vec3 color3 = vec3(0.961, 0.620, 0.043);

    float t = sin(uTime * 0.5) * 0.5 + 0.5;
    vec3 baseColor = mix(color1, color2, vUv.y + t * 0.3);
    baseColor = mix(baseColor, color3, diffuse * 0.3);

    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    baseColor += fresnel * color2 * 0.5;

    vec3 finalColor = baseColor * (0.3 + diffuse * 0.7);
    gl_FragColor = vec4(finalColor, 1.0);
  }
\`;

const geometry = new THREE.SphereGeometry(1.5, 128, 128);
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
  },
});

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Orbiting particles
const particleCount = 1000;
const pGeo = new THREE.BufferGeometry();
const pPositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;
  const r = 2.5 + Math.random() * 2;
  pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  pPositions[i * 3 + 2] = r * Math.cos(phi);
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
const pMat = new THREE.PointsMaterial({
  color: 0x10b981,
  size: 0.02,
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.6,
});
scene.add(new THREE.Points(pGeo, pMat));

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value = performance.now() * 0.001;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
  },
  {
    id: 'empty-threejs',
    name: 'Blank Template',
    description: 'Three.js starter template',
    category: 'threejs',
    code: `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add your objects here...

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Point light
const pointLight = new THREE.PointLight(0x10b981, 50, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});`,
  },
];

export const defaultExample = examples[0];
