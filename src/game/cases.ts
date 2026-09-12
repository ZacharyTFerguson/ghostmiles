import type { CarDef, CaseDef, Job } from "./types";
import { CAR_SPEED_MPH } from "./world";

const SPEED = CAR_SPEED_MPH;

function car(
  id: string,
  callsign: string,
  color: string,
  jobs: Job[],
): CarDef {
  return { id, callsign, color, speedMph: SPEED, jobs };
}

export const CASES: CaseDef[] = [
  {
    id: "first-shift",
    number: "01",
    title: "First Shift",
    subtitle: "Three vans. Three swipes. Watch the lot.",
    briefing: [
      "Yard 7 runs a closed fleet. Every gallon is supposed to sit on a company card, and every card is supposed to sit in a company van.",
      "Milelog, the GPS box, does not keep an odometer. It will not tell you total miles. Ask it a window — one time to another — and it will answer how far a van moved in that window. That is all it will answer.",
      "Open a fuel block. The map jumps to the swipe. See which van is sitting on the pumps. Drop the block on that van.",
    ],
    startMin: 8 * 60,
    endMin: 11 * 60 + 20,
    allowFraud: false,
    cars: [
      car("alpha", "ALPHA", "#6d8aa8", [
        { node: "B1", dwellMin: 0, kind: "depot" },
        { node: "A2", dwellMin: 6, kind: "fuel" },
        { node: "A4", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 20, kind: "depot" },
      ]),
      car("bravo", "BRAVO", "#b56858", [
        { node: "B1", dwellMin: 16, kind: "idle" },
        { node: "B4", dwellMin: 6, kind: "fuel" },
        { node: "C4", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 16, kind: "depot" },
      ]),
      car("charlie", "CHARLIE", "#7a8a62", [
        { node: "B1", dwellMin: 34, kind: "idle" },
        { node: "C2", dwellMin: 6, kind: "fuel" },
        { node: "C3", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 16, kind: "depot" },
      ]),
    ],
    cards: [
      { id: "c1a", cardNumber: "4412", gallons: 18.4, dollars: 68.9, stationId: "northside", answer: "alpha" },
      { id: "c1b", cardNumber: "4418", gallons: 16.1, dollars: 60.2, stationId: "riverside", answer: "bravo" },
      { id: "c1c", cardNumber: "4420", gallons: 19.0, dollars: 71.1, stationId: "southside", answer: "charlie" },
    ],
    debrief: [
      "ALPHA took Northside. BRAVO took Riverside. CHARLIE took the South Lot. The ledger matches the map.",
      "Remember the trick: the box never stores a running odometer. If you need miles, you have to ask for a window.",
    ],
  },
  {
    id: "same-pumps",
    number: "02",
    title: "Same Pumps",
    subtitle: "Northside gets two visits. The clock is the tell.",
    briefing: [
      "Northside Fuel logged two company swipes. Two different vans used those pumps — hours apart.",
      "Do not assign a station to the first van you remember. Open each block. Ride the clock. The van that is sitting there at the swipe is the van that bought the fuel.",
    ],
    startMin: 8 * 60,
    endMin: 12 * 60 + 30,
    allowFraud: false,
    cars: [
      car("alpha", "ALPHA", "#6d8aa8", [
        { node: "B1", dwellMin: 0, kind: "depot" },
        { node: "A2", dwellMin: 6, kind: "fuel" },
        { node: "A4", dwellMin: 10, kind: "delivery" },
        { node: "B1", dwellMin: 40, kind: "depot" },
      ]),
      car("bravo", "BRAVO", "#b56858", [
        { node: "B1", dwellMin: 12, kind: "idle" },
        { node: "B4", dwellMin: 6, kind: "fuel" },
        { node: "C4", dwellMin: 9, kind: "delivery" },
        { node: "B1", dwellMin: 30, kind: "depot" },
      ]),
      car("charlie", "CHARLIE", "#7a8a62", [
        { node: "B1", dwellMin: 70, kind: "idle" },
        { node: "A2", dwellMin: 6, kind: "fuel" },
        { node: "A3", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 20, kind: "depot" },
      ]),
      car("delta", "DELTA", "#c4b496", [
        { node: "B1", dwellMin: 28, kind: "idle" },
        { node: "C2", dwellMin: 6, kind: "fuel" },
        { node: "C1", dwellMin: 7, kind: "delivery" },
        { node: "B1", dwellMin: 20, kind: "depot" },
      ]),
    ],
    cards: [
      { id: "c2a", cardNumber: "5510", gallons: 17.2, dollars: 64.4, stationId: "northside", answer: "alpha" },
      { id: "c2b", cardNumber: "5514", gallons: 15.8, dollars: 59.1, stationId: "riverside", answer: "bravo" },
      { id: "c2c", cardNumber: "5521", gallons: 20.4, dollars: 76.3, stationId: "southside", answer: "delta" },
      { id: "c2d", cardNumber: "5528", gallons: 16.6, dollars: 62.0, stationId: "northside", answer: "charlie" },
    ],
    debrief: [
      "ALPHA hit Northside on the morning pull. CHARLIE came back to the same canopy after ten.",
      "Same pumps. Different clock. The block only matches a van at a point in time.",
    ],
  },
  {
    id: "zero-miles",
    number: "03",
    title: "Zero Miles",
    subtitle: "Two vans crossed Riverside. Only one stopped.",
    briefing: [
      "Riverside logged a swipe just after ten. ALPHA and BRAVO both ran that east road around the same minutes.",
      "A van that is pumping reads zero miles in a tight window. A van that is only passing through still moves.",
      "Ask Milelog for 10:16 to 10:26 on each unit. The stopped van is the buyer.",
    ],
    startMin: 10 * 60,
    endMin: 12 * 60 + 20,
    allowFraud: false,
    gpsHint: "Query 10:16–10:26. A fueling van reads 0.0 mi.",
    cars: [
      car("alpha", "ALPHA", "#6d8aa8", [
        { node: "B1", dwellMin: 0, kind: "depot" },
        { node: "B4", dwellMin: 8, kind: "fuel" },
        { node: "A4", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 20, kind: "depot" },
      ]),
      car("bravo", "BRAVO", "#b56858", [
        { node: "A4", dwellMin: 14, kind: "idle" },
        { node: "B4", dwellMin: 0, kind: "delivery" },
        { node: "C4", dwellMin: 9, kind: "delivery" },
        { node: "B1", dwellMin: 16, kind: "depot" },
      ]),
      car("charlie", "CHARLIE", "#7a8a62", [
        { node: "B1", dwellMin: 6, kind: "idle" },
        { node: "C2", dwellMin: 6, kind: "fuel" },
        { node: "C3", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 16, kind: "depot" },
      ]),
      car("delta", "DELTA", "#c4b496", [
        { node: "B1", dwellMin: 18, kind: "idle" },
        { node: "A2", dwellMin: 6, kind: "fuel" },
        { node: "A1", dwellMin: 7, kind: "delivery" },
        { node: "B1", dwellMin: 16, kind: "depot" },
      ]),
    ],
    cards: [
      { id: "c3a", cardNumber: "6602", gallons: 18.9, dollars: 70.7, stationId: "riverside", answer: "alpha" },
      { id: "c3b", cardNumber: "6608", gallons: 17.4, dollars: 65.1, stationId: "southside", answer: "charlie" },
      { id: "c3c", cardNumber: "6611", gallons: 15.2, dollars: 56.9, stationId: "northside", answer: "delta" },
    ],
    debrief: [
      "BRAVO rolled through Riverside without taking a drop. ALPHA sat on the pad — Milelog reads 0.0 in that window.",
      "Passing a canopy is not buying fuel. The GPS range is how you prove a stop.",
    ],
  },
  {
    id: "extra-swipe",
    number: "04",
    title: "The Extra Swipe",
    subtitle: "One charge has no van under it.",
    briefing: [
      "Accounts found a fifth swipe the yard did not authorize. Four of these blocks belong to fleet units. One does not.",
      "If you open a block and the pumps are empty, that card was never in a Yard 7 van. Drop it on NOT ON THE MAP.",
    ],
    startMin: 8 * 60 + 30,
    endMin: 13 * 60 + 20,
    allowFraud: true,
    cars: [
      car("alpha", "ALPHA", "#6d8aa8", [
        { node: "B1", dwellMin: 0, kind: "depot" },
        { node: "A2", dwellMin: 6, kind: "fuel" },
        { node: "A4", dwellMin: 9, kind: "delivery" },
        { node: "B1", dwellMin: 50, kind: "depot" },
      ]),
      car("bravo", "BRAVO", "#b56858", [
        { node: "B1", dwellMin: 14, kind: "idle" },
        { node: "B4", dwellMin: 6, kind: "fuel" },
        { node: "C4", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 40, kind: "depot" },
      ]),
      car("charlie", "CHARLIE", "#7a8a62", [
        { node: "B1", dwellMin: 32, kind: "idle" },
        { node: "C2", dwellMin: 6, kind: "fuel" },
        { node: "C3", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 30, kind: "depot" },
      ]),
      car("delta", "DELTA", "#c4b496", [
        { node: "B1", dwellMin: 55, kind: "idle" },
        { node: "A3", dwellMin: 8, kind: "delivery" },
        { node: "A2", dwellMin: 6, kind: "fuel" },
        { node: "B1", dwellMin: 20, kind: "depot" },
      ]),
    ],
    cards: [
      { id: "c4a", cardNumber: "7701", gallons: 16.8, dollars: 62.8, stationId: "northside", answer: "alpha" },
      { id: "c4b", cardNumber: "7704", gallons: 18.1, dollars: 67.7, stationId: "riverside", answer: "bravo" },
      { id: "c4c", cardNumber: "7709", gallons: 19.6, dollars: 73.3, stationId: "southside", answer: "charlie" },
      { id: "c4d", cardNumber: "7716", gallons: 14.9, dollars: 55.7, stationId: "northside", answer: "delta" },
      {
        id: "c4e",
        cardNumber: "0900",
        gallons: 22.4,
        dollars: 83.9,
        stationId: "southside",
        answer: "FRAUD",
        timeMin: 12 * 60 + 46,
      },
    ],
    debrief: [
      "Card 0900 swiped South Lot at 12:46. No Yard 7 van was on those pumps. The other four blocks close clean.",
      "Someone is buying diesel on a card that does not live in this fleet.",
    ],
  },
  {
    id: "card-7781",
    number: "05",
    title: "Card 7781",
    subtitle: "One card. Two canopies. Same minute.",
    briefing: [
      "DELTA's card, 7781, posted twice. Once at Northside, once at Riverside, overlapping by the clock.",
      "A van cannot sit on two pads. Ask Milelog for DELTA between 14:00 and 14:10. If the range is zero, DELTA was stopped — and the other swipe is a clone.",
      "Assign the true stop to DELTA. Drop the impossible swipe on NOT ON THE MAP.",
    ],
    startMin: 13 * 60 + 40,
    endMin: 16 * 60 + 10,
    allowFraud: true,
    gpsHint: "Query DELTA 14:00–14:10. Zero miles means the Northside stop is real.",
    cars: [
      car("alpha", "ALPHA", "#6d8aa8", [
        { node: "B1", dwellMin: 0, kind: "depot" },
        { node: "C2", dwellMin: 6, kind: "fuel" },
        { node: "C4", dwellMin: 9, kind: "delivery" },
        { node: "B1", dwellMin: 20, kind: "depot" },
      ]),
      car("bravo", "BRAVO", "#b56858", [
        { node: "B1", dwellMin: 10, kind: "idle" },
        { node: "B3", dwellMin: 8, kind: "delivery" },
        { node: "B4", dwellMin: 0, kind: "delivery" },
        { node: "A4", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 16, kind: "depot" },
      ]),
      car("charlie", "CHARLIE", "#7a8a62", [
        { node: "B1", dwellMin: 22, kind: "idle" },
        { node: "C3", dwellMin: 8, kind: "delivery" },
        { node: "C1", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 16, kind: "depot" },
      ]),
      car("delta", "DELTA", "#c4b496", [
        { node: "B1", dwellMin: 8, kind: "idle" },
        { node: "A2", dwellMin: 10, kind: "fuel" },
        { node: "A1", dwellMin: 8, kind: "delivery" },
        { node: "B1", dwellMin: 20, kind: "depot" },
      ]),
    ],
    cards: [
      { id: "c5a", cardNumber: "4412", gallons: 17.7, dollars: 66.2, stationId: "southside", answer: "alpha" },
      {
        id: "c5b",
        cardNumber: "7781",
        gallons: 18.6,
        dollars: 69.6,
        stationId: "northside",
        answer: "delta",
      },
      {
        id: "c5c",
        cardNumber: "7781",
        gallons: 24.8,
        dollars: 92.8,
        stationId: "riverside",
        answer: "FRAUD",
        timeMin: 14 * 60 + 4,
      },
    ],
    debrief: [
      "DELTA was dead still at Northside. Milelog says so. Card 7781 also posted at Riverside in the same minutes — a cloned stripe, not a second van.",
      "The yard can lock 7781. The clone is the leak. That is the bad history: a card that moves farther than the van it belongs to.",
    ],
  },
];

export function caseById(id: string): CaseDef | undefined {
  return CASES.find((c) => c.id === id);
}
