# Ghost Miles

Yard 7 fuel-block investigation game. Match each fleet fuel swipe to the van on the pumps at that moment — or mark it as not on the map.

## Play (humans)

Open the app normally. Work cases **01 → 05** in order. Click a fuel block to jump the clock (the map auto-pauses), then click the unit row or **Not on the map**, then **File dossier**.

## Agent / automation mode

Computer-use agents spend most wall-clock time on navigation and clicks, not puzzle logic. Enable agent mode to remove brief/debrief friction and expose stable selectors.

### Quick start (recommended for skill racers)

```
/?agent=1&express=1&case=01
```

| Param | Effect |
|-------|--------|
| `agent=1` | Agent mode: muted audio, skip buttons, `data-testid` hooks, `window.__ghostMiles` API, all cases unlocked on title |
| `express=1` | Skip brief/debrief screens; auto-chain to the next case after a correct dossier |
| `case=01` … `05` | Land directly in play for that case (skips title + brief) |

**Full 01–05 race URL:** `/?agent=1&express=1&case=01` — after each correct submit, the next case opens immediately until 05 is filed.

### Interaction flow (unchanged puzzle logic)

1. **Select fuel block** — clock jumps to swipe time; map pauses.
2. **Assign** — click unit row or **Not on the map** / **Fraud** (cases 04–05).
3. **File dossier** — repeat for all blocks, then submit.

Puzzle answers and fuel→van mappings are **not** modified in agent mode.

### Keyboard shortcuts

| Key | Screen | Action |
|-----|--------|--------|
| **Enter** | Title / Brief / Debrief / Play | Continue / Open map / Next case / File dossier |
| **Esc** | Brief / Debrief (agent mode) | Skip to map / next case |
| **1–9** | Play | Select unassigned fuel block by list order |
| **A / B / C / D** | Play | Assign selected block to ALPHA / BRAVO / CHARLIE / DELTA |
| **F** or **N** | Play (fraud cases) | Assign to Not on the map |
| **Space** | Play | Toggle play / pause |
| **← / →** | Play | Nudge clock ±5 minutes |
| **S** | Play | Cycle simulation speed (1× / 4× / 12×) |

Agents can use hotkeys instead of click snapshots for faster assign loops.

### DOM selectors (`data-testid`)

| Selector | Element |
|----------|---------|
| `begin-investigation` | Title continue button |
| `case-01` … `case-05` | Case list entries |
| `open-map` | Brief → play |
| `skip-brief` | Agent skip brief |
| `fuel-block-{id}` | Fuel block button (e.g. `fuel-block-c1a`) |
| `van-drop-alpha` … `van-drop-delta` | Unit assign targets |
| `van-drop-fraud` | Not on the map |
| `agent-assign-bar` | Quick-assign panel (agent mode) |
| `agent-assign-{cardId}-{vanId}` | One-click assign (e.g. `agent-assign-c1a-alpha`) |
| `agent-assign-{cardId}-fraud` | One-click fraud assign |
| `file-dossier` | Submit dossier |
| `next-case` | Debrief continue |
| `skip-debrief` | Agent skip debrief |

### Programmatic API

When `agent=1`, after boot:

```javascript
// Wait for ready
await new Promise(r => window.addEventListener('ghostmiles:ready', r, { once: true }));

const gm = window.__ghostMiles;
gm.getPhase(); // { screen, caseIndex, caseNumber, unassignedCardIds, allowFraud, ... }

// Typical loop (answers must still be correct — no cheats in the API)
gm.selectCard('c1a');
gm.assignSelected('alpha');
gm.submit();
```

`getState()` returns the full Zustand store for advanced scripting.

## Verify agent speed improvements

1. **Baseline (human UI path):** `/?` — time five cases with click-only navigation through every brief and debrief.
2. **Agent express:** `/?agent=1&express=1&case=01` — same solves, measure wall-clock to dossier close on case 05.
3. **Hotkey path:** same express URL; use `1` → `A` → `2` → `B` … → **Enter** per case instead of DOM clicks.

**Quick assign bar** (visible in agent mode on the play screen): each pending fuel block gets inline **A/B/C/D/N** buttons — one click selects, jumps the clock, and assigns. This cuts per-card actions from 2 → 1.

Expected savings vs default click path:

| Path | ~Actions (01–05) | ~Wall-clock @ 5s/action |
|------|------------------|-------------------------|
| Default UI (briefs + 2-click assign) | 52 | ~4.3 min |
| Express + quick assign | 23 | ~1.9 min |
| Express + hotkeys | 41 | ~3.4 min |

At 12s/action (typical computer-use latency), default ≈ **10.4 min**; express + quick assign ≈ **4.6 min** — within the sub-5:00 target when solves are correct.

## Development

```bash
npm run dev    # preview on :8080
npm run build
npm run typecheck
```
