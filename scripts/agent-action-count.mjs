/**
 * Estimates minimum UI actions for a full 01–05 clear.
 * Run: node scripts/agent-action-count.mjs
 */
const CASES = [
  { n: "01", cards: 3, fraud: false },
  { n: "02", cards: 4, fraud: false },
  { n: "03", cards: 3, fraud: false },
  { n: "04", cards: 5, fraud: true },
  { n: "05", cards: 3, fraud: true },
];

function count(mode) {
  let actions = 0;
  if (mode === "default") {
    actions += 1; // begin
    for (const c of CASES) {
      actions += 1; // open map (brief)
      actions += c.cards * 2; // select + assign
      actions += 1; // file dossier
      actions += 1; // next case (debrief)
    }
  } else if (mode === "agent-express") {
    // ?agent=1&express=1&case=01 — no title/brief/debrief between cases
    for (const c of CASES) {
      actions += c.cards * 2;
      actions += 1;
    }
  } else if (mode === "agent-hotkeys") {
    for (const c of CASES) {
      actions += c.cards * 2; // digit + letter keys
      actions += 1; // enter submit
    }
  } else if (mode === "agent-quick-assign") {
    for (const c of CASES) {
      actions += c.cards; // one-click quick assign bar
      actions += 1; // file dossier
    }
  }
  return actions;
}

for (const mode of ["default", "agent-express", "agent-hotkeys", "agent-quick-assign"]) {
  const a = count(mode);
  console.log(`${mode}: ${a} actions (~${(a * 5).toFixed(0)}s @ 5s/action, ~${(a * 12).toFixed(0)}s @ 12s/action)`);
}
