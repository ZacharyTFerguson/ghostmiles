import { useState } from "react";
import { Ban, Check } from "lucide-react";
import type { AssignmentTarget, CompiledCard } from "./types";
import { useGame } from "./store";
import { formatClock } from "./world";

export function CardBoard() {
  const compiled = useGame((s) => s.compiled);
  const assignments = useGame((s) => s.assignments);
  const selectedCardId = useGame((s) => s.selectedCardId);
  const shakeIds = useGame((s) => s.shakeIds);
  const status = useGame((s) => s.status);
  const selectCard = useGame((s) => s.selectCard);
  const assign = useGame((s) => s.assign);
  const unassign = useGame((s) => s.unassign);
  const submit = useGame((s) => s.submit);
  const [held, setHeld] = useState<string | null>(null);

  if (!compiled) return null;

  const unassigned = compiled.cards.filter((c) => !assignments[c.id]);
  const target = held ?? selectedCardId;

  function dropOn(slot: AssignmentTarget) {
    const id = held ?? selectedCardId;
    if (!id) return;
    assign(id, slot);
    setHeld(null);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          Fuel blocks
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {unassigned.map((card) => (
            <FuelBlock
              key={card.id}
              card={card}
              active={target === card.id}
              shake={shakeIds.includes(card.id)}
              onPick={() => {
                setHeld(card.id);
                selectCard(card.id);
              }}
            />
          ))}
          {unassigned.length === 0 && (
            <p className="text-xs text-fg-subtle">All blocks seated. File the dossier.</p>
          )}
        </div>

        <p className="mb-2 mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          Units
        </p>
        <div className="flex flex-col gap-2">
          {compiled.cars.map((car) => {
            const seated = compiled.cards.filter((c) => assignments[c.id] === car.id);
            return (
              <div
                key={car.id}
                className="flex min-h-14 items-start gap-3 rounded-md border border-border bg-bg-subtle px-3 py-2"
              >
                <span
                  className="mt-1 size-2.5 shrink-0 rounded-full"
                  style={{ background: car.color }}
                />
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => dropOn(car.id)}
                    className="flex w-full items-baseline justify-between gap-2 text-left"
                  >
                    <span className="font-display text-sm font-semibold tracking-wide">
                      {car.callsign}
                    </span>
                    {seated.length > 0 && (
                      <Check className="size-3.5 text-fg-muted" strokeWidth={2} />
                    )}
                  </button>
                  {seated.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => dropOn(car.id)}
                      className="mt-0.5 text-left text-xs text-fg-subtle"
                    >
                      Drop a block
                    </button>
                  ) : (
                    <ul className="mt-1 space-y-1">
                      {seated.map((card) => (
                        <li key={card.id}>
                          <SeatedChip card={card} onRemove={() => unassign(card.id)} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
          {compiled.def.allowFraud && (
            <div className="flex min-h-14 items-start gap-3 rounded-md border border-dashed border-border-strong bg-bg px-3 py-2">
              <Ban className="mt-0.5 size-3.5 text-fg-muted" />
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => dropOn("FRAUD")}
                  className="font-display text-sm font-semibold tracking-wide"
                >
                  Not on the map
                </button>
                {compiled.cards.filter((c) => assignments[c.id] === "FRAUD").length === 0 ? (
                  <button
                    type="button"
                    onClick={() => dropOn("FRAUD")}
                    className="mt-0.5 block text-left text-xs text-fg-subtle"
                  >
                    No van at the pumps
                  </button>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {compiled.cards
                      .filter((c) => assignments[c.id] === "FRAUD")
                      .map((card) => (
                        <li key={card.id}>
                          <SeatedChip card={card} onRemove={() => unassign(card.id)} />
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border px-3 py-3">
        {status && <p className="mb-2 text-xs text-danger">{status}</p>}
        <button type="button" className="btn-solid w-full" onClick={submit}>
          File dossier
        </button>
      </div>
    </div>
  );
}

function FuelBlock({
  card,
  active,
  shake,
  onPick,
}: {
  card: CompiledCard;
  active: boolean;
  shake: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
        active ? "border-fg bg-bg-subtle" : "border-border bg-bg-elevated hover:border-border-strong"
      } ${shake ? "animate-shake" : ""}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-sm tabular-nums text-fg">FC-{card.cardNumber}</span>
        <span className="font-mono text-xs tabular-nums text-fg-muted">{formatClock(card.timeMin)}</span>
      </div>
      <div className="mt-1 text-xs text-fg-muted">{card.stationName}</div>
      <div className="mt-1 font-mono text-[11px] text-fg-subtle">
        {card.gallons.toFixed(1)} gal · ${card.dollars.toFixed(2)}
      </div>
    </button>
  );
}

function SeatedChip({ card, onRemove }: { card: CompiledCard; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-sm bg-bg px-2 py-1 font-mono text-[11px] text-fg-muted">
      FC-{card.cardNumber}
      <span className="text-fg-subtle">{formatClock(card.timeMin)}</span>
      <button
        type="button"
        className="text-fg-subtle hover:text-fg"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Remove"
      >
        ×
      </button>
    </span>
  );
}
