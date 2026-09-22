'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CarFront, Footprints, Pause, Play, RotateCcw, Sparkles } from 'lucide-react';

type Point = { lat: number; lng: number; label: string };
type RouteLeg = {
  distanceKm: number;
  durationMin: number;
  coordinates: [number, number][];
  provider: string;
} | null;

type RouteSchool = {
  slug: string;
  name: string;
  shortName?: string;
  sector?: string;
  point: Point;
  driving: RouteLeg;
  walking: RouteLeg;
};

type JourneyMode = 'drive' | 'walk';

function chooseMode(school: RouteSchool): JourneyMode {
  const distance = school.driving && Number.isFinite(school.driving.distanceKm)
    ? school.driving.distanceKm
    : Number.POSITIVE_INFINITY;
  return distance <= 2.2 ? 'walk' : 'drive';
}

function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || !Number.isFinite(minutes)) return 'Route time unavailable';
  if (minutes < 60) return String(minutes) + ' min';
  return String(Math.floor(minutes / 60)) + 'h ' + String(minutes % 60) + 'm';
}

function sampleCoordinates(coordinates: [number, number][], maxPoints = 72): [number, number][] {
  if (coordinates.length <= maxPoints) return coordinates;
  const output: [number, number][] = [];
  const step = (coordinates.length - 1) / (maxPoints - 1);
  for (let index = 0; index < maxPoints; index += 1) {
    output.push(coordinates[Math.round(index * step)]);
  }
  return output;
}

function addTree(THREE: any, scene: any, x: number, z: number, scale: number) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 0.7 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b6b4c, roughness: 1 })
  );
  trunk.position.set(x, 0.35 * scale, z);
  trunk.castShadow = true;

  const crown = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.58 * scale, 1),
    new THREE.MeshStandardMaterial({ color: 0x72a36c, roughness: 1 })
  );
  crown.position.set(x, 1.05 * scale, z);
  crown.castShadow = true;

  scene.add(trunk, crown);
}

function addBuilding(THREE: any, scene: any, x: number, z: number, school: boolean) {
  const group = new THREE.Group();
  const width = school ? 6.2 : 5.2;
  const depth = school ? 4.2 : 3.6;
  const height = school ? 3.9 : 5.4;

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: school ? 0xf0f5f8 : 0xe4edf3,
      roughness: 0.78,
      metalness: 0.05,
    })
  );
  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const side = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, height * 0.88, depth * 0.9),
    new THREE.MeshStandardMaterial({ color: school ? 0xd5e3eb : 0xcbd9e4 })
  );
  side.position.set(width / 2 + 0.12, height / 2, 0);
  group.add(side);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry((Math.max(width, depth) * 0.72), school ? 1.4 : 1.1, 4),
    new THREE.MeshStandardMaterial({ color: school ? 0xffffff : 0xcddbe5, roughness: 0.8 })
  );
  roof.position.y = height + (school ? 0.55 : 0.45);
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  group.add(roof);

  const windowMaterial = new THREE.MeshStandardMaterial({
    color: school ? 0x8eb5cc : 0x91afc3,
    roughness: 0.25,
    metalness: 0.05,
  });

  const rows = school ? 2 : 3;
  const cols = school ? 4 : 3;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const window = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.48, 0.06),
        windowMaterial
      );
      const start = -((cols - 1) * 0.95) / 2;
      window.position.set(start + col * 0.95, 1.05 + row * 1.18, -depth / 2 - 0.04);
      group.add(window);
    }
  }

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 1.55, 0.08),
    new THREE.MeshStandardMaterial({ color: school ? 0x527f9c : 0x607c8d })
  );
  door.position.set(0, 0.78, depth / 2 + 0.05);
  group.add(door);

  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

