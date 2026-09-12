import { Check, ChevronRight } from "lucide-react";
import { CASES } from "./cases";
import { MapCanvas } from "./MapCanvas";
import { useGame } from "./store";

export function TitleScreen() {
  const completed = useGame((s) => s.completed);
  const openBrief = useGame((s) => s.openBrief);
  const startPlayAt = useGame((s) => s.startPlayAt);
  const muted = useGame((s) => s.muted);
  const toggleMute = useGame((s) => s.toggleMute);
  const agent = useGame((s) => s.agent);
  const next = CASES.findIndex((c) => !completed.includes(c.id));
  const continueIndex = next === -1 ? 0 : next;

  function beginCase(index: number) {
    if (agent.express) startPlayAt(index);
    else openBrief(index);
  }

  return (
    <div className="relative isolate flex h-dvh flex-col overflow-hidden bg-bg">
      <div className="absolute inset-0">
        <MapCanvas ambient />
      </div>
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end p-6 sm:justify-center sm:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-fg-muted">
          Yard 7 · Fleet investigations
        </p>
        <h1 className="mt-2 font-display text-5xl font-semibold tracking-display text-fg sm:text-7xl">
          GHOST MILES
        </h1>
        <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
          The GPS does not keep totals. It only answers how far a van moved from one time to another.
          Match each fuel block to the van that was on the pumps — or prove the swipe never belonged to the fleet.
        </p>
        {agent.enabled && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Agent mode · Enter to continue · add &amp;express=1 to skip briefs
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-solid"
            data-testid="begin-investigation"
            onClick={() => beginCase(continueIndex)}
          >
            {completed.length === 0 ? "Begin investigation" : "Continue"}
          </button>
          <button type="button" className="btn-ghost" onClick={toggleMute}>
            {muted ? "Sound off" : "Sound on"}
          </button>
        </div>
        <ol className="mt-8 grid max-w-xl gap-2 sm:grid-cols-2">
          {CASES.map((c, i) => {
            const done = completed.includes(c.id);
            const locked = !agent.unlockAll && i > 0 && !completed.includes(CASES[i - 1].id);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  disabled={locked}
                  data-testid={`case-${c.number}`}
                  aria-label={`Case ${c.number} ${c.title}`}
                  onClick={() => beginCase(i)}
                  className="flex w-full items-center gap-3 rounded-md border border-border bg-bg-elevated/80 px-3 py-2.5 text-left disabled:opacity-40"
                >
                  <span className="font-mono text-xs text-fg-subtle">{c.number}</span>
                  <span className="min-w-0 flex-1 truncate font-display text-sm tracking-wide">
                    {c.title}
                  </span>
                  {done ? (
                    <Check className="size-4 text-fg-muted" />
                  ) : (
                    <ChevronRight className="size-4 text-fg-subtle" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function BriefScreen() {
  const compiled = useGame((s) => s.compiled);
  const startCase = useGame((s) => s.startCase);
  const skipBrief = useGame((s) => s.skipBrief);
  const goTitle = useGame((s) => s.goTitle);
  const agent = useGame((s) => s.agent);
  if (!compiled) return null;
  const d = compiled.def;

  return (
    <div className="flex min-h-dvh flex-col bg-bg px-5 py-8 sm:px-10 sm:py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-fg-subtle">
        Case {d.number}
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-display text-fg sm:text-5xl">
        {d.title}
      </h1>
      <p className="mt-2 text-fg-muted">{d.subtitle}</p>
      <div className="mt-8 max-w-xl space-y-4 text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
        {d.briefing.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className="mt-8 max-w-xl text-xs text-fg-subtle">
        Click a fuel block to jump the clock (map auto-pauses). Click the unit that was on the pumps — or
        Not on the map when no van was there. Hotkeys: 1–9 select block, A/B/C/D assign van, F fraud,
        Enter file dossier.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className="btn-solid" data-testid="open-map" onClick={startCase}>
          Open the map
        </button>
        {agent.enabled && (
          <button type="button" className="btn-ghost" data-testid="skip-brief" onClick={skipBrief}>
            Skip brief (Esc)
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={goTitle}>
          Back
        </button>
      </div>
    </div>
  );
}

export function DebriefScreen() {
  const compiled = useGame((s) => s.compiled);
  const caseIndex = useGame((s) => s.caseIndex);
  const nextCase = useGame((s) => s.nextCase);
  const skipDebrief = useGame((s) => s.skipDebrief);
  const goTitle = useGame((s) => s.goTitle);
  const agent = useGame((s) => s.agent);
  if (!compiled) return null;
  const last = caseIndex >= CASES.length - 1;

  return (
    <div className="flex min-h-dvh flex-col bg-bg px-5 py-8 sm:px-10 sm:py-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-fg-subtle">Dossier closed</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-display text-fg sm:text-5xl">
        {compiled.def.title}
      </h1>
      <div className="mt-8 max-w-xl space-y-4 text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
        {compiled.def.debrief.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" className="btn-solid" data-testid="next-case" onClick={nextCase}>
          {last ? "Return to yard" : "Next case"}
        </button>
        {agent.enabled && !last && (
          <button type="button" className="btn-ghost" data-testid="skip-debrief" onClick={skipDebrief}>
            Skip debrief (Esc)
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={goTitle}>
          Case list
        </button>
      </div>
    </div>
  );
}
