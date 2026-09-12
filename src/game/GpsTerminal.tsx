import { useState } from "react";
import { Terminal } from "lucide-react";
import { useGame } from "./store";
import { formatClock, formatMiles } from "./world";

export function GpsTerminal() {
  const compiled = useGame((s) => s.compiled);
  const gpsFrom = useGame((s) => s.gpsFrom);
  const gpsTo = useGame((s) => s.gpsTo);
  const lastQuery = useGame((s) => s.lastQuery);
  const markGpsFrom = useGame((s) => s.markGpsFrom);
  const markGpsTo = useGame((s) => s.markGpsTo);
  const runQuery = useGame((s) => s.runQuery);
  const hint = compiled?.def.gpsHint;
  const [unit, setUnit] = useState<string>("ALL");

  if (!compiled) return null;

  return (
    <section className="border-b border-border px-3 py-3" data-testid="gps-terminal">
      <div className="mb-2 flex items-center gap-2 text-fg-muted">
        <Terminal className="size-3.5" strokeWidth={1.75} />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em]">Milelog</h2>
      </div>
      <p className="mb-3 text-xs leading-snug text-fg-subtle">
        No odometer totals. Range query only.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-ghost" data-testid="gps-from" onClick={markGpsFrom}>
          From {gpsFrom != null ? formatClock(gpsFrom) : "—"}
        </button>
        <button type="button" className="btn-ghost" data-testid="gps-to" onClick={markGpsTo}>
          To {gpsTo != null ? formatClock(gpsTo) : "—"}
        </button>
        <select
          className="btn-ghost h-11 appearance-none pr-7"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          aria-label="Unit"
        >
          <option value="ALL">All units</option>
          {compiled.cars.map((c) => (
            <option key={c.id} value={c.id}>
              {c.callsign}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-solid"
          data-testid="gps-query"
          onClick={() => runQuery(unit === "ALL" ? "ALL" : unit)}
        >
          Query
        </button>
      </div>
      {hint && <p className="mt-2 text-xs text-fg-muted">{hint}</p>}
      {lastQuery && (
        <div className="mt-3 rounded-md border border-border bg-bg px-3 py-2 font-mono text-xs text-fg">
          <div className="mb-1 text-fg-subtle">
            {formatClock(lastQuery.t0)} → {formatClock(lastQuery.t1)}
          </div>
          {lastQuery.rows.map((row) => (
            <div key={row.carId} className="flex justify-between tabular-nums">
              <span>{row.callsign}</span>
              <span>{formatMiles(row.miles)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
