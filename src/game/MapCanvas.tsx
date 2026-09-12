import { useEffect, useRef } from "react";
import { poseAt } from "./sim";
import { useGame } from "./store";
import { DEPOT_PROP, NODES, STATIONS, getStation } from "./world";

const MAP_SRC = "/game/map-base.jpg";
const VAN_SRC = "/game/van.png";
const STATION_SRC = "/game/station.png";
const DEPOT_SRC = "/game/depot.png";

type Cam = { zoom: number; panX: number; panY: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function tint(src: HTMLImageElement, color: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = src.width;
  c.height = src.height;
  const g = c.getContext("2d")!;
  g.drawImage(src, 0, 0);
  g.globalCompositeOperation = "multiply";
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = "destination-in";
  g.drawImage(src, 0, 0);
  return c;
}

type Trail = { x: number; y: number }[];

export function MapCanvas({ ambient = false }: { ambient?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cam = useRef<Cam>({ zoom: 1, panX: 0, panY: 0 });
  const trails = useRef(new Map<string, Trail>());
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const assets = useRef<{
    map: HTMLImageElement;
    van: HTMLImageElement;
    station: HTMLImageElement;
    depot: HTMLImageElement;
    vans: Map<string, HTMLCanvasElement>;
  } | null>(null);

  useEffect(() => {
    let dead = false;
    Promise.all([loadImage(MAP_SRC), loadImage(VAN_SRC), loadImage(STATION_SRC), loadImage(DEPOT_SRC)]).then(
      ([map, van, station, depot]) => {
        if (dead) return;
        assets.current = { map, van, station, depot, vans: new Map() };
      },
    );
    return () => {
      dead = true;
    };
  }, []);

  const caseId = useGame((s) => s.compiled?.def.id);
  const agent = useGame((s) => s.agent.enabled);
  const selectedCardId = useGame((s) => s.selectedCardId);

  useEffect(() => {
    trails.current.clear();
  }, [caseId]);

  useEffect(() => {
    if (!agent || !selectedCardId || ambient) return;
    const compiled = useGame.getState().compiled;
    const card = compiled?.cards.find((c) => c.id === selectedCardId);
    if (!card) return;
    const st = getStation(card.stationId);
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const map = assets.current?.map;
    if (!canvas || !wrap || !map) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cw = wrap.clientWidth * dpr;
    const ch = wrap.clientHeight * dpr;
    const zoom = 1.85;
    const scale = Math.min(cw / map.width, ch / map.height) * zoom;
    const w = map.width * scale;
    const h = map.height * scale;
    const sx = st.propX * w;
    const sy = st.propY * h;
    cam.current.zoom = zoom;
    cam.current.panX = cw / 2 - (w / 2 + sx);
    cam.current.panY = ch / 2 - (h / 2 + sy);
  }, [agent, selectedCardId, ambient, caseId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      useGame.getState().advance(dt);
      draw(canvas, assets.current, cam.current, trails.current, now, ambient);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [ambient]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = cam.current;
      const next = Math.min(2.6, Math.max(1, c.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
      c.zoom = next;
      if (next <= 1.01) {
        c.panX = 0;
        c.panY = 0;
        c.zoom = 1;
      }
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag.current = { x: e.clientX, y: e.clientY, panX: cam.current.panX, panY: cam.current.panY };
      wrap.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cam.current.panX = drag.current.panX + (e.clientX - drag.current.x) * dpr;
      cam.current.panY = drag.current.panY + (e.clientY - drag.current.y) * dpr;
    };
    const onUp = () => {
      drag.current = null;
    };
    wrap.addEventListener("wheel", onWheel, { passive: false });
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
    return () => {
      wrap.removeEventListener("wheel", onWheel);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-full w-full touch-none overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

type Assets = {
  map: HTMLImageElement;
  van: HTMLImageElement;
  station: HTMLImageElement;
  depot: HTMLImageElement;
  vans: Map<string, HTMLCanvasElement>;
};

function mapRect(canvas: HTMLCanvasElement, img: HTMLImageElement, cam: Cam) {
  const cw = canvas.width;
  const ch = canvas.height;
  const scale = Math.min(cw / img.width, ch / img.height) * cam.zoom;
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (cw - w) / 2 + cam.panX;
  const y = (ch - h) / 2 + cam.panY;
  return { x, y, w, h };
}

function worldToScreen(wx: number, wy: number, rect: { x: number; y: number; w: number; h: number }) {
  return { x: rect.x + wx * rect.w, y: rect.y + wy * rect.h };
}

function draw(
  canvas: HTMLCanvasElement,
  assets: Assets | null,
  cam: Cam,
  trails: Map<string, Trail>,
  now: number,
  ambient: boolean,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0c0d0f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!assets) return;

  const rect = mapRect(canvas, assets.map, cam);
  ctx.drawImage(assets.map, rect.x, rect.y, rect.w, rect.h);

  const state = useGame.getState();
  const compiled = state.compiled;
  if (!compiled) return;

  const pulse = 0.5 + 0.5 * Math.sin(now / 280);

  const depot = worldToScreen(DEPOT_PROP.x, DEPOT_PROP.y, rect);
  const depotSize = rect.w * DEPOT_PROP.scale;
  ctx.drawImage(assets.depot, depot.x - depotSize / 2, depot.y - depotSize / 2, depotSize, depotSize);

  const selectedCard = compiled.cards.find((c) => c.id === state.selectedCardId);
  const highlightStation = selectedCard ? getStation(selectedCard.stationId) : null;

  for (const st of STATIONS) {
    const p = worldToScreen(st.propX, st.propY, rect);
    const size = rect.w * st.propScale;
    if (highlightStation?.id === st.id) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.62, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(122, 155, 184, ${0.12 + 0.16 * pulse})`;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(200, 214, 228, ${0.45 + 0.35 * pulse})`;
      ctx.stroke();
    }
    ctx.drawImage(assets.station, p.x - size / 2, p.y - size / 2, size, size);
  }

  ctx.font = `${Math.max(11, rect.w * 0.012)}px "IBM Plex Sans", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (const st of STATIONS) {
    const p = worldToScreen(st.propX, st.propY, rect);
    const size = rect.w * st.propScale;
    ctx.fillStyle = "rgba(12, 13, 15, 0.72)";
    const label = st.short.toUpperCase();
    const tw = ctx.measureText(label).width;
    ctx.fillRect(p.x - tw / 2 - 6, p.y + size * 0.38, tw + 12, 16);
    ctx.fillStyle = "#e8e6e1";
    ctx.fillText(label, p.x, p.y + size * 0.38 + 2);
  }

  const yard = worldToScreen(NODES.find((n) => n.id === "B1")!.x, NODES.find((n) => n.id === "B1")!.y, rect);
  ctx.fillStyle = "rgba(12, 13, 15, 0.72)";
  const yl = "YARD 7";
  const yw = ctx.measureText(yl).width;
  ctx.fillRect(yard.x - yw / 2 - 6, yard.y + 18, yw + 12, 16);
  ctx.fillStyle = "#c8ccd4";
  ctx.fillText(yl, yard.x, yard.y + 20);

  const poses = compiled.cars.map((car) => ({ car, pose: poseAt(car, state.time) }));

  for (const { car, pose } of poses) {
    let trail = trails.get(car.id);
    if (!trail) {
      trail = [];
      trails.set(car.id, trail);
    }
    const last = trail[trail.length - 1];
    if (!last || Math.hypot(last.x - pose.x, last.y - pose.y) > 0.004) {
      trail.push({ x: pose.x, y: pose.y });
      if (trail.length > 56) trail.shift();
    }
  }

  for (const { car } of poses) {
    const trail = trails.get(car.id);
    if (!trail || trail.length < 2) continue;
    ctx.beginPath();
    trail.forEach((p, i) => {
      const s = worldToScreen(p.x, p.y, rect);
      if (i === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    });
    ctx.strokeStyle = car.color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(1.5, rect.w * 0.003);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const vanH = rect.w * 0.04;
  const parkedCount = new Map<string, number>();
  const parkedIndex = new Map<string, number>();
  for (const { car, pose } of poses) {
    if (pose.moving || !pose.nodeId) continue;
    const n = parkedCount.get(pose.nodeId) ?? 0;
    parkedIndex.set(car.id, n);
    parkedCount.set(pose.nodeId, n + 1);
  }
  for (const { car, pose } of poses) {
    let sprite = assets.vans.get(car.id);
    if (!sprite) {
      sprite = tint(assets.van, car.color);
      assets.vans.set(car.id, sprite);
    }
    const p = worldToScreen(pose.x, pose.y, rect);
    if (!pose.moving && pose.nodeId) {
      const n = parkedCount.get(pose.nodeId) ?? 1;
      const i = parkedIndex.get(car.id) ?? 0;
      if (n > 1) {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        p.x += Math.cos(ang) * vanH * 0.85;
        p.y += Math.sin(ang) * vanH * 0.85;
      }
    }
    const selected = state.selectedCarId === car.id || selectedCard && state.assignments[selectedCard.id] === car.id;
    if (pose.fueling || selected) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, vanH * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = pose.fueling ? `rgba(232, 230, 225, ${0.5 + 0.4 * pulse})` : "rgba(122, 155, 184, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(pose.heading);
    const vh = vanH;
    const vw = vh * (sprite.width / sprite.height);
    ctx.drawImage(sprite, -vw / 2, -vh / 2, vw, vh);
    ctx.restore();

    if (!ambient) {
      const atSwipeStation =
        selectedCard &&
        highlightStation &&
        !pose.moving &&
        pose.nodeId === highlightStation.node;
      const labelSize = atSwipeStation && state.agent.enabled ? 0.014 : 0.011;
      ctx.font = `600 ${Math.max(10, rect.w * labelSize)}px "Barlow Condensed", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "rgba(12, 13, 15, 0.78)";
      const tw = ctx.measureText(car.callsign).width;
      const lh = atSwipeStation && state.agent.enabled ? 16 : 14;
      ctx.fillRect(p.x - tw / 2 - 5, p.y - vanH * 0.72 - lh - 1, tw + 10, lh);
      ctx.fillStyle = atSwipeStation && pose.fueling ? "#e8e6e1" : car.color;
      ctx.fillText(car.callsign, p.x, p.y - vanH * 0.72);
    }
  }

  if (ambient) {
    ctx.fillStyle = "rgba(12, 13, 15, 0.28)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
