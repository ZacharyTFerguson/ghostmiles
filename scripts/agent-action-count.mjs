#!/usr/bin/env node
/**
 * Estimates minimum UI actions for a full 01–05 clear.
 * Run: node scripts/agent-action-count.mjs
 * Live DOM check: node scripts/agent-action-count.mjs --live
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

const staticReport = {};
for (const mode of ["default", "agent-express", "agent-hotkeys", "agent-quick-assign"]) {
  const a = count(mode);
  staticReport[mode] = {
    actions: a,
    at5s: a * 5,
    at12s: a * 12,
  };
  console.log(`${mode}: ${a} actions (~${(a * 5).toFixed(0)}s @ 5s/action, ~${(a * 12).toFixed(0)}s @ 12s/action)`);
}

const defaultTotal = staticReport.default.actions;
const quickTotal = staticReport["agent-quick-assign"].actions;
const reductionPct = Math.round((1 - quickTotal / defaultTotal) * 100);
console.log(`quick-assign reduction vs default: ${reductionPct}%`);

async function liveSmoke() {
  const { chromium } = await import("playwright");
  const BASE = process.env.GHOST_MILES_URL ?? "http://127.0.0.1:8080";
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`${BASE}/?agent=1&express=1&case=01`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__ghostMiles?.ready === true, null, { timeout: 15_000 });

  const phase = await page.evaluate(() => window.__ghostMiles.getPhase());
  if (phase.screen !== "play" || phase.caseNumber !== "01") {
    throw new Error(`Expected play/01, got ${JSON.stringify(phase)}`);
  }

  const selected = await page.evaluate(() => {
    const s = window.__ghostMiles.getState();
    return s.selectedCardId;
  });
  if (!selected) throw new Error("Express boot should auto-select first fuel block");

  const cardCount = await page.locator('[data-testid="fuel-block-list"] [data-testid^="fuel-block-"]').count();
  await browser.close();
  console.log(JSON.stringify({ live: true, phase, autoSelected: selected, cardCount }, null, 2));
}

if (process.argv.includes("--live")) {
  liveSmoke().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
