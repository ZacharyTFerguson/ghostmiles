import { useGame } from "./store";

/** One-click assign strip — agent mode only. Cuts select+click to a single action per card. */
export function AgentAssignBar() {
  const agent = useGame((s) => s.agent);
  const compiled = useGame((s) => s.compiled);
  const assignments = useGame((s) => s.assignments);
  const assign = useGame((s) => s.assign);

  if (!agent.enabled || !compiled) return null;

  const pending = compiled.cards.filter((c) => !assignments[c.id]);
  if (pending.length === 0) return null;

  return (
    <div
      className="border-b border-border bg-bg-subtle/80 px-3 py-2"
      data-testid="agent-assign-bar"
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        Quick assign
      </p>
      <ul className="flex flex-col gap-1.5">
        {pending.map((card, i) => (
          <li
            key={card.id}
            className="flex flex-wrap items-center gap-1.5"
            data-testid={`agent-row-${card.id}`}
          >
            <span className="min-w-[5.5rem] font-mono text-[11px] tabular-nums text-fg-muted">
              {i + 1}. FC-{card.cardNumber}
            </span>
            {compiled.cars.map((car) => (
              <button
                key={car.id}
                type="button"
                data-testid={`agent-assign-${card.id}-${car.id}`}
                aria-label={`Assign FC-${card.cardNumber} to ${car.callsign}`}
                onClick={() => assign(card.id, car.id)}
                className="h-8 min-w-8 rounded-sm border border-border bg-bg-elevated px-2 font-display text-xs font-semibold tracking-wide hover:border-fg"
              >
                {car.callsign[0]}
              </button>
            ))}
            {compiled.def.allowFraud && (
              <button
                type="button"
                data-testid={`agent-assign-${card.id}-fraud`}
                aria-label={`Assign FC-${card.cardNumber} to Not on the map`}
                onClick={() => assign(card.id, "FRAUD")}
                className="h-8 rounded-sm border border-dashed border-border-strong px-2 font-mono text-[10px] text-fg-muted hover:border-fg hover:text-fg"
              >
                N
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
