import {
  Fuel,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useGame } from "./store";
import { formatClock } from "./world";

export function TopBar() {
  const compiled = useGame((s) => s.compiled);
  const time = useGame((s) => s.time);
  const playing = useGame((s) => s.playing);
  const speed = useGame((s) => s.speed);
  const muted = useGame((s) => s.muted);
  const assigned = useGame((s) => Object.values(s.assignments).filter(Boolean).length);
  const total = compiled?.cards.length ?? 0;
  const goTitle = useGame((s) => s.goTitle);
  const setPlaying = useGame((s) => s.setPlaying);
  const cycleSpeed = useGame((s) => s.cycleSpeed);
  const setTime = useGame((s) => s.setTime);
  const toggleMute = useGame((s) => s.toggleMute);

  if (!compiled) return null;

  return (
    <header className="flex items-center gap-3 border-b border-border bg-bg-elevated px-3 py-2 sm:px-4">
      <button
        type="button"
        onClick={goTitle}
        className="font-display text-lg font-semibold tracking-display text-fg"
      >
        GHOST MILES
      </button>
      <span className="hidden text-xs text-fg-subtle sm:inline">
        CASE {compiled.def.number} · {compiled.def.title}
      </span>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="flex items-center gap-1.5 font-mono text-xs text-fg-muted">
          <Fuel className="size-3.5" strokeWidth={1.75} />
          {assigned}/{total}
        </span>
        <span className="font-mono text-sm tabular-nums text-fg">{formatClock(time)}</span>
        <div className="flex items-center gap-1">
          <IconBtn
            label="Rewind"
            onClick={() => setTime(compiled.def.startMin)}
          >
            <SkipBack className="size-4" />
          </IconBtn>
          <IconBtn
            label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </IconBtn>
          <button
            type="button"
            onClick={cycleSpeed}
            className="h-11 min-w-11 rounded-sm px-2 font-mono text-xs text-fg-muted hover:bg-bg-subtle hover:text-fg"
          >
            {speed}x
          </button>
          <IconBtn label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </IconBtn>
          <IconBtn label="Reset clock" onClick={() => setTime(compiled.def.startMin)}>
            <RotateCcw className="size-4" />
          </IconBtn>
        </div>
      </div>
    </header>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-sm text-fg-muted hover:bg-bg-subtle hover:text-fg"
    >
      {children}
    </button>
  );
}

export function Timeline() {
  const compiled = useGame((s) => s.compiled);
  const time = useGame((s) => s.time);
  const setTime = useGame((s) => s.setTime);
  const selectedCardId = useGame((s) => s.selectedCardId);
  const gpsFrom = useGame((s) => s.gpsFrom);
  const gpsTo = useGame((s) => s.gpsTo);

  if (!compiled) return null;
  const start = compiled.def.startMin;
  const end = compiled.def.endMin;
  const span = Math.max(1, end - start);
  const pct = ((time - start) / span) * 100;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
      <div className="pointer-events-auto rounded-lg border border-border bg-bg-elevated/92 px-3 py-2 shadow-soft">
        <input
          type="range"
          min={start}
          max={end}
          step={0.5}
          value={time}
          aria-label="Timeline"
          onChange={(e) => setTime(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="relative mt-1 h-3">
          {compiled.cards.map((card) => {
            const left = ((card.timeMin - start) / span) * 100;
            const active = card.id === selectedCardId;
            return (
              <button
                key={card.id}
                type="button"
                title={`${card.cardNumber} ${formatClock(card.timeMin)}`}
                onClick={() => useGame.getState().selectCard(card.id)}
                className="absolute top-0 size-3 -translate-x-1/2 rounded-full border border-bg-elevated"
                style={{
                  left: `${left}%`,
                  background: active ? "var(--color-fg)" : "var(--color-accent)",
                }}
              />
            );
          })}
          {gpsFrom != null && (
            <span
              className="absolute top-0 h-3 w-px bg-fg-muted"
              style={{ left: `${((gpsFrom - start) / span) * 100}%` }}
            />
          )}
          {gpsTo != null && (
            <span
              className="absolute top-0 h-3 w-px bg-fg-muted"
              style={{ left: `${((gpsTo - start) / span) * 100}%` }}
            />
          )}
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] text-fg-subtle">
          <span>{formatClock(start)}</span>
          <span className="tabular-nums text-fg-muted">{Math.round(pct)}%</span>
          <span>{formatClock(end)}</span>
        </div>
      </div>
    </div>
  );
}
