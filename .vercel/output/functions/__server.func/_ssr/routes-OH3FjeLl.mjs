import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SkipBack, c as Pause, d as Check, f as Ban, i as Terminal, l as Fuel, n as Volume2, o as RotateCcw, s as Play, t as VolumeX, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-OH3FjeLl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var master = null;
var muted = false;
function getCtx() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: "interactive" });
		master = ctx.createGain();
		master.gain.value = .22;
		master.connect(ctx.destination);
	}
	return ctx;
}
function unlockAudio() {
	const c = getCtx();
	if (!c) return;
	if (c.state === "suspended") c.resume();
}
function setMuted(next) {
	muted = next;
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .22, ctx.currentTime, .02);
}
function beep(freq, dur, type, gain = .12) {
	const c = getCtx();
	if (!c || !master || muted) return;
	if (c.state === "suspended") return;
	const osc = c.createOscillator();
	const g = c.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	g.gain.setValueAtTime(1e-4, c.currentTime);
	g.gain.exponentialRampToValueAtTime(gain, c.currentTime + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + dur);
	osc.connect(g);
	g.connect(master);
	osc.start();
	osc.stop(c.currentTime + dur + .02);
	osc.onended = () => {
		osc.disconnect();
		g.disconnect();
	};
}
function sfxClick() {
	beep(420, .06, "square", .05);
}
function sfxAssign() {
	beep(520, .08, "triangle", .08);
	setTimeout(() => beep(780, .1, "triangle", .06), 70);
}
function sfxError() {
	beep(180, .16, "sawtooth", .07);
	setTimeout(() => beep(140, .18, "sawtooth", .06), 90);
}
function sfxSuccess() {
	beep(523, .12, "triangle", .08);
	setTimeout(() => beep(659, .12, "triangle", .07), 110);
	setTimeout(() => beep(784, .18, "triangle", .07), 220);
}
function sfxWhoosh() {
	beep(240, .09, "sine", .04);
}
var MINUTES_PER_REAL_SEC = 1.6;
var NODES = [
	{
		id: "A1",
		x: .185,
		y: .295,
		kind: "intersection"
	},
	{
		id: "A2",
		x: .398,
		y: .295,
		kind: "station",
		label: "Northside"
	},
	{
		id: "A3",
		x: .612,
		y: .295,
		kind: "stop"
	},
	{
		id: "A4",
		x: .825,
		y: .295,
		kind: "stop"
	},
	{
		id: "B1",
		x: .185,
		y: .52,
		kind: "depot",
		label: "Yard 7"
	},
	{
		id: "B2",
		x: .398,
		y: .52,
		kind: "intersection"
	},
	{
		id: "B3",
		x: .612,
		y: .52,
		kind: "intersection"
	},
	{
		id: "B4",
		x: .825,
		y: .52,
		kind: "station",
		label: "Riverside"
	},
	{
		id: "C1",
		x: .185,
		y: .745,
		kind: "intersection"
	},
	{
		id: "C2",
		x: .398,
		y: .745,
		kind: "station",
		label: "South Lot"
	},
	{
		id: "C3",
		x: .612,
		y: .745,
		kind: "stop"
	},
	{
		id: "C4",
		x: .825,
		y: .745,
		kind: "stop"
	}
];
var COL_MILES = 2.05;
var ROW_MILES = 1.65;
function gridEdge(a, b, miles) {
	return {
		a,
		b,
		miles
	};
}
var EDGES = [
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
	gridEdge("B4", "C4", ROW_MILES)
];
var STATIONS = [
	{
		id: "northside",
		name: "Northside Fuel",
		short: "Northside",
		node: "A2",
		propX: .48,
		propY: .155,
		propScale: .11
	},
	{
		id: "riverside",
		name: "Riverside Fuel",
		short: "Riverside",
		node: "B4",
		propX: .888,
		propY: .505,
		propScale: .1
	},
	{
		id: "southside",
		name: "South Lot Pumps",
		short: "South Lot",
		node: "C2",
		propX: .5,
		propY: .9,
		propScale: .1
	}
];
var DEPOT_PROP = {
	x: .115,
	y: .5,
	scale: .13
};
var nodeMap = new Map(NODES.map((n) => [n.id, n]));
var adj = /* @__PURE__ */ new Map();
for (const e of EDGES) {
	if (!adj.has(e.a)) adj.set(e.a, []);
	if (!adj.has(e.b)) adj.set(e.b, []);
	adj.get(e.a).push({
		to: e.b,
		miles: e.miles
	});
	adj.get(e.b).push({
		to: e.a,
		miles: e.miles
	});
}
function getNode(id) {
	const n = nodeMap.get(id);
	if (!n) throw new Error(`Unknown node ${id}`);
	return n;
}
function getStation(id) {
	const s = STATIONS.find((x) => x.id === id);
	if (!s) throw new Error(`Unknown station ${id}`);
	return s;
}
function shortestPath(from, to) {
	if (from === to) return [from];
	const prev = /* @__PURE__ */ new Map();
	const q = [from];
	prev.set(from, null);
	while (q.length) {
		const cur = q.shift();
		if (cur === to) break;
		for (const { to: nxt } of adj.get(cur) ?? []) {
			if (prev.has(nxt)) continue;
			prev.set(nxt, cur);
			q.push(nxt);
		}
	}
	if (!prev.has(to)) throw new Error(`No path ${from} → ${to}`);
	const path = [];
	let c = to;
	while (c) {
		path.push(c);
		c = prev.get(c) ?? null;
	}
	path.reverse();
	return path;
}
function pathMiles(path) {
	let miles = 0;
	for (let i = 0; i < path.length - 1; i++) {
		const edge = (adj.get(path[i]) ?? []).find((x) => x.to === path[i + 1]);
		if (!edge) throw new Error(`No edge ${path[i]}-${path[i + 1]}`);
		miles += edge.miles;
	}
	return miles;
}
function pointAlongPath(path, miles) {
	if (path.length === 1) {
		const n = getNode(path[0]);
		return {
			x: n.x,
			y: n.y,
			heading: 0
		};
	}
	let remaining = Math.max(0, miles);
	for (let i = 0; i < path.length - 1; i++) {
		const a = getNode(path[i]);
		const b = getNode(path[i + 1]);
		const edge = (adj.get(a.id) ?? []).find((x) => x.to === b.id);
		if (remaining <= edge.miles || i === path.length - 2) {
			const t = edge.miles <= 0 ? 1 : Math.min(1, remaining / edge.miles);
			const dx = b.x - a.x;
			const dy = b.y - a.y;
			return {
				x: a.x + dx * t,
				y: a.y + dy * t,
				heading: Math.atan2(dx, -dy)
			};
		}
		remaining -= edge.miles;
	}
	const last = getNode(path[path.length - 1]);
	return {
		x: last.x,
		y: last.y,
		heading: 0
	};
}
function formatClock(min) {
	const m = Math.max(0, Math.round(min));
	const h = Math.floor(m / 60) % 24;
	const mm = m % 60;
	return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function formatMiles(n) {
	return `${n.toFixed(1)} mi`;
}
var SPEED = 22;
function car(id, callsign, color, jobs) {
	return {
		id,
		callsign,
		color,
		speedMph: SPEED,
		jobs
	};
}
var CASES = [
	{
		id: "first-shift",
		number: "01",
		title: "First Shift",
		subtitle: "Three vans. Three swipes. Watch the lot.",
		briefing: [
			"Yard 7 runs a closed fleet. Every gallon is supposed to sit on a company card, and every card is supposed to sit in a company van.",
			"Milelog, the GPS box, does not keep an odometer. It will not tell you total miles. Ask it a window — one time to another — and it will answer how far a van moved in that window. That is all it will answer.",
			"Open a fuel block. The map jumps to the swipe. See which van is sitting on the pumps. Drop the block on that van."
		],
		startMin: 480,
		endMin: 680,
		allowFraud: false,
		cars: [
			car("alpha", "ALPHA", "#6d8aa8", [
				{
					node: "B1",
					dwellMin: 0,
					kind: "depot"
				},
				{
					node: "A2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "A4",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 20,
					kind: "depot"
				}
			]),
			car("bravo", "BRAVO", "#b56858", [
				{
					node: "B1",
					dwellMin: 16,
					kind: "idle"
				},
				{
					node: "B4",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C4",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 16,
					kind: "depot"
				}
			]),
			car("charlie", "CHARLIE", "#7a8a62", [
				{
					node: "B1",
					dwellMin: 34,
					kind: "idle"
				},
				{
					node: "C2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C3",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 16,
					kind: "depot"
				}
			])
		],
		cards: [
			{
				id: "c1a",
				cardNumber: "4412",
				gallons: 18.4,
				dollars: 68.9,
				stationId: "northside",
				answer: "alpha"
			},
			{
				id: "c1b",
				cardNumber: "4418",
				gallons: 16.1,
				dollars: 60.2,
				stationId: "riverside",
				answer: "bravo"
			},
			{
				id: "c1c",
				cardNumber: "4420",
				gallons: 19,
				dollars: 71.1,
				stationId: "southside",
				answer: "charlie"
			}
		],
		debrief: ["ALPHA took Northside. BRAVO took Riverside. CHARLIE took the South Lot. The ledger matches the map.", "Remember the trick: the box never stores a running odometer. If you need miles, you have to ask for a window."]
	},
	{
		id: "same-pumps",
		number: "02",
		title: "Same Pumps",
		subtitle: "Northside gets two visits. The clock is the tell.",
		briefing: ["Northside Fuel logged two company swipes. Two different vans used those pumps — hours apart.", "Do not assign a station to the first van you remember. Open each block. Ride the clock. The van that is sitting there at the swipe is the van that bought the fuel."],
		startMin: 480,
		endMin: 750,
		allowFraud: false,
		cars: [
			car("alpha", "ALPHA", "#6d8aa8", [
				{
					node: "B1",
					dwellMin: 0,
					kind: "depot"
				},
				{
					node: "A2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "A4",
					dwellMin: 10,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 40,
					kind: "depot"
				}
			]),
			car("bravo", "BRAVO", "#b56858", [
				{
					node: "B1",
					dwellMin: 12,
					kind: "idle"
				},
				{
					node: "B4",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C4",
					dwellMin: 9,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 30,
					kind: "depot"
				}
			]),
			car("charlie", "CHARLIE", "#7a8a62", [
				{
					node: "B1",
					dwellMin: 70,
					kind: "idle"
				},
				{
					node: "A2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "A3",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 20,
					kind: "depot"
				}
			]),
			car("delta", "DELTA", "#c4b496", [
				{
					node: "B1",
					dwellMin: 28,
					kind: "idle"
				},
				{
					node: "C2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C1",
					dwellMin: 7,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 20,
					kind: "depot"
				}
			])
		],
		cards: [
			{
				id: "c2a",
				cardNumber: "5510",
				gallons: 17.2,
				dollars: 64.4,
				stationId: "northside",
				answer: "alpha"
			},
			{
				id: "c2b",
				cardNumber: "5514",
				gallons: 15.8,
				dollars: 59.1,
				stationId: "riverside",
				answer: "bravo"
			},
			{
				id: "c2c",
				cardNumber: "5521",
				gallons: 20.4,
				dollars: 76.3,
				stationId: "southside",
				answer: "delta"
			},
			{
				id: "c2d",
				cardNumber: "5528",
				gallons: 16.6,
				dollars: 62,
				stationId: "northside",
				answer: "charlie"
			}
		],
		debrief: ["ALPHA hit Northside on the morning pull. CHARLIE came back to the same canopy after ten.", "Same pumps. Different clock. The block only matches a van at a point in time."]
	},
	{
		id: "zero-miles",
		number: "03",
		title: "Zero Miles",
		subtitle: "Two vans crossed Riverside. Only one stopped.",
		briefing: [
			"Riverside logged a swipe just after ten. ALPHA and BRAVO both ran that east road around the same minutes.",
			"A van that is pumping reads zero miles in a tight window. A van that is only passing through still moves.",
			"Ask Milelog for 10:16 to 10:26 on each unit. The stopped van is the buyer."
		],
		startMin: 600,
		endMin: 740,
		allowFraud: false,
		gpsHint: "Query 10:16–10:26. A fueling van reads 0.0 mi.",
		cars: [
			car("alpha", "ALPHA", "#6d8aa8", [
				{
					node: "B1",
					dwellMin: 0,
					kind: "depot"
				},
				{
					node: "B4",
					dwellMin: 8,
					kind: "fuel"
				},
				{
					node: "A4",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 20,
					kind: "depot"
				}
			]),
			car("bravo", "BRAVO", "#b56858", [
				{
					node: "A4",
					dwellMin: 14,
					kind: "idle"
				},
				{
					node: "B4",
					dwellMin: 0,
					kind: "delivery"
				},
				{
					node: "C4",
					dwellMin: 9,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 16,
					kind: "depot"
				}
			]),
			car("charlie", "CHARLIE", "#7a8a62", [
				{
					node: "B1",
					dwellMin: 6,
					kind: "idle"
				},
				{
					node: "C2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C3",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 16,
					kind: "depot"
				}
			]),
			car("delta", "DELTA", "#c4b496", [
				{
					node: "B1",
					dwellMin: 18,
					kind: "idle"
				},
				{
					node: "A2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "A1",
					dwellMin: 7,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 16,
					kind: "depot"
				}
			])
		],
		cards: [
			{
				id: "c3a",
				cardNumber: "6602",
				gallons: 18.9,
				dollars: 70.7,
				stationId: "riverside",
				answer: "alpha"
			},
			{
				id: "c3b",
				cardNumber: "6608",
				gallons: 17.4,
				dollars: 65.1,
				stationId: "southside",
				answer: "charlie"
			},
			{
				id: "c3c",
				cardNumber: "6611",
				gallons: 15.2,
				dollars: 56.9,
				stationId: "northside",
				answer: "delta"
			}
		],
		debrief: ["BRAVO rolled through Riverside without taking a drop. ALPHA sat on the pad — Milelog reads 0.0 in that window.", "Passing a canopy is not buying fuel. The GPS range is how you prove a stop."]
	},
	{
		id: "extra-swipe",
		number: "04",
		title: "The Extra Swipe",
		subtitle: "One charge has no van under it.",
		briefing: ["Accounts found a fifth swipe the yard did not authorize. Four of these blocks belong to fleet units. One does not.", "If you open a block and the pumps are empty, that card was never in a Yard 7 van. Drop it on NOT ON THE MAP."],
		startMin: 510,
		endMin: 800,
		allowFraud: true,
		cars: [
			car("alpha", "ALPHA", "#6d8aa8", [
				{
					node: "B1",
					dwellMin: 0,
					kind: "depot"
				},
				{
					node: "A2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "A4",
					dwellMin: 9,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 50,
					kind: "depot"
				}
			]),
			car("bravo", "BRAVO", "#b56858", [
				{
					node: "B1",
					dwellMin: 14,
					kind: "idle"
				},
				{
					node: "B4",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C4",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 40,
					kind: "depot"
				}
			]),
			car("charlie", "CHARLIE", "#7a8a62", [
				{
					node: "B1",
					dwellMin: 32,
					kind: "idle"
				},
				{
					node: "C2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C3",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 30,
					kind: "depot"
				}
			]),
			car("delta", "DELTA", "#c4b496", [
				{
					node: "B1",
					dwellMin: 55,
					kind: "idle"
				},
				{
					node: "A3",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "A2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "B1",
					dwellMin: 20,
					kind: "depot"
				}
			])
		],
		cards: [
			{
				id: "c4a",
				cardNumber: "7701",
				gallons: 16.8,
				dollars: 62.8,
				stationId: "northside",
				answer: "alpha"
			},
			{
				id: "c4b",
				cardNumber: "7704",
				gallons: 18.1,
				dollars: 67.7,
				stationId: "riverside",
				answer: "bravo"
			},
			{
				id: "c4c",
				cardNumber: "7709",
				gallons: 19.6,
				dollars: 73.3,
				stationId: "southside",
				answer: "charlie"
			},
			{
				id: "c4d",
				cardNumber: "7716",
				gallons: 14.9,
				dollars: 55.7,
				stationId: "northside",
				answer: "delta"
			},
			{
				id: "c4e",
				cardNumber: "0900",
				gallons: 22.4,
				dollars: 83.9,
				stationId: "southside",
				answer: "FRAUD",
				timeMin: 766
			}
		],
		debrief: ["Card 0900 swiped South Lot at 12:46. No Yard 7 van was on those pumps. The other four blocks close clean.", "Someone is buying diesel on a card that does not live in this fleet."]
	},
	{
		id: "card-7781",
		number: "05",
		title: "Card 7781",
		subtitle: "One card. Two canopies. Same minute.",
		briefing: [
			"DELTA's card, 7781, posted twice. Once at Northside, once at Riverside, overlapping by the clock.",
			"A van cannot sit on two pads. Ask Milelog for DELTA between 14:00 and 14:10. If the range is zero, DELTA was stopped — and the other swipe is a clone.",
			"Assign the true stop to DELTA. Drop the impossible swipe on NOT ON THE MAP."
		],
		startMin: 820,
		endMin: 970,
		allowFraud: true,
		gpsHint: "Query DELTA 14:00–14:10. Zero miles means the Northside stop is real.",
		cars: [
			car("alpha", "ALPHA", "#6d8aa8", [
				{
					node: "B1",
					dwellMin: 0,
					kind: "depot"
				},
				{
					node: "C2",
					dwellMin: 6,
					kind: "fuel"
				},
				{
					node: "C4",
					dwellMin: 9,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 20,
					kind: "depot"
				}
			]),
			car("bravo", "BRAVO", "#b56858", [
				{
					node: "B1",
					dwellMin: 10,
					kind: "idle"
				},
				{
					node: "B3",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B4",
					dwellMin: 0,
					kind: "delivery"
				},
				{
					node: "A4",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 16,
					kind: "depot"
				}
			]),
			car("charlie", "CHARLIE", "#7a8a62", [
				{
					node: "B1",
					dwellMin: 22,
					kind: "idle"
				},
				{
					node: "C3",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "C1",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 16,
					kind: "depot"
				}
			]),
			car("delta", "DELTA", "#c4b496", [
				{
					node: "B1",
					dwellMin: 8,
					kind: "idle"
				},
				{
					node: "A2",
					dwellMin: 10,
					kind: "fuel"
				},
				{
					node: "A1",
					dwellMin: 8,
					kind: "delivery"
				},
				{
					node: "B1",
					dwellMin: 20,
					kind: "depot"
				}
			])
		],
		cards: [
			{
				id: "c5a",
				cardNumber: "4412",
				gallons: 17.7,
				dollars: 66.2,
				stationId: "southside",
				answer: "alpha"
			},
			{
				id: "c5b",
				cardNumber: "7781",
				gallons: 18.6,
				dollars: 69.6,
				stationId: "northside",
				answer: "delta"
			},
			{
				id: "c5c",
				cardNumber: "7781",
				gallons: 24.8,
				dollars: 92.8,
				stationId: "riverside",
				answer: "FRAUD",
				timeMin: 844
			}
		],
		debrief: ["DELTA was dead still at Northside. Milelog says so. Card 7781 also posted at Riverside in the same minutes — a cloned stripe, not a second van.", "The yard can lock 7781. The clone is the leak. That is the bad history: a card that moves farther than the van it belongs to."]
	}
];
var KEY = "ghost-miles-save-v1";
var SAVE_VERSION = 1;
var defaults = {
	version: SAVE_VERSION,
	completed: [],
	muted: false
};
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return {
			...defaults,
			completed: []
		};
		const parsed = JSON.parse(raw);
		return {
			version: SAVE_VERSION,
			completed: Array.isArray(parsed.completed) ? parsed.completed.filter((x) => typeof x === "string") : [],
			muted: Boolean(parsed.muted)
		};
	} catch {
		return {
			...defaults,
			completed: []
		};
	}
}
function writeSave(data) {
	try {
		localStorage.setItem(KEY, JSON.stringify({
			...data,
			version: SAVE_VERSION
		}));
	} catch {}
}
function markCompleted(id) {
	const s = loadSave();
	if (!s.completed.includes(id)) s.completed.push(id);
	writeSave(s);
	return s;
}
function buildSchedule(car, startMin) {
	const segs = [];
	if (car.jobs.length === 0) return segs;
	let t = startMin;
	let pos = car.jobs[0].node;
	const milesPerMin = (car.speedMph || 22) / 60;
	for (const job of car.jobs) {
		if (job.node !== pos) {
			const path = shortestPath(pos, job.node);
			const miles = pathMiles(path);
			const dur = milesPerMin > 0 ? miles / milesPerMin : 0;
			segs.push({
				type: "drive",
				t0: t,
				t1: t + dur,
				path,
				miles
			});
			t += dur;
			pos = job.node;
		}
		if (job.dwellMin > 0) {
			segs.push({
				type: "dwell",
				t0: t,
				t1: t + job.dwellMin,
				node: pos,
				kind: job.kind
			});
			t += job.dwellMin;
		}
	}
	return segs;
}
function compileCase(def) {
	const cars = def.cars.map((car) => ({
		...car,
		schedule: buildSchedule(car, def.startMin)
	}));
	return {
		def,
		cars,
		cards: def.cards.map((card) => {
			const station = getStation(card.stationId);
			let timeMin = card.timeMin;
			if (timeMin == null) {
				if (card.answer === "FRAUD") throw new Error(`Fraud card ${card.id} needs an explicit time`);
				const car = cars.find((c) => c.id === card.answer);
				if (!car) throw new Error(`No car ${card.answer} for card ${card.id}`);
				const dwell = car.schedule.find((s) => s.type === "dwell" && s.node === station.node && s.kind === "fuel");
				if (!dwell) throw new Error(`No fuel dwell for ${car.id} at ${station.node}`);
				timeMin = (dwell.t0 + dwell.t1) / 2;
			}
			return {
				...card,
				timeMin,
				stationName: station.name
			};
		})
	};
}
function segmentAt(schedule, t) {
	if (schedule.length === 0) return null;
	if (t <= schedule[0].t0) return schedule[0];
	for (const s of schedule) if (t >= s.t0 && t <= s.t1) return s;
	return schedule[schedule.length - 1];
}
function lastHeading(schedule, before) {
	for (let i = schedule.length - 1; i >= 0; i--) {
		const s = schedule[i];
		if (s.type === "drive" && s.t1 <= before + .001) return pointAlongPath(s.path, s.miles).heading;
	}
	return 0;
}
function poseAt(car, t) {
	const segs = car.schedule;
	if (segs.length === 0) {
		const n = getNode(car.jobs[0]?.node ?? "B1");
		return {
			x: n.x,
			y: n.y,
			heading: 0,
			moving: false,
			fueling: false,
			nodeId: n.id
		};
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
				nodeId: n.id
			};
		}
		const n = getNode(first.path[0]);
		return {
			x: n.x,
			y: n.y,
			heading: 0,
			moving: false,
			fueling: false,
			nodeId: n.id
		};
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
				nodeId: n.id
			};
		}
		const n = getNode(last.path[last.path.length - 1]);
		return {
			x: n.x,
			y: n.y,
			heading: 0,
			moving: false,
			fueling: false,
			nodeId: n.id
		};
	}
	const seg = segmentAt(segs, t);
	if (!seg) {
		const n = getNode(car.jobs[0].node);
		return {
			x: n.x,
			y: n.y,
			heading: 0,
			moving: false,
			fueling: false
		};
	}
	if (seg.type === "dwell") {
		const n = getNode(seg.node);
		return {
			x: n.x,
			y: n.y,
			heading: lastHeading(segs, seg.t0),
			moving: false,
			fueling: seg.kind === "fuel" && t >= seg.t0 && t <= seg.t1,
			nodeId: n.id
		};
	}
	const span = Math.max(1e-4, seg.t1 - seg.t0);
	const u = (t - seg.t0) / span;
	return {
		...pointAlongPath(seg.path, seg.miles * u),
		moving: true,
		fueling: false
	};
}
function milesInRange(car, t0, t1) {
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
var SPEEDS = [
	1,
	4,
	12
];
function emptyAssign(compiled) {
	const a = {};
	for (const c of compiled.cards) a[c.id] = null;
	return a;
}
function clampTime(t, compiled) {
	if (!compiled) return t;
	return Math.min(compiled.def.endMin, Math.max(compiled.def.startMin, t));
}
var useGame = create((set, get) => ({
	screen: "title",
	caseIndex: 0,
	compiled: compileCase(CASES[0]),
	time: CASES[0].startMin,
	playing: true,
	speed: 4,
	selectedCardId: null,
	selectedCarId: null,
	assignments: {},
	gpsFrom: null,
	gpsTo: null,
	lastQuery: null,
	shakeIds: [],
	status: null,
	completed: [],
	muted: false,
	wrongCount: 0,
	boot: () => {
		const save = loadSave();
		setMuted(save.muted);
		const compiled = compileCase(CASES[0]);
		set({
			completed: save.completed,
			muted: save.muted,
			compiled,
			time: compiled.def.startMin,
			playing: true,
			screen: "title"
		});
	},
	goTitle: () => {
		const compiled = compileCase(CASES[0]);
		set({
			screen: "title",
			compiled,
			time: compiled.def.startMin,
			playing: true,
			selectedCardId: null,
			selectedCarId: null,
			lastQuery: null,
			status: null,
			shakeIds: []
		});
	},
	openBrief: (index) => {
		unlockAudio();
		sfxClick();
		const compiled = compileCase(CASES[index]);
		set({
			screen: "brief",
			caseIndex: index,
			compiled,
			time: compiled.def.startMin,
			playing: false,
			assignments: emptyAssign(compiled),
			selectedCardId: null,
			selectedCarId: null,
			gpsFrom: compiled.def.startMin,
			gpsTo: compiled.def.startMin + 20,
			lastQuery: null,
			shakeIds: [],
			status: null,
			wrongCount: 0
		});
	},
	startCase: () => {
		unlockAudio();
		sfxClick();
		const { compiled } = get();
		if (!compiled) return;
		set({
			screen: "play",
			time: compiled.def.startMin,
			playing: true,
			speed: 4
		});
	},
	setPlaying: (v) => set({ playing: v }),
	cycleSpeed: () => {
		const { speed } = get();
		const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
		set({
			speed: next,
			playing: true
		});
	},
	setTime: (t) => {
		set({
			time: clampTime(t, get().compiled),
			playing: false
		});
	},
	advance: (dt) => {
		const s = get();
		if (!s.playing || !s.compiled) return;
		const next = s.time + dt * s.speed * MINUTES_PER_REAL_SEC;
		if (s.screen === "title") {
			const span = s.compiled.def.endMin - s.compiled.def.startMin;
			set({ time: s.compiled.def.startMin + ((next - s.compiled.def.startMin) % span + span) % span });
			return;
		}
		if (next >= s.compiled.def.endMin) {
			set({
				time: s.compiled.def.endMin,
				playing: false
			});
			return;
		}
		set({ time: next });
	},
	selectCard: (id) => {
		const { compiled } = get();
		if (!compiled || !id) {
			set({ selectedCardId: id });
			return;
		}
		const card = compiled.cards.find((c) => c.id === id);
		sfxClick();
		set({
			selectedCardId: id,
			time: card ? card.timeMin : get().time,
			playing: false
		});
	},
	selectCar: (id) => set({ selectedCarId: id }),
	assign: (cardId, target) => {
		sfxAssign();
		set((s) => ({
			assignments: {
				...s.assignments,
				[cardId]: target
			},
			selectedCardId: null,
			shakeIds: s.shakeIds.filter((x) => x !== cardId),
			status: null
		}));
	},
	unassign: (cardId) => {
		sfxClick();
		set((s) => ({ assignments: {
			...s.assignments,
			[cardId]: null
		} }));
	},
	markGpsFrom: () => set({ gpsFrom: Math.round(get().time) }),
	markGpsTo: () => set({ gpsTo: Math.round(get().time) }),
	runQuery: (carId) => {
		const { compiled, gpsFrom, gpsTo } = get();
		if (!compiled || gpsFrom == null || gpsTo == null) return;
		sfxWhoosh();
		const t0 = Math.min(gpsFrom, gpsTo);
		const t1 = Math.max(gpsFrom, gpsTo);
		set({ lastQuery: {
			t0,
			t1,
			rows: (carId === "ALL" ? compiled.cars : compiled.cars.filter((c) => c.id === carId)).map((c) => ({
				carId: c.id,
				callsign: c.callsign,
				miles: milesInRange(c, t0, t1)
			}))
		} });
	},
	submit: () => {
		const { compiled, assignments } = get();
		if (!compiled) return;
		const missing = compiled.cards.filter((c) => !assignments[c.id]);
		if (missing.length) {
			sfxError();
			set({
				status: `${missing.length} block${missing.length > 1 ? "s" : ""} still unassigned.`,
				shakeIds: missing.map((c) => c.id)
			});
			return;
		}
		const wrong = compiled.cards.filter((c) => assignments[c.id] !== c.answer);
		if (wrong.length) {
			sfxError();
			set({
				wrongCount: get().wrongCount + 1,
				status: wrong.length === 1 ? "One assignment does not hold. Check the clock." : `${wrong.length} assignments do not hold. Watch the pumps again.`,
				shakeIds: wrong.map((c) => c.id)
			});
			return;
		}
		sfxSuccess();
		set({
			screen: "debrief",
			completed: markCompleted(compiled.def.id).completed,
			playing: false,
			status: null,
			shakeIds: []
		});
	},
	nextCase: () => {
		const { caseIndex } = get();
		if (caseIndex + 1 < CASES.length) get().openBrief(caseIndex + 1);
		else get().goTitle();
	},
	toggleMute: () => {
		const muted = !get().muted;
		setMuted(muted);
		writeSave({
			version: 1,
			completed: get().completed,
			muted
		});
		set({ muted });
	},
	setStatus: (status) => set({ status })
}));
function CardBoard() {
	const compiled = useGame((s) => s.compiled);
	const assignments = useGame((s) => s.assignments);
	const selectedCardId = useGame((s) => s.selectedCardId);
	const shakeIds = useGame((s) => s.shakeIds);
	const status = useGame((s) => s.status);
	const selectCard = useGame((s) => s.selectCard);
	const assign = useGame((s) => s.assign);
	const unassign = useGame((s) => s.unassign);
	const submit = useGame((s) => s.submit);
	const [held, setHeld] = (0, import_react.useState)(null);
	if (!compiled) return null;
	const unassigned = compiled.cards.filter((c) => !assignments[c.id]);
	const target = held ?? selectedCardId;
	function dropOn(slot) {
		const id = held ?? selectedCardId;
		if (!id) return;
		assign(id, slot);
		setHeld(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle",
					children: "Fuel blocks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1",
					children: [unassigned.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FuelBlock, {
						card,
						active: target === card.id,
						shake: shakeIds.includes(card.id),
						onPick: () => {
							setHeld(card.id);
							selectCard(card.id);
						}
					}, card.id)), unassigned.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-fg-subtle",
						children: "All blocks seated. File the dossier."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle",
					children: "Units"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [compiled.cars.map((car) => {
						const seated = compiled.cards.filter((c) => assignments[c.id] === car.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-h-14 items-start gap-3 rounded-md border border-border bg-bg-subtle px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 size-2.5 shrink-0 rounded-full",
								style: { background: car.color }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => dropOn(car.id),
									className: "flex w-full items-baseline justify-between gap-2 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-sm font-semibold tracking-wide",
										children: car.callsign
									}), seated.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-3.5 text-fg-muted",
										strokeWidth: 2
									})]
								}), seated.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => dropOn(car.id),
									className: "mt-0.5 text-left text-xs text-fg-subtle",
									children: "Drop a block"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-1 space-y-1",
									children: seated.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatedChip, {
										card,
										onRemove: () => unassign(card.id)
									}) }, card.id))
								})]
							})]
						}, car.id);
					}), compiled.def.allowFraud && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-14 items-start gap-3 rounded-md border border-dashed border-border-strong bg-bg px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "mt-0.5 size-3.5 text-fg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => dropOn("FRAUD"),
								className: "font-display text-sm font-semibold tracking-wide",
								children: "Not on the map"
							}), compiled.cards.filter((c) => assignments[c.id] === "FRAUD").length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => dropOn("FRAUD"),
								className: "mt-0.5 block text-left text-xs text-fg-subtle",
								children: "No van at the pumps"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-1 space-y-1",
								children: compiled.cards.filter((c) => assignments[c.id] === "FRAUD").map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeatedChip, {
									card,
									onRemove: () => unassign(card.id)
								}) }, card.id))
							})]
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border px-3 py-3",
			children: [status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs text-danger",
				children: status
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-solid w-full",
				onClick: submit,
				children: "File dossier"
			})]
		})]
	});
}
function FuelBlock({ card, active, shake, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onPick,
		className: `rounded-md border px-3 py-2.5 text-left transition-colors ${active ? "border-fg bg-bg-subtle" : "border-border bg-bg-elevated hover:border-border-strong"} ${shake ? "animate-shake" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-sm tabular-nums text-fg",
					children: ["FC-", card.cardNumber]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tabular-nums text-fg-muted",
					children: formatClock(card.timeMin)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-fg-muted",
				children: card.stationName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 font-mono text-[11px] text-fg-subtle",
				children: [
					card.gallons.toFixed(1),
					" gal · $",
					card.dollars.toFixed(2)
				]
			})
		]
	});
}
function SeatedChip({ card, onRemove }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 rounded-sm bg-bg px-2 py-1 font-mono text-[11px] text-fg-muted",
		children: [
			"FC-",
			card.cardNumber,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg-subtle",
				children: formatClock(card.timeMin)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-fg-subtle hover:text-fg",
				onClick: (e) => {
					e.stopPropagation();
					onRemove();
				},
				"aria-label": "Remove",
				children: "×"
			})
		]
	});
}
function GpsTerminal() {
	const compiled = useGame((s) => s.compiled);
	const gpsFrom = useGame((s) => s.gpsFrom);
	const gpsTo = useGame((s) => s.gpsTo);
	const lastQuery = useGame((s) => s.lastQuery);
	const markGpsFrom = useGame((s) => s.markGpsFrom);
	const markGpsTo = useGame((s) => s.markGpsTo);
	const runQuery = useGame((s) => s.runQuery);
	const hint = compiled?.def.gpsHint;
	const [unit, setUnit] = (0, import_react.useState)("ALL");
	if (!compiled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 text-fg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, {
					className: "size-3.5",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-[10px] uppercase tracking-[0.18em]",
					children: "Milelog"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs leading-snug text-fg-subtle",
				children: "No odometer totals. Range query only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn-ghost",
						onClick: markGpsFrom,
						children: ["From ", gpsFrom != null ? formatClock(gpsFrom) : "—"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn-ghost",
						onClick: markGpsTo,
						children: ["To ", gpsTo != null ? formatClock(gpsTo) : "—"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "btn-ghost h-11 appearance-none pr-7",
						value: unit,
						onChange: (e) => setUnit(e.target.value),
						"aria-label": "Unit",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "ALL",
							children: "All units"
						}), compiled.cars.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.callsign
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-solid",
						onClick: () => runQuery(unit === "ALL" ? "ALL" : unit),
						children: "Query"
					})
				]
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-fg-muted",
				children: hint
			}),
			lastQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 text-fg-subtle",
					children: [
						formatClock(lastQuery.t0),
						" → ",
						formatClock(lastQuery.t1)
					]
				}), lastQuery.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between tabular-nums",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.callsign }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatMiles(row.miles) })]
				}, row.carId))]
			})
		]
	});
}
function TopBar() {
	const compiled = useGame((s) => s.compiled);
	const time = useGame((s) => s.time);
	const playing = useGame((s) => s.playing);
	const speed = useGame((s) => s.speed);
	const muted = useGame((s) => s.muted);
	const assigned = useGame((s) => Object.values(s.assignments).filter(Boolean).length);
	const total = compiled?.cards.length ?? 0;
	const goTitle = useGame((s) => s.goTitle);
	const setPlaying = useGame((s) => s.setPlaying);
	const cycleSpeed = useGame((s) => s.cycleSpeed);
	const setTime = useGame((s) => s.setTime);
	const toggleMute = useGame((s) => s.toggleMute);
	if (!compiled) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center gap-3 border-b border-border bg-bg-elevated px-3 py-2 sm:px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: goTitle,
				className: "font-display text-lg font-semibold tracking-display text-fg",
				children: "GHOST MILES"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden text-xs text-fg-subtle sm:inline",
				children: [
					"CASE ",
					compiled.def.number,
					" · ",
					compiled.def.title
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2 sm:gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5 font-mono text-xs text-fg-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fuel, {
								className: "size-3.5",
								strokeWidth: 1.75
							}),
							assigned,
							"/",
							total
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm tabular-nums text-fg",
						children: formatClock(time)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Rewind",
								onClick: () => setTime(compiled.def.startMin),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: playing ? "Pause" : "Play",
								onClick: () => setPlaying(!playing),
								children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: cycleSpeed,
								className: "h-11 min-w-11 rounded-sm px-2 font-mono text-xs text-fg-muted hover:bg-bg-subtle hover:text-fg",
								children: [speed, "x"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: muted ? "Unmute" : "Mute",
								onClick: toggleMute,
								children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
								label: "Reset clock",
								onClick: () => setTime(compiled.def.startMin),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
							})
						]
					})
				]
			})
		]
	});
}
function IconBtn({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "grid size-11 place-items-center rounded-sm text-fg-muted hover:bg-bg-subtle hover:text-fg",
		children
	});
}
function Timeline() {
	const compiled = useGame((s) => s.compiled);
	const time = useGame((s) => s.time);
	const setTime = useGame((s) => s.setTime);
	const selectedCardId = useGame((s) => s.selectedCardId);
	const gpsFrom = useGame((s) => s.gpsFrom);
	const gpsTo = useGame((s) => s.gpsTo);
	if (!compiled) return null;
	const start = compiled.def.startMin;
	const end = compiled.def.endMin;
	const span = Math.max(1, end - start);
	const pct = (time - start) / span * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto rounded-lg border border-border bg-bg-elevated/92 px-3 py-2 shadow-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: start,
					max: end,
					step: .5,
					value: time,
					"aria-label": "Timeline",
					onChange: (e) => setTime(Number(e.target.value)),
					className: "w-full accent-accent"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-1 h-3",
					children: [
						compiled.cards.map((card) => {
							const left = (card.timeMin - start) / span * 100;
							const active = card.id === selectedCardId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								title: `${card.cardNumber} ${formatClock(card.timeMin)}`,
								onClick: () => useGame.getState().selectCard(card.id),
								className: "absolute top-0 size-3 -translate-x-1/2 rounded-full border border-bg-elevated",
								style: {
									left: `${left}%`,
									background: active ? "var(--color-fg)" : "var(--color-accent)"
								}
							}, card.id);
						}),
						gpsFrom != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-0 h-3 w-px bg-fg-muted",
							style: { left: `${(gpsFrom - start) / span * 100}%` }
						}),
						gpsTo != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-0 h-3 w-px bg-fg-muted",
							style: { left: `${(gpsTo - start) / span * 100}%` }
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex justify-between font-mono text-[10px] text-fg-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatClock(start) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-fg-muted",
							children: [Math.round(pct), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatClock(end) })
					]
				})
			]
		})
	});
}
var MAP_SRC = "/game/map-base.jpg";
var VAN_SRC = "/game/van.png";
var STATION_SRC = "/game/station.png";
var DEPOT_SRC = "/game/depot.png";
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load ${src}`));
		img.src = src;
	});
}
function tint(src, color) {
	const c = document.createElement("canvas");
	c.width = src.width;
	c.height = src.height;
	const g = c.getContext("2d");
	g.drawImage(src, 0, 0);
	g.globalCompositeOperation = "multiply";
	g.fillStyle = color;
	g.fillRect(0, 0, c.width, c.height);
	g.globalCompositeOperation = "destination-in";
	g.drawImage(src, 0, 0);
	return c;
}
function MapCanvas({ ambient = false }) {
	const canvasRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const cam = (0, import_react.useRef)({
		zoom: 1,
		panX: 0,
		panY: 0
	});
	const trails = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	const drag = (0, import_react.useRef)(null);
	const assets = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let dead = false;
		Promise.all([
			loadImage(MAP_SRC),
			loadImage(VAN_SRC),
			loadImage(STATION_SRC),
			loadImage(DEPOT_SRC)
		]).then(([map, van, station, depot]) => {
			if (dead) return;
			assets.current = {
				map,
				van,
				station,
				depot,
				vans: /* @__PURE__ */ new Map()
			};
		});
		return () => {
			dead = true;
		};
	}, []);
	const caseId = useGame((s) => s.compiled?.def.id);
	(0, import_react.useEffect)(() => {
		trails.current.clear();
	}, [caseId]);
	(0, import_react.useEffect)(() => {
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
		const loop = (now) => {
			const dt = Math.min(.1, (now - last) / 1e3);
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
	(0, import_react.useEffect)(() => {
		const wrap = wrapRef.current;
		if (!wrap) return;
		const onWheel = (e) => {
			e.preventDefault();
			const c = cam.current;
			const next = Math.min(2.6, Math.max(1, c.zoom * (e.deltaY < 0 ? 1.08 : .92)));
			c.zoom = next;
			if (next <= 1.01) {
				c.panX = 0;
				c.panY = 0;
				c.zoom = 1;
			}
		};
		const onDown = (e) => {
			if (e.button !== 0) return;
			drag.current = {
				x: e.clientX,
				y: e.clientY,
				panX: cam.current.panX,
				panY: cam.current.panY
			};
			wrap.setPointerCapture(e.pointerId);
		};
		const onMove = (e) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: wrapRef,
		className: "relative h-full w-full touch-none overflow-hidden bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "block h-full w-full"
		})
	});
}
function mapRect(canvas, img, cam) {
	const cw = canvas.width;
	const ch = canvas.height;
	const scale = Math.min(cw / img.width, ch / img.height) * cam.zoom;
	const w = img.width * scale;
	const h = img.height * scale;
	return {
		x: (cw - w) / 2 + cam.panX,
		y: (ch - h) / 2 + cam.panY,
		w,
		h
	};
}
function worldToScreen(wx, wy, rect) {
	return {
		x: rect.x + wx * rect.w,
		y: rect.y + wy * rect.h
	};
}
function draw(canvas, assets, cam, trails, now, ambient) {
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
	const pulse = .5 + .5 * Math.sin(now / 280);
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
			ctx.arc(p.x, p.y, size * .62, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(122, 155, 184, ${.12 + .16 * pulse})`;
			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = `rgba(200, 214, 228, ${.45 + .35 * pulse})`;
			ctx.stroke();
		}
		ctx.drawImage(assets.station, p.x - size / 2, p.y - size / 2, size, size);
	}
	ctx.font = `${Math.max(11, rect.w * .012)}px "IBM Plex Sans", sans-serif`;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	for (const st of STATIONS) {
		const p = worldToScreen(st.propX, st.propY, rect);
		const size = rect.w * st.propScale;
		ctx.fillStyle = "rgba(12, 13, 15, 0.72)";
		const label = st.short.toUpperCase();
		const tw = ctx.measureText(label).width;
		ctx.fillRect(p.x - tw / 2 - 6, p.y + size * .38, tw + 12, 16);
		ctx.fillStyle = "#e8e6e1";
		ctx.fillText(label, p.x, p.y + size * .38 + 2);
	}
	const yard = worldToScreen(NODES.find((n) => n.id === "B1").x, NODES.find((n) => n.id === "B1").y, rect);
	ctx.fillStyle = "rgba(12, 13, 15, 0.72)";
	const yl = "YARD 7";
	const yw = ctx.measureText(yl).width;
	ctx.fillRect(yard.x - yw / 2 - 6, yard.y + 18, yw + 12, 16);
	ctx.fillStyle = "#c8ccd4";
	ctx.fillText(yl, yard.x, yard.y + 20);
	const poses = compiled.cars.map((car) => ({
		car,
		pose: poseAt(car, state.time)
	}));
	for (const { car, pose } of poses) {
		let trail = trails.get(car.id);
		if (!trail) {
			trail = [];
			trails.set(car.id, trail);
		}
		const last = trail[trail.length - 1];
		if (!last || Math.hypot(last.x - pose.x, last.y - pose.y) > .004) {
			trail.push({
				x: pose.x,
				y: pose.y
			});
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
		ctx.globalAlpha = .35;
		ctx.lineWidth = Math.max(1.5, rect.w * .003);
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
	const vanH = rect.w * .04;
	const parkedCount = /* @__PURE__ */ new Map();
	const parkedIndex = /* @__PURE__ */ new Map();
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
				const ang = i / n * Math.PI * 2 - Math.PI / 2;
				p.x += Math.cos(ang) * vanH * .85;
				p.y += Math.sin(ang) * vanH * .85;
			}
		}
		const selected = state.selectedCarId === car.id || selectedCard && state.assignments[selectedCard.id] === car.id;
		if (pose.fueling || selected) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, vanH * .85, 0, Math.PI * 2);
			ctx.strokeStyle = pose.fueling ? `rgba(232, 230, 225, ${.5 + .4 * pulse})` : "rgba(122, 155, 184, 0.8)";
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
			ctx.font = `600 ${Math.max(10, rect.w * .011)}px "Barlow Condensed", sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "bottom";
			ctx.fillStyle = "rgba(12, 13, 15, 0.78)";
			const tw = ctx.measureText(car.callsign).width;
			ctx.fillRect(p.x - tw / 2 - 5, p.y - vanH * .72 - 13, tw + 10, 14);
			ctx.fillStyle = car.color;
			ctx.fillText(car.callsign, p.x, p.y - vanH * .72);
		}
	}
	if (ambient) {
		ctx.fillStyle = "rgba(12, 13, 15, 0.28)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}
function TitleScreen() {
	const completed = useGame((s) => s.completed);
	const openBrief = useGame((s) => s.openBrief);
	const muted = useGame((s) => s.muted);
	const toggleMute = useGame((s) => s.toggleMute);
	const next = CASES.findIndex((c) => !completed.includes(c.id));
	const continueIndex = next === -1 ? 0 : next;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative isolate flex h-dvh flex-col overflow-hidden bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCanvas, { ambient: true })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex min-h-0 flex-1 flex-col justify-end p-6 sm:justify-center sm:p-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[0.28em] text-fg-muted",
					children: "Yard 7 · Fleet investigations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-5xl font-semibold tracking-display text-fg sm:text-7xl",
					children: "GHOST MILES"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-pretty text-sm leading-relaxed text-fg-muted sm:text-base",
					children: "The GPS does not keep totals. It only answers how far a van moved from one time to another. Match each fuel block to the van that was on the pumps — or prove the swipe never belonged to the fleet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-solid",
						onClick: () => openBrief(continueIndex),
						children: completed.length === 0 ? "Begin investigation" : "Continue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-ghost",
						onClick: toggleMute,
						children: muted ? "Sound off" : "Sound on"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-8 grid max-w-xl gap-2 sm:grid-cols-2",
					children: CASES.map((c, i) => {
						const done = completed.includes(c.id);
						const locked = i > 0 && !completed.includes(CASES[i - 1].id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: locked,
							onClick: () => openBrief(i),
							className: "flex w-full items-center gap-3 rounded-md border border-border bg-bg-elevated/80 px-3 py-2.5 text-left disabled:opacity-40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs text-fg-subtle",
									children: c.number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 flex-1 truncate font-display text-sm tracking-wide",
									children: c.title
								}),
								done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-fg-muted" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 text-fg-subtle" })
							]
						}) }, c.id);
					})
				})
			]
		})]
	});
}
function BriefScreen() {
	const compiled = useGame((s) => s.compiled);
	const startCase = useGame((s) => s.startCase);
	const goTitle = useGame((s) => s.goTitle);
	if (!compiled) return null;
	const d = compiled.def;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg px-5 py-8 sm:px-10 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.28em] text-fg-subtle",
				children: ["Case ", d.number]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold tracking-display text-fg sm:text-5xl",
				children: d.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-fg-muted",
				children: d.subtitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 max-w-xl space-y-4 text-pretty text-sm leading-relaxed text-fg-muted sm:text-base",
				children: d.briefing.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 max-w-xl text-xs text-fg-subtle",
				children: "Select a fuel block to jump the clock. Drag it onto the van that was at that station — or, when the pumps are empty, onto Not on the map."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-solid",
					onClick: startCase,
					children: "Open the map"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: goTitle,
					children: "Back"
				})]
			})
		]
	});
}
function DebriefScreen() {
	const compiled = useGame((s) => s.compiled);
	const caseIndex = useGame((s) => s.caseIndex);
	const nextCase = useGame((s) => s.nextCase);
	const goTitle = useGame((s) => s.goTitle);
	if (!compiled) return null;
	const last = caseIndex >= CASES.length - 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg px-5 py-8 sm:px-10 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[0.28em] text-fg-subtle",
				children: "Dossier closed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold tracking-display text-fg sm:text-5xl",
				children: compiled.def.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 max-w-xl space-y-4 text-pretty text-sm leading-relaxed text-fg-muted sm:text-base",
				children: compiled.def.debrief.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-solid",
					onClick: nextCase,
					children: last ? "Return to yard" : "Next case"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: goTitle,
					children: "Case list"
				})]
			})
		]
	});
}
function GameApp() {
	const screen = useGame((s) => s.screen);
	const boot = useGame((s) => s.boot);
	const compiled = useGame((s) => s.compiled);
	(0, import_react.useEffect)(() => {
		boot();
	}, [boot]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (useGame.getState().screen !== "play") return;
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
			const s = useGame.getState();
			if (e.code === "Space") {
				e.preventDefault();
				s.setPlaying(!s.playing);
			} else if (e.code === "ArrowRight") s.setTime(s.time + 5);
			else if (e.code === "ArrowLeft") s.setTime(s.time - 5);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	if (!compiled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-dvh place-items-center bg-bg text-fg-muted",
		children: "Loading yard…"
	});
	if (screen === "title") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, {});
	if (screen === "brief") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefScreen, {});
	if (screen === "debrief") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebriefScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-[1.15]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapCanvas, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex h-[48%] min-h-0 flex-col border-t border-border bg-bg-elevated lg:h-auto lg:w-[380px] lg:border-l lg:border-t-0 xl:w-[400px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GpsTerminal, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBoard, {})]
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { Home as component };