function addParent(THREE: any, accent: number) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.44, 0.95, 12),
    new THREE.MeshStandardMaterial({ color: accent, roughness: 0.8 })
  );
  body.position.y = 1.15;
  body.castShadow = true;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.31, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xf1c6a8, roughness: 0.92 })
  );
  head.position.y = 1.98;
  head.castShadow = true;
  group.add(head);

  const armMaterial = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.8 });
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x263142, roughness: 0.92 });

  const armA = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.82, 10), armMaterial);
  const armB = armA.clone();
  armA.position.set(-0.42, 1.17, 0);
  armB.position.set(0.42, 1.17, 0);
  armA.rotation.z = -0.48;
  armB.rotation.z = 0.48;
  armA.castShadow = armB.castShadow = true;

  const legA = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.92, 10), legMaterial);
  const legB = legA.clone();
  legA.position.set(-0.16, 0.46, 0);
  legB.position.set(0.16, 0.46, 0);
  legA.rotation.z = -0.12;
  legB.rotation.z = 0.12;
  legA.castShadow = legB.castShadow = true;

  group.add(armA, armB, legA, legB);
  group.userData.armA = armA;
  group.userData.armB = armB;
  group.userData.legA = legA;
  group.userData.legB = legB;

  return group;
}

function addWalkingCouple(THREE: any, scene: any) {
  const couple = new THREE.Group();
  const parentA = addParent(THREE, 0x0f4c81);
  const parentB = addParent(THREE, 0xf28b5b);

  parentA.position.x = -0.62;
  parentB.position.x = 0.62;
  parentB.position.z = 0.16;
  couple.add(parentA, parentB);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.55, 32),
    new THREE.MeshBasicMaterial({ color: 0x0f4c81, transparent: true, opacity: 0.10 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.035;
  couple.add(shadow);

  scene.add(couple);
  return couple;
}

function addCar(THREE: any, scene: any) {
  const car = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.05, 0.78, 4.0),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45, metalness: 0.08 })
  );
  body.position.y = 0.92;
  body.castShadow = true;
  car.add(body);

  const bonnet = new THREE.Mesh(
    new THREE.BoxGeometry(1.96, 0.28, 0.72),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.38 })
  );
  bonnet.position.set(0, 1.28, 1.38);
  bonnet.castShadow = true;
  car.add(bonnet);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.78, 0.78, 2.1),
    new THREE.MeshStandardMaterial({ color: 0xe9eef2, roughness: 0.5 })
  );
  cabin.position.set(0, 1.48, -0.05);
  cabin.castShadow = true;
  car.add(cabin);

  const frontGlass = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.46, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x8eb0c7, roughness: 0.2, metalness: 0.15 })
  );
  frontGlass.position.set(0, 1.51, 1.02);
  frontGlass.rotation.x = -0.08;
  car.add(frontGlass);

  const rearGlass = frontGlass.clone();
  rearGlass.position.z = -1.12;
  rearGlass.rotation.x = 0.08;
  car.add(rearGlass);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(1.86, 0.11, 2.45),
    new THREE.MeshStandardMaterial({ color: 0xdfe6eb, roughness: 0.5 })
  );
  roof.position.set(0, 1.91, -0.03);
  car.add(roof);

  const bumper = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.22, 0.28),
    new THREE.MeshStandardMaterial({ color: 0xcbd4dc, roughness: 0.55 })
  );
  bumper.position.set(0, 0.68, 1.93);
  car.add(bumper);

  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x202732, roughness: 0.9 });
  const hubMaterial = new THREE.MeshStandardMaterial({ color: 0xbfc8d0, metalness: 0.5, roughness: 0.38 });
  const wheels: any[] = [];

  [[-1.03, 1.28], [1.03, 1.28], [-1.03, -1.28], [1.03, -1.28]].forEach(function (entry) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.43, 0.24, 18), wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(entry[0], 0.52, entry[1]);
    wheel.castShadow = true;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.26, 14), hubMaterial);
    hub.rotation.z = Math.PI / 2;
    wheel.add(hub);
    car.add(wheel);
    wheels.push(wheel);
  });

  const headlight = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.18, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xfff6c7, emissive: 0xffee9d, emissiveIntensity: 1.25 })
  );
  headlight.position.set(-0.62, 1.0, 2.02);
  const headlightB = headlight.clone();
  headlightB.position.x = 0.62;
  car.add(headlight, headlightB);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(2.15, 32),
    new THREE.MeshBasicMaterial({ color: 0x0f4c81, transparent: true, opacity: 0.11 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.035;
  car.add(shadow);

  car.userData.wheels = wheels;
  car.userData.speedLines = [];
  scene.add(car);
  return car;
}

export default function SchoolRunJourney3D({
  origin,
  school,
  animationToken,
}: {
  origin: Point;
  school: RouteSchool;
  animationToken: string;
}) {
  const mode = chooseMode(school);
  const [running, setRunning] = useState(true);
  const [webglFailed, setWebglFailed] = useState(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const runningRef = useRef(true);
  const [replayNonce, setReplayNonce] = useState(0);

  const selectedRoute = mode === 'walk' ? (school.walking || school.driving) : school.driving;
  const distance = school.driving ? school.driving.distanceKm : null;
  const durationText = formatDuration(
    mode === 'walk' && school.walking ? school.walking.durationMin : school.driving ? school.driving.durationMin : null
  );

  const routeSignature = useMemo(function () {
    const route = selectedRoute && selectedRoute.coordinates ? selectedRoute.coordinates : [];
    return route.length + ':' + (route[0] ? route[0][0] + ':' + route[0][1] : '') + ':' + (route[route.length - 1] ? route[route.length - 1][0] + ':' + route[route.length - 1][1] : '');
  }, [selectedRoute]);

  useEffect(function () {
    runningRef.current = true;
    setRunning(true);
  }, [animationToken, routeSignature]);

  useEffect(function () {
    if (!mountRef.current) return;

    let disposed = false;
    let renderer: any = null;
    let frame = 0;
    let resizeHandler: (() => void) | null = null;

    async function boot() {
      try {
        const THREE = await import('three');
        if (disposed || !mountRef.current) return;

        const mount = mountRef.current;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xeaf4fa);
        scene.fog = new THREE.Fog(0xeaf4fa, 28, 65);

        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 150);
        camera.position.set(13, 13, 22);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mount.innerHTML = '';
        mount.appendChild(renderer.domElement);

        const ambient = new THREE.HemisphereLight(0xfafcff, 0xa5b8c5, 1.65);
        scene.add(ambient);

        const sun = new THREE.DirectionalLight(0xffffff, 2.5);
        sun.position.set(12, 20, 10);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        scene.add(sun);

        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(70, 52),
          new THREE.MeshStandardMaterial({ color: 0xf7fafb, roughness: 1 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        const coords = selectedRoute && selectedRoute.coordinates && selectedRoute.coordinates.length >= 2
          ? sampleCoordinates(selectedRoute.coordinates)
          : [[origin.lng, origin.lat], [school.point.lng, school.point.lat]] as [number, number][];

        const minLng = Math.min.apply(null, coords.map(p => p[0]));
        const maxLng = Math.max.apply(null, coords.map(p => p[0]));
        const minLat = Math.min.apply(null, coords.map(p => p[1]));
        const maxLat = Math.max.apply(null, coords.map(p => p[1]));
        const lngSpan = Math.max(maxLng - minLng, 0.00001);
        const latSpan = Math.max(maxLat - minLat, 0.00001);
        const routePoints = coords.map(function (pair) {
          return new THREE.Vector3(
            ((pair[0] - minLng) / lngSpan - 0.5) * 30,
            0.48,
            -((pair[1] - minLat) / latSpan - 0.5) * 18
          );
        });

        const curve = new THREE.CatmullRomCurve3(routePoints, false, 'catmullrom', 0.18);
        const road = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 160, 0.78, 6, false),
          new THREE.MeshStandardMaterial({ color: 0xc7d3dd, roughness: 0.95, metalness: 0 })
        );
        road.receiveShadow = true;
        road.castShadow = true;
        scene.add(road);

        const routeGlow = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 160, 0.07, 6, false),
          new THREE.MeshStandardMaterial({ color: mode === 'walk' ? 0xf28b5b : 0x0f4c81, emissive: mode === 'walk' ? 0x7a3214 : 0x063456, emissiveIntensity: 0.55 })
        );
        routeGlow.position.y += 0.72;
        scene.add(routeGlow);

        const center = curve.getPointAt(0.5);
        addBuilding(THREE, scene, routePoints[0].x - 4.8, routePoints[0].z - 1.8, false);
        addBuilding(THREE, scene, routePoints[routePoints.length - 1].x + 4.2, routePoints[routePoints.length - 1].z + 0.6, true);

        addTree(THREE, scene, center.x - 7, center.z + 3.6, 1.1);
        addTree(THREE, scene, center.x + 6, center.z - 3.1, 0.9);
        addTree(THREE, scene, center.x - 3, center.z - 4.4, 0.82);

        const clouds: any[] = [];
        for (let i = 0; i < 7; i += 1) {
          const cloud = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.95 + (i % 2) * 0.25, 1),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.82 })
          );
          cloud.position.set(-18 + i * 6.2, 9 + (i % 3) * 1.15, -6 - (i % 2) * 2);
          cloud.scale.set(1.45, 0.65, 0.85);
          scene.add(cloud);
          clouds.push(cloud);
        }

        const traveler = mode === 'walk'
          ? addWalkingCouple(THREE, scene)
          : addCar(THREE, scene);

        let progress = 0;
        let startTime = performance.now();
        const loopDuration = mode === 'walk' ? 10.5 : 8.5;

        function resize() {
          if (!renderer || !mountRef.current) return;
          const width = mountRef.current.clientWidth || 1;
          const height = mountRef.current.clientHeight || 1;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        }

        resizeHandler = resize;
        window.addEventListener('resize', resize);
        resize();

        function lookAtCenter() {
          const lookTarget = new THREE.Vector3(center.x, 0.7, center.z);
          camera.lookAt(lookTarget);
        }

        lookAtCenter();

        function animate(now: number) {
          if (disposed || !renderer) return;

          const delta = Math.min(0.05, (now - startTime) / 1000);
          startTime = now;

          if (runningRef.current) {
            progress = (progress + delta / loopDuration) % 1;
          }

          const point = curve.getPointAt(progress);
          const tangent = curve.getTangentAt(progress).normalize();
          const angle = Math.atan2(tangent.x, tangent.z);

          traveler.position.copy(point);
          traveler.position.y = mode === 'walk' ? 1.15 : 0.75;
          traveler.rotation.y = angle;

          if (mode === 'walk') {
            const parentA = traveler.children[0];
            const parentB = traveler.children[1];
            const walkWave = Math.sin(progress * Math.PI * 2 * 16);
            const parentAData = parentA.userData;
            const parentBData = parentB.userData;
            if (parentAData.legA) parentAData.legA.rotation.z = -0.45 + walkWave * 0.38;
            if (parentAData.legB) parentAData.legB.rotation.z = 0.45 - walkWave * 0.38;
            if (parentAData.armA) parentAData.armA.rotation.z = -0.25 - walkWave * 0.24;
            if (parentAData.armB) parentAData.armB.rotation.z = 0.25 + walkWave * 0.24;
            if (parentBData.legA) parentBData.legA.rotation.z = 0.45 - walkWave * 0.38;
            if (parentBData.legB) parentBData.legB.rotation.z = -0.45 + walkWave * 0.38;
            if (parentBData.armA) parentBData.armA.rotation.z = -0.25 + walkWave * 0.24;
            if (parentBData.armB) parentBData.armB.rotation.z = 0.25 - walkWave * 0.24;
            traveler.position.y += Math.abs(walkWave) * 0.04;
          } else {
            const wheels = traveler.userData.wheels || [];
            wheels.forEach(function (wheel: any) {
              wheel.rotation.x += delta * 8.6;
            });
            traveler.position.y += Math.sin(progress * Math.PI * 2 * 14) * 0.025;
          }

          clouds.forEach(function (cloud: any, index: number) {
            cloud.position.x += delta * (0.12 + index * 0.008);
            if (cloud.position.x > 24) cloud.position.x = -24;
            cloud.rotation.y += delta * 0.05;
          });

          const cameraBob = Math.sin(now / 2900) * 0.35;
          camera.position.y = 13 + cameraBob;
          camera.position.x = 13 + Math.sin(now / 4600) * 1.1;
          camera.position.z = 22 + Math.cos(now / 5200) * 1.4;
          lookAtCenter();

          renderer.render(scene, camera);
          frame = requestAnimationFrame(animate);
        }

        frame = requestAnimationFrame(animate);
      } catch (error) {
        console.error('[SCHOOL_RUN_3D]', error);
        if (!disposed) setWebglFailed(true);
      }
    }

    void boot();

    return function () {
      disposed = true;
      cancelAnimationFrame(frame);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      }
    };
  }, [mode, origin.lat, origin.lng, school.point.lat, school.point.lng, selectedRoute, routeSignature, replayNonce]);

  const setRunState = function (value: boolean) {
    runningRef.current = value;
    setRunning(value);
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(145deg,#f7fbff_0%,#ffffff_56%,#fff7f1_100%)] shadow-[0_24px_70px_rgba(15,76,129,.10)]">
      <style jsx>{\`
        .school-run-3d-grid {
          background-image:
            linear-gradient(rgba(15,76,129,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,76,129,.06) 1px, transparent 1px);
          background-size: 34px 34px;
        }
        @keyframes schoolRunBadge {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .school-run-badge { animation: schoolRunBadge 2.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .school-run-badge { animation: none !important; }
        }
      \`}</style>

      <div className="relative z-10 border-b border-slate-200/80 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="school-run-badge inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-[var(--color-primary)] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Real 3D family journey
            </div>
            <h3 className="mt-2 text-lg font-black tracking-tight text-[var(--color-content)] sm:text-xl">
              {mode === 'walk' ? 'They walk together' : 'They’re off to school'}
            </h3>
            <p className="mt-1 max-w-3xl text-xs text-[var(--color-content-muted)]">
              {mode === 'walk'
                ? school.name + ' is close enough to make this a walk from ' + origin.label + '.'
                : school.name + ' is far enough away that the parents take the car from ' + origin.label + '.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={'inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-black shadow-sm ' + (mode === 'walk' ? 'border-orange-200 bg-orange-50 text-orange-900' : 'border-sky-200 bg-sky-50 text-sky-900')}>
              {mode === 'walk' ? <Footprints className="h-4 w-4" /> : <CarFront className="h-4 w-4" />}
              {mode === 'walk' ? 'AUTO · WALK' : 'AUTO · DRIVE'}
            </div>
            <button
              type="button"
              onClick={function () {
                setReplayNonce(function (value) { return value + 1; });
                runningRef.current = true;
                setRunning(true);
              }}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Replay
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Distance</div>
            <div className="mt-1 text-sm font-black text-slate-900">{distance == null ? '—' : distance.toFixed(2) + ' km'}</div>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Travel</div>
            <div className="mt-1 text-sm font-black text-slate-900">{durationText}</div>
          </div>
          <div className="rounded-2xl border border-white bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mode rule</div>
            <div className="mt-1 truncate text-sm font-black text-slate-900">{mode === 'walk' ? '≤ 2.2 km · walk' : '> 2.2 km · drive'}</div>
          </div>
        </div>
      </div>

      <div className="school-run-3d-grid relative h-[420px] overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#ffffff_0%,#eef7fb_42%,#dbe8ee_100%)] sm:h-[500px]">
        <div ref={mountRef} className="absolute inset-0" />

        {webglFailed ? (
          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="max-w-md rounded-3xl border border-white bg-white/90 p-6 text-center shadow-xl backdrop-blur">
              <Sparkles className="mx-auto h-8 w-8 text-[var(--color-primary)]" />
              <h4 className="mt-3 text-base font-black text-slate-900">3D mode is unavailable in this browser</h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                The real route map below still works normally, and your exact school coordinates remain the source for the journey.
              </p>
            </div>
          </div>
        ) : null}

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/90 bg-white/82 px-3 py-2 shadow-lg backdrop-blur-xl">
          <div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">Base</div>
          <div className="max-w-[180px] truncate text-xs font-extrabold text-slate-900">{origin.label}</div>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 rounded-2xl border border-white/90 bg-white/82 px-3 py-2 text-right shadow-lg backdrop-blur-xl">
          <div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">School</div>
          <div className="max-w-[180px] truncate text-xs font-extrabold text-slate-900">{school.name}</div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl border border-white/90 bg-white/82 px-4 py-3 shadow-lg backdrop-blur-xl">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">
              {mode === 'walk' ? '👟 Parents walking together' : '🚙 White ROXX-style SUV easter egg'}
            </div>
            <div className="truncate text-xs font-extrabold text-slate-900">
              {origin.label + ' → ' + school.name}
            </div>
          </div>

          <button
            type="button"
            onClick={function () {
              setRunState(!running);
            }}
            className="inline-flex min-h-[42px] shrink-0 items-center gap-1.5 rounded-2xl bg-[var(--color-primary)] px-3.5 py-2 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5"
          >
            {running ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            {running ? 'Pause' : 'Play'}
          </button>
        </div>
      </div>
    </section>
  );
}
