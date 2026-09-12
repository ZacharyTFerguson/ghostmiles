import { chromium } from "playwright";

const BASE = process.env.SMOKE_URL ?? "http://127.0.0.1:8080";

async function waitReady(page) {
  await page.goto(`${BASE}/?agent=1&express=1&case=01`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__ghostMiles?.ready === true, null, { timeout: 15_000 });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await waitReady(page);

  const phase = await page.evaluate(() => window.__ghostMiles.getPhase());
  if (phase.screen !== "play" || phase.caseNumber !== "01") {
    throw new Error(`Expected play/01, got ${JSON.stringify(phase)}`);
  }

  await page.waitForSelector('[data-testid="pump-glance"]');
  const autoSelected = await page.evaluate(() => window.__ghostMiles.getState().selectedCardId);
  if (!autoSelected) throw new Error("Express boot should auto-select first fuel block");

  // Quick assign case 01: c1a→alpha, c1b→bravo, c1c→charlie
  await page.click('[data-testid="agent-assign-c1a-alpha"]');
  await page.click('[data-testid="agent-assign-c1b-bravo"]');
  await page.click('[data-testid="agent-assign-c1c-charlie"]');
  await page.click('[data-testid="file-dossier"]');

  await page.waitForFunction(
    () => window.__ghostMiles.getPhase().caseNumber === "02",
    null,
    { timeout: 5_000 },
  );

  const after = await page.evaluate(() => window.__ghostMiles.getPhase());
  console.log(JSON.stringify({ ok: true, after }, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: String(e) }));
  process.exit(1);
});
