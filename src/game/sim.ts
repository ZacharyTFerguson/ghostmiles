import type {
  CarDef,
  CaseDef,
  CompiledCar,
  CompiledCard,
  CompiledCase,
  DwellSegment,
  Segment,
} from "./types";
import {
  CAR_SPEED_MPH,
  getNode,
  getStation,
  pathMiles,
  pointAlongPath,
  shortestPath,
} from "./world";

export function buildSchedule(car: CarDef, startMin: number): Segment[] {
  const segs: Segment[] = [];
  if (car.jobs.length === 0) return segs;
  let t = startMin;
  let pos = car.jobs[0].node;
  const mph = car.speedMph || CAR_SPEED_MPH;
  const milesPerMin = mph / 60;

  for (const job of car.jobs) {
    if (job.node !== pos) {
      const path = shortestPath(pos, job.node);
      const miles = pathMiles(path);
      const dur = milesPerMin > 0 ? miles / milesPerMin : 0;
      segs.push({ type: "drive", t0: t, t1: t + dur, path, miles });
      t += dur;
      pos = job.node;
    }
    if (job.dwellMin > 0) {
      segs.push({
        type: "dwell",
        t0: t,
        t1: t + job.dwellMin,
        node: pos,
        kind: job.kind,
      });
      t += job.dwellMin;
    }
  }
  return segs;
}

export function compileCase(def: CaseDef): CompiledCase {
  const cars: CompiledCar[] = def.cars.map((car) => ({
    ...car,
    schedule: buildSchedule(car, def.startMin),
  }));

  const cards: CompiledCard[] = def.cards.map((card) => {
    const station = getStation(card.stationId);
    let timeMin = card.timeMin;
    if (timeMin == null) {
      if (card.answer === "FRAUD") {
        throw new Error(`Fraud card ${card.id} needs an explicit time`);
      }
      const car = cars.find((c) => c.id === card.answer);
      if (!car) throw new Error(`No car ${card.answer} for card ${card.id}`);
      const dwell = car.schedule.find(
        (s): s is DwellSegment =>
          s.type === "dwell" && s.node === station.node && s.kind === "fuel",
      );
      if (!dwell) {
        throw new Error(`No fuel dwell for ${car.id} at ${station.node}`);
      }
      timeMin = (dwell.t0 + dwell.t1) / 2;
    }
    return { ...card, timeMin, stationName: station.name };
  });

  return { def, cars, cards };
}

export function segmentAt(schedule: Segment[], t: number): Segment | null {
  if (schedule.length === 0) return null;
  if (t <= schedule[0].t0) return schedule[0];
  for (const s of schedule) {
    if (t >= s.t0 && t <= s.t1) return s;
  }
  return schedule[schedule.length - 1];
}

function lastHeading(schedule: Segment[], before: number): number {
  for (let i = schedule.length - 1; i >= 0; i--) {
    const s = schedule[i];
    if (s.type === "drive" && s.t1 <= before + 0.001) {
      return pointAlongPath(s.path, s.miles).heading;
    }
  }
  return 0;
}

export type CarPose = {
  x: number;
  y: number;
  heading: number;
  moving: boolean;
  fueling: boolean;
  nodeId?: string;
};

export function poseAt(car: CompiledCar, t: number): CarPose {
  const segs = car.schedule;
  if (segs.length === 0) {
    const n = getNode(car.jobs[0]?.node ?? "B1");
    return { x: n.x, y: n.y, heading: 0, moving: false, fueling: false, nodeId: n.id };
  }
  if (t <= segs[0].t0) {
    const first = segs[0];
    if (first.type === "dwell") {
      const n = getNode(first.node);
      return {
        x: n.x,
        y: n.y,
        heading: lastHeading(segs, first.t0),
        moving: false,
        fueling: first.kind === "fuel",
        nodeId: n.id,
      };
    }
    const n = getNode(first.path[0]);
    return { x: n.x, y: n.y, heading: 0, moving: false, fueling: false, nodeId: n.id };
  }
  const last = segs[segs.length - 1];
  if (t >= last.t1) {
    if (last.type === "dwell") {
      const n = getNode(last.node);
      return {
        x: n.x,
        y: n.y,
        heading: lastHeading(segs, last.t0),
        moving: false,
        fueling: false,
        nodeId: n.id,
      };
    }
    const n = getNode(last.path[last.path.length - 1]);
    return { x: n.x, y: n.y, heading: 0, moving: false, fueling: false, nodeId: n.id };
  }

  const seg = segmentAt(segs, t);
  if (!seg) {
    const n = getNode(car.jobs[0].node);
    return { x: n.x, y: n.y, heading: 0, moving: false, fueling: false };
  }
  if (seg.type === "dwell") {
    const n = getNode(seg.node);
    return {
      x: n.x,
      y: n.y,
      heading: lastHeading(segs, seg.t0),
      moving: false,
      fueling: seg.kind === "fuel" && t >= seg.t0 && t <= seg.t1,
      nodeId: n.id,
    };
  }
  const span = Math.max(0.0001, seg.t1 - seg.t0);
  const u = (t - seg.t0) / span;
  const along = pointAlongPath(seg.path, seg.miles * u);
  return { ...along, moving: true, fueling: false };
}

export function milesInRange(car: CompiledCar, t0: number, t1: number): number {
  const a = Math.min(t0, t1);
  const b = Math.max(t0, t1);
  let miles = 0;
  for (const s of car.schedule) {
    if (s.type !== "drive") continue;
    const lo = Math.max(s.t0, a);
    const hi = Math.min(s.t1, b);
    if (hi <= lo) continue;
    const span = s.t1 - s.t0;
    miles += span <= 0 ? 0 : s.miles * ((hi - lo) / span);
  }
  return miles;
}

export function fuelingCarAt(
  cars: CompiledCar[],
  stationNode: string,
  t: number,
): CompiledCar | null {
  for (const car of cars) {
    const pose = poseAt(car, t);
    if (pose.fueling && pose.nodeId === stationNode) return car;
  }
  return null;
}

export type VanAtStation = {
  carId: string;
  callsign: string;
  color: string;
  fueling: boolean;
};

/** Map-verify helper: fleet vans at a station node at time t (visible on map; not puzzle answers). */
export function vansAtStationAtTime(
  cars: CompiledCar[],
  stationNode: string,
  t: number,
): VanAtStation[] {
  return cars
    .filter((car) => {
      const pose = poseAt(car, t);
      return !pose.moving && pose.nodeId === stationNode;
    })
    .map((car) => {
      const pose = poseAt(car, t);
      return {
        carId: car.id,
        callsign: car.callsign,
        color: car.color,
        fueling: pose.fueling,
      };
    });
}


