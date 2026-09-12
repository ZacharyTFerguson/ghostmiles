import { vansAtStationAtTime } from "./sim";
import { useGame } from "./store";
import { formatClock, getStation } from "./world";

/**
 * Agent-only pump readout at the selected swipe time — map-verify UI aid, not answers.
 * Shows which fleet vans occupy the station node (fueling highlighted).
 */
export function PumpGlance() {
  const agent = useGame((s) => s.agent);
  const compiled = useGame((s) => s.compiled);
  const selectedCardId = useGame((s) => s.selectedCardId);

  if (!agent.enabled || !compiled || !selectedCardId) return null;

  const card = compiled.cards.find((c) => c.id === selectedCardId);
  if (!card) return null;

  const station = getStation(card.stationId);
  const vans = vansAtStationAtTime(compiled.cars, station.node, card.timeMin);

  return (
    <div
      className="pointer-events-none absolute left-3 top-3 z-10 max-w-[min(100%-1.5rem,22rem)] rounded-lg border border-border bg-bg-elevated/94 px-3 py-2 shadow-soft"
      data-testid="pump-glance"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Pump glance</p>
      <p className="mt-1 font-mono text-xs tabular-nums text-fg">
        {station.short} · {formatClock(card.timeMin)}
      </p>
      {vans.length === 0 ? (
        <p className="mt-1.5 text-xs text-fg-muted" data-testid="pump-empty">
          No fleet van on these pumps
        </p>
      ) : (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {vans.map((van) => (
            <li
              key={van.carId}
              data-testid={`pump-van-${van.carId}`}
              className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-display text-xs font-semibold tracking-wide ${
                van.fueling
                  ? "border-accent bg-bg-subtle text-fg"
                  : "border-border bg-bg text-fg-muted"
              }`}
            >
              <span
                className="size-2 rounded-full"
                style={{ background: van.color }}
                aria-hidden
              />
              {van.callsign}
              {van.fueling && (
                <span className="font-mono text-[9px] font-normal uppercase text-accent">fueling</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
