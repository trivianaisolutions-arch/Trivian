/**
 * The system stack: six engineered layers (data → search) with data packets
 * travelling through them. One fixed canvas sits behind the page; sections
 * marked `data-scene="hero|services|layers|cta"` are transparent windows onto
 * it, and the scene re-forms for whichever window is on screen.
 *   services also reads `data-focus`: a layer index, "twist" or "all".
 */
import {
  ACESFilmicToneMapping,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Raycaster,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  type Material,
  type Object3D,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { sectionProgress } from "@/lib/use-section-progress";

const INK = 0x0d0e10;
const BONE = new Color(0xe9e5dc);
const SIGNAL = new Color(0xff5a1f);
const SIZE = 3.4;
const THICK = 0.08;
const TOP = THICK / 2;
const LAYERS = 6; // 0 data · 1 ai · 2 automation · 3 ui · 4 content · 5 search
const COLUMNS: [number, number][] = [
  [-1.45, -1.45],
  [1.45, -1.45],
  [-1.45, 1.45],
  [1.45, 1.45],
  [0, 0],
];

type Mode = "hero" | "services" | "layers" | "cta";
type Target = {
  gap: number;
  r: number;
  az: number;
  el: number;
  look: number;
  ox: number;
  oy: number;
  spin: number;
  twist: number;
  focus: number;
  all: number;
  speed: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function targetFor(mode: Mode, p: number, focus: string | undefined, mobile: boolean, still: boolean): Target {
  switch (mode) {
    case "hero": {
      // Scrolling out of the hero = flying into the stack while it opens.
      const e = still ? 0 : easeInOut(p);
      return {
        gap: lerp(0.3, 1.05, e),
        r: lerp(13, 6.4, e),
        az: lerp(0.78, 0.32, e),
        el: lerp(0.46, 0.2, e),
        look: lerp(0, 0.5, e),
        ox: mobile ? 0 : lerp(0.2, 0, e),
        oy: mobile ? -0.2 : 0,
        spin: 0.05,
        twist: 0,
        focus: -1,
        all: 0,
        speed: 1,
      };
    }
    case "services": {
      const f = focus ?? "";
      return {
        gap: f === "twist" ? 1 : 0.8,
        r: 10.5,
        az: 0.62,
        el: 0.38,
        look: 0.2,
        ox: mobile ? 0 : 0.2,
        oy: mobile ? -0.24 : -0.04,
        spin: 0.03,
        twist: f === "twist" ? 0.32 : 0,
        focus: /^\d$/.test(f) ? Number(f) : -1,
        all: f === "all" ? 0.65 : 0,
        speed: f === "all" ? 2.4 : 1.2,
      };
    }
    case "layers": {
      // Open → hold → recombine, orbiting while the DOM list walks the layers.
      const b = still ? 1 : smooth(0, 0.3, p) * (1 - smooth(0.72, 1, p));
      return {
        gap: 0.3 + 1.3 * b,
        r: 11.5 - 1.5 * b,
        az: 0.9 + (still ? 0.6 : p * 2.4),
        el: 0.5 - 0.18 * b,
        look: 0,
        ox: mobile ? 0 : 0.18,
        oy: mobile ? -0.2 : 0,
        spin: 0,
        twist: 0.18 * b,
        focus: 5 - Math.min(5, Math.floor(p * 6)),
        all: 0,
        speed: 1.4,
      };
    }
    case "cta":
      // Recombined into one solid, fully lit form.
      return {
        gap: 0.04,
        r: 12,
        az: 0.55,
        el: 0.34,
        look: -0.1,
        ox: 0,
        oy: mobile ? 0.12 : 0.1,
        spin: 0.12,
        twist: 0,
        focus: -1,
        all: 1,
        speed: 2,
      };
  }
}

function createRenderer(canvas: HTMLCanvasElement, coarse: boolean) {
  try {
    const renderer = new WebGLRenderer({
      canvas,
      antialias: !coarse,
      alpha: false,
      powerPreference: "high-performance",
    });
    return renderer;
  } catch {
    return null;
  }
}

export function startScene(canvas: HTMLCanvasElement): () => void {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const renderer = createRenderer(canvas, coarse);
  if (!renderer) {
    document.documentElement.classList.add("no-webgl");
    return () => {};
  }

  const maxDpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
  let dpr = maxDpr;
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(INK, 1);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  scene.fog = new Fog(INK, 12, 30);
  // Phones skip the reflection environment (the costliest part of start-up) and use plain lights.
  const lite = coarse;
  let pmrem: PMREMGenerator | null = null;
  let env: ReturnType<PMREMGenerator["fromScene"]>["texture"] | null = null;
  if (lite) {
    scene.add(new HemisphereLight(0xfff4e8, 0x1a1b1f, 1.6));
  } else {
    pmrem = new PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    env = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    scene.environment = env;
  }

  const key = new DirectionalLight(0xfff4e8, 1.4);
  key.position.set(4, 8, 5);
  scene.add(key);

  const camera = new PerspectiveCamera(32, 1, 0.1, 80);

  // ── Geometry (shared) ──────────────────────────────────────────────
  const gPlate = new RoundedBoxGeometry(SIZE, THICK, SIZE, 2, 0.035);
  const gEdges = new EdgesGeometry(new BoxGeometry(SIZE, THICK, SIZE));
  const gCube = new BoxGeometry(1, 1, 1);
  const gCyl = new CylinderGeometry(0.2, 0.2, 0.26, lite ? 14 : 28);
  const gRing = new TorusGeometry(1, 0.012, 6, lite ? 48 : 96);
  const gGrid = new BufferGeometry();
  {
    const v: number[] = [];
    const h = SIZE / 2;
    for (let k = 1; k < 6; k++) {
      const c = -h + (k * SIZE) / 6;
      v.push(c, TOP + 0.002, -h, c, TOP + 0.002, h, -h, TOP + 0.002, c, h, TOP + 0.002, c);
    }
    gGrid.setAttribute("position", new BufferAttribute(new Float32Array(v), 3));
  }
  const mPlate = new MeshStandardMaterial({ color: lite ? 0x2a2b30 : 0x1a1b1f, metalness: lite ? 0.35 : 0.88, roughness: lite ? 0.55 : 0.34 });
  const mGrid = new LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.06 });

  const root = new Group();
  scene.add(root);

  const layers: {
    group: Group;
    plate: Mesh;
    edge: LineBasicMaterial;
    parts: MeshStandardMaterial;
    h: number;
    hover: number;
  }[] = [];

  const box = (g: Group, m: Material, x: number, z: number, w: number, h: number, d: number) => {
    const mesh = new Mesh(gCube, m);
    mesh.scale.set(w, h, d);
    mesh.position.set(x, TOP + h / 2, z);
    g.add(mesh);
  };
  const lines = (g: Group, m: Material, pts: number[]) => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(new Float32Array(pts), 3));
    g.add(new LineSegments(geo, m));
  };

  for (let i = 0; i < LAYERS; i++) {
    const group = new Group();
    const plate = new Mesh(gPlate, mPlate);
    plate.userData.layer = i;
    group.add(plate);
    const edge = new LineBasicMaterial({ color: BONE.clone(), transparent: true, opacity: 0.22 });
    group.add(new LineSegments(gEdges, edge));
    group.add(new LineSegments(gGrid, mGrid));
    const parts = new MeshStandardMaterial({
      color: lite ? 0x3a3b41 : 0x2a2b30,
      metalness: lite ? 0.3 : 0.7,
      roughness: lite ? 0.5 : 0.42,
      emissive: SIGNAL,
      emissiveIntensity: 0,
    });
    const y = TOP + 0.03;

    // Each layer carries the components it stands for.
    if (i === 0) {
      // DATA — storage cells
      for (let a = -1; a <= 1; a++)
        for (let b = -1; b <= 1; b++) {
          const c = new Mesh(gCyl, parts);
          c.position.set(a * 0.95, TOP + 0.13, b * 0.95);
          group.add(c);
        }
    } else if (i === 1) {
      // AI — model core with context nodes
      const core = new Mesh(gCyl, parts);
      core.scale.set(1.9, 0.6, 1.9);
      core.position.y = TOP + 0.08;
      group.add(core);
      const spokes: number[] = [];
      for (let k = 0; k < 8; k++) {
        const t = (k / 8) * Math.PI * 2;
        const x = Math.cos(t) * 1.1;
        const z = Math.sin(t) * 1.1;
        box(group, parts, x, z, 0.18, 0.18, 0.18);
        spokes.push(Math.cos(t) * 0.42, y, Math.sin(t) * 0.42, x, y, z);
      }
      lines(group, edge, spokes);
    } else if (i === 2) {
      // AUTOMATION — a pipeline of steps
      const path: [number, number][] = [
        [-1.25, -1.0],
        [-0.6, -0.2],
        [0.1, 0.3],
        [0.75, -0.35],
        [1.3, 0.6],
      ];
      const seg: number[] = [];
      path.forEach(([x, z], k) => {
        box(group, parts, x, z, 0.34, 0.18, 0.34);
        if (k) seg.push(path[k - 1][0], y, path[k - 1][1], x, y, z);
      });
      lines(group, edge, seg);
    } else if (i === 3) {
      // UI — interface regions
      const regions: [number, number, number, number][] = [
        [0, -1.25, 2.8, 0.22],
        [-0.45, -0.5, 1.9, 0.9],
        [1.0, -0.5, 0.8, 0.9],
        [-0.7, 0.68, 1.4, 0.9],
        [0.85, 0.68, 1.1, 0.9],
        [0, 1.36, 2.8, 0.14],
      ];
      for (const [x, z, w, d] of regions) box(group, parts, x, z, w, 0.045, d);
    } else if (i === 4) {
      // CONTENT — lines of copy and a media block
      [2.6, 2.2, 2.5, 1.6, 2.0].forEach((w, k) => box(group, parts, -1.3 + w / 2, -1.05 + k * 0.36, w, 0.035, 0.1));
      box(group, parts, 0.75, 1.0, 1.5, 0.05, 0.6);
    } else {
      // SEARCH — an index beacon broadcasting outward
      box(group, parts, 0, 0, 0.16, 0.9, 0.16);
      for (const r of [0.6, 1.15]) {
        const ring = new Mesh(gRing, parts);
        ring.scale.setScalar(r);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = TOP + 0.02;
        group.add(ring);
      }
    }

    root.add(group);
    layers.push({ group, plate, edge, parts, h: 0, hover: 0 });
  }

  // Conduits between layers + packets travelling through them.
  const conduitGeo = new BufferGeometry();
  const conduitPos = new Float32Array(COLUMNS.length * 6);
  conduitGeo.setAttribute("position", new BufferAttribute(conduitPos, 3));
  const conduit = new LineSegments(
    conduitGeo,
    new LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.14 }),
  );
  root.add(conduit);

  const packetCount = coarse ? 28 : 64;
  const packets = new InstancedMesh(new BoxGeometry(0.055, 0.055, 0.055), new MeshBasicMaterial({ color: SIGNAL }), packetCount);
  const pk = Array.from({ length: packetCount }, (_, i) => ({
    col: i % COLUMNS.length,
    u: Math.random(),
    v: 0.06 + Math.random() * 0.12,
    dir: Math.random() < 0.6 ? -1 : 1, // mostly requests flowing down into the system
  }));
  root.add(packets);

  // ── State ──────────────────────────────────────────────────────────
  const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
  const cur: Target = targetFor("hero", 0, undefined, false, false);
  let spin = 0;
  const pointer = new Vector2(0, 0);
  const pointerSmooth = new Vector2(0, 0);
  const raycaster = new Raycaster();
  let hovered = -1;
  let lastScroll = window.scrollY;
  let velocity = 0;
  let mobile = false;
  let fit = 1;
  let width = 0;
  let height = 0;
  let raf = 0;
  let last = performance.now();
  let frameTimes = 0;
  let frames = 0;
  let ready = false;
  let lastKey = "";
  const m4 = new Matrix4();

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    if (!width || !height) return;
    mobile = width < 768;
    camera.aspect = width / height;
    fit = Math.min(1.9, Math.max(1, 1.7 / camera.aspect));
    renderer.setSize(width, height, false);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    canvas.removeAttribute("data-ready");
    document.documentElement.classList.remove("scene-ready");
    document.documentElement.classList.add("no-webgl");
  };
  canvas.addEventListener("webglcontextlost", onLost);

  const pick = () => {
    let best: HTMLElement | null = null;
    let area = 0;
    const vh = window.innerHeight;
    for (const el of sections) {
      const r = el.getBoundingClientRect();
      const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (vis > area) {
        area = vis;
        best = el;
      }
    }
    return best;
  };

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const still = reduced.matches;

    const sy = window.scrollY;
    velocity = lerp(velocity, Math.abs(sy - lastScroll) / Math.max(dt, 0.001), 0.12);
    lastScroll = sy;

    const el = pick();
    if (!el) return; // every window is off-screen: the canvas is covered, skip the GPU.

    const t = targetFor(el.dataset.scene as Mode, sectionProgress(el), el.dataset.focus, mobile, still);

    // Reduced motion: jump to each state, render only when something changed.
    const k = still ? 1 : 1 - Math.exp(-dt * 2.6);
    for (const key of Object.keys(t) as (keyof Target)[]) {
      if (key === "focus") continue;
      cur[key] = lerp(cur[key], t[key], k);
    }
    cur.focus = t.focus;
    if (still) {
      const stateKey = `${el.dataset.scene}|${t.focus}|${t.all}|${width}x${height}`;
      if (ready && stateKey === lastKey) return;
      lastKey = stateKey;
    }

    // Motion inputs: auto-spin, pointer parallax, scroll velocity.
    const vBoost = still ? 0 : Math.min(velocity / 1200, 3);
    if (!still) spin += cur.spin * dt * (1 + vBoost * 0.4);
    pointerSmooth.lerp(pointer, still ? 1 : 1 - Math.exp(-dt * 3));

    // Layers: spacing, twist, focus highlight, hover lift.
    const step = THICK + cur.gap;
    const stackH = step * (LAYERS - 1);
    root.position.y = -stackH / 2;
    root.rotation.y = spin;
    const hk = still ? 1 : 1 - Math.exp(-dt * 6);
    for (let i = 0; i < LAYERS; i++) {
      const L = layers[i];
      const on = Math.max(cur.focus === i ? 1 : 0, cur.all);
      L.h = lerp(L.h, on, hk);
      L.hover = lerp(L.hover, hovered === i ? 1 : 0, hk);
      L.group.position.y = i * step + (cur.focus === i ? 0.22 : 0) * L.h + 0.08 * L.hover;
      L.group.rotation.y = i * cur.twist;
      L.edge.color.copy(BONE).lerp(SIGNAL, L.h);
      L.edge.opacity = Math.min(1, 0.22 + 0.78 * L.h + 0.25 * L.hover);
      L.parts.emissiveIntensity = 0.85 * L.h;
    }

    for (let c = 0; c < COLUMNS.length; c++) {
      const [x, z] = COLUMNS[c];
      conduitPos.set([x, 0, z, x, stackH, z], c * 6);
    }
    conduitGeo.attributes.position.needsUpdate = true;

    const speed = still ? 0 : cur.speed * (1 + vBoost);
    for (let i = 0; i < packetCount; i++) {
      const q = pk[i];
      q.u = (q.u + q.dir * q.v * speed * dt + 1) % 1;
      const [x, z] = COLUMNS[q.col];
      m4.makeTranslation(x, q.u * stackH, z);
      packets.setMatrixAt(i, m4);
    }
    packets.instanceMatrix.needsUpdate = true;

    // Camera: spherical orbit around the stack, offset in screen space.
    const r = cur.r * fit;
    const az = cur.az + pointerSmooth.x * 0.12;
    const elv = cur.el + pointerSmooth.y * 0.06;
    camera.position.set(r * Math.cos(elv) * Math.sin(az), r * Math.sin(elv), r * Math.cos(elv) * Math.cos(az));
    camera.lookAt(0, cur.look, 0);
    camera.setViewOffset(width, height, -cur.ox * width, -cur.oy * height, width, height);

    // Cursor proximity: the plate under the pointer lifts slightly.
    if (!coarse && !still) {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(
        layers.map((l) => l.plate as Object3D),
        false,
      )[0];
      hovered = hit ? (hit.object.userData.layer as number) : -1;
    }

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      canvas.setAttribute("data-ready", "");
      document.documentElement.classList.add("scene-ready");
    }

    // Adaptive resolution: step DPR down if frames run long.
    frameTimes += dt;
    frames++;
    if (frames === 90) {
      const avg = frameTimes / frames;
      if (avg > 1 / 40 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        resize();
      }
      frames = 0;
      frameTimes = 0;
    }
  };
  let disposed = false;
  renderer
    .compileAsync(scene, camera)
    .catch(() => {})
    .then(() => {
      if (!disposed) raf = requestAnimationFrame(tick);
    });

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("pointermove", onPointer);
    canvas.removeEventListener("webglcontextlost", onLost);
    scene.traverse((o) => {
      const mesh = o as Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as Material | Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    env?.dispose();
    pmrem?.dispose();
    renderer.dispose();
  };
}
