import type { NodeId, Station, WorldEdge, WorldNode } from "./types";

export const MINUTES_PER_REAL_SEC = 1.6;
export const CAR_SPEED_MPH = 22;

export const NODES: WorldNode[] = [
  { id: "A1", x: 0.185, y: 0.295, kind: "intersection" },
  { id: "A2", x: 0.398, y: 0.295, kind: "station", label: "Northside" },
  { id: "A3", x: 0.612, y: 0.295, kind: "stop" },
  { id: "A4", x: 0.825, y: 0.295, kind: "stop" },
  { id: "B1", x: 0.185, y: 0.52, kind: "depot", label: "Yard 7" },
  { id: "B2", x: 0.398, y: 0.52, kind: "intersection" },
  { id: "B3", x: 0.612, y: 0.52, kind: "intersection" },
  { id: "B4", x: 0.825, y: 0.52, kind: "station", label: "Riverside" },
  { id: "C1", x: 0.185, y: 0.745, kind: "intersection" },
  { id: "C2", x: 0.398, y: 0.745, kind: "station", label: "South Lot" },
  { id: "C3", x: 0.612, y: 0.745, kind: "stop" },
  { id: "C4", x: 0.825, y: 0.745, kind: "stop" },
];

const COL_MILES = 2.05;
const ROW_MILES = 1.65;

function gridEdge(a: NodeId, b: NodeId, miles: number): WorldEdge {
  return { a, b, miles };
}

export const EDGES: WorldEdge[] = [
  gridEdge("A1", "A2", COL_MILES),
  gridEdge("A2", "A3", COL_MILES),
  gridEdge("A3", "A4", COL_MILES),
  gridEdge("B1", "B2", COL_MILES),
  gridEdge("B2", "B3", COL_MILES),
  gridEdge("B3", "B4", COL_MILES),
  gridEdge("C1", "C2", COL_MILES),
  gridEdge("C2", "C3", COL_MILES),
  gridEdge("C3", "C4", COL_MILES),
  gridEdge("A1", "B1", ROW_MILES),
  gridEdge("A2", "B2", ROW_MILES),
  gridEdge("A3", "B3", ROW_MILES),
  gridEdge("A4", "B4", ROW_MILES),
  gridEdge("B1", "C1", ROW_MILES),
  gridEdge("B2", "C2", ROW_MILES),
  gridEdge("B3", "C3", ROW_MILES),
  gridEdge("B4", "C4", ROW_MILES),
];

export const STATIONS: Station[] = [
  {
    id: "northside",
    name: "Northside Fuel",
    short: "Northside",
    node: "A2",
    propX: 0.48,
    propY: 0.155,
    propScale: 0.11,
  },
  {
    id: "riverside",
    name: "Riverside Fuel",
    short: "Riverside",
    node: "B4",
    propX: 0.888,
    propY: 0.505,
    propScale: 0.1,
  },
  {
    id: "southside",
    name: "South Lot Pumps",
    short: "South Lot",
    node: "C2",
    propX: 0.5,
    propY: 0.9,
    propScale: 0.1,
  },
];

export const DEPOT_PROP = { x: 0.115, y: 0.5, scale: 0.13 };

const nodeMap = new Map(NODES.map((n) => [n.id, n]));
const adj = new Map<NodeId, { to: NodeId; miles: number }[]>();

for (const e of EDGES) {
  if (!adj.has(e.a)) adj.set(e.a, []);
  if (!adj.has(e.b)) adj.set(e.b, []);
  adj.get(e.a)!.push({ to: e.b, miles: e.miles });
  adj.get(e.b)!.push({ to: e.a, miles: e.miles });
}

export function getNode(id: NodeId): WorldNode {
  const n = nodeMap.get(id);
  if (!n) throw new Error(`Unknown node ${id}`);
  return n;
}

export function getStation(id: string): Station {
  const s = STATIONS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown station ${id}`);
  return s;
}

export function shortestPath(from: NodeId, to: NodeId): NodeId[] {
  if (from === to) return [from];
  const prev = new Map<NodeId, NodeId | null>();
  const q: NodeId[] = [from];
  prev.set(from, null);
  while (q.length) {
    const cur = q.shift()!;
    if (cur === to) break;
    for (const { to: nxt } of adj.get(cur) ?? []) {
      if (prev.has(nxt)) continue;
      prev.set(nxt, cur);
      q.push(nxt);
    }
  }
  if (!prev.has(to)) throw new Error(`No path ${from} → ${to}`);
  const path: NodeId[] = [];
  let c: NodeId | null = to;
  while (c) {
    path.push(c);
    c = prev.get(c) ?? null;
  }
  path.reverse();
  return path;
}

export function pathMiles(path: NodeId[]): number {
  let miles = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = (adj.get(path[i]) ?? []).find((x) => x.to === path[i + 1]);
    if (!edge) throw new Error(`No edge ${path[i]}-${path[i + 1]}`);
    miles += edge.miles;
  }
  return miles;
}

export function pointAlongPath(
  path: NodeId[],
  miles: number,
): { x: number; y: number; heading: number } {
  if (path.length === 1) {
    const n = getNode(path[0]);
    return { x: n.x, y: n.y, heading: 0 };
  }
  let remaining = Math.max(0, miles);
  for (let i = 0; i < path.length - 1; i++) {
    const a = getNode(path[i]);
    const b = getNode(path[i + 1]);
    const edge = (adj.get(a.id) ?? []).find((x) => x.to === b.id)!;
    if (remaining <= edge.miles || i === path.length - 2) {
      const t = edge.miles <= 0 ? 1 : Math.min(1, remaining / edge.miles);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      return {
        x: a.x + dx * t,
        y: a.y + dy * t,
        heading: Math.atan2(dx, -dy),
      };
    }
    remaining -= edge.miles;
  }
  const last = getNode(path[path.length - 1]);
  return { x: last.x, y: last.y, heading: 0 };
}

export function formatClock(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60) % 24;
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function formatMiles(n: number): string {
  return `${n.toFixed(1)} mi`;
}
