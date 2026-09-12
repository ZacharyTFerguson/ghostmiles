export type NodeId = string;
export type CarId = string;
export type CardId = string;
export type StationId = string;
export type AssignmentTarget = CarId | "FRAUD";

export type NodeKind = "intersection" | "station" | "depot" | "stop";
export type JobKind = "depot" | "fuel" | "delivery" | "idle";

export type WorldNode = {
  id: NodeId;
  x: number;
  y: number;
  kind: NodeKind;
  label?: string;
};

export type WorldEdge = {
  a: NodeId;
  b: NodeId;
  miles: number;
};

export type Station = {
  id: StationId;
  name: string;
  short: string;
  node: NodeId;
  propX: number;
  propY: number;
  propScale: number;
};

export type Job = {
  node: NodeId;
  dwellMin: number;
  kind: JobKind;
};

export type CarDef = {
  id: CarId;
  callsign: string;
  color: string;
  speedMph: number;
  jobs: Job[];
};

export type CardDef = {
  id: CardId;
  cardNumber: string;
  gallons: number;
  dollars: number;
  stationId: StationId;
  /** Correct assignment. FRAUD means no fleet van was at the pumps. */
  answer: AssignmentTarget;
  /** If set, used as swipe time. Otherwise midpoint of that car's fuel dwell at the station. */
  timeMin?: number;
};

export type CaseDef = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  briefing: string[];
  startMin: number;
  endMin: number;
  cars: CarDef[];
  cards: CardDef[];
  allowFraud: boolean;
  gpsHint?: string;
  debrief: string[];
};

export type DriveSegment = {
  type: "drive";
  t0: number;
  t1: number;
  path: NodeId[];
  miles: number;
};

export type DwellSegment = {
  type: "dwell";
  t0: number;
  t1: number;
  node: NodeId;
  kind: JobKind;
};

export type Segment = DriveSegment | DwellSegment;

export type CompiledCar = CarDef & {
  schedule: Segment[];
};

export type CompiledCard = CardDef & {
  timeMin: number;
  stationName: string;
};

export type CompiledCase = {
  def: CaseDef;
  cars: CompiledCar[];
  cards: CompiledCard[];
};

export type Screen = "title" | "brief" | "play" | "debrief";

export type GpsRow = {
  carId: CarId;
  callsign: string;
  miles: number;
};

export type GpsQuery = {
  t0: number;
  t1: number;
  rows: GpsRow[];
};
