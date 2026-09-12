import { useEffect } from "react";
import { CardBoard } from "./CardBoard";
import { GpsTerminal } from "./GpsTerminal";
import { Timeline, TopBar } from "./Hud";
import { MapCanvas } from "./MapCanvas";
import { BriefScreen, DebriefScreen, TitleScreen } from "./Screens";
import { useGame } from "./store";

export function GameApp() {
  const screen = useGame((s) => s.screen);
  const boot = useGame((s) => s.boot);
  const compiled = useGame((s) => s.compiled);

  useEffect(() => {
    boot();
  }, [boot]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (useGame.getState().screen !== "play") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      const s = useGame.getState();
      if (e.code === "Space") {
        e.preventDefault();
        s.setPlaying(!s.playing);
      } else if (e.code === "ArrowRight") {
        s.setTime(s.time + 5);
      } else if (e.code === "ArrowLeft") {
        s.setTime(s.time - 5);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!compiled) {
    return <div className="grid h-dvh place-items-center bg-bg text-fg-muted">Loading yard…</div>;
  }

  if (screen === "title") return <TitleScreen />;
  if (screen === "brief") return <BriefScreen />;
  if (screen === "debrief") return <DebriefScreen />;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg text-fg">
      <TopBar />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-0 flex-[1.15]">
          <MapCanvas />
          <Timeline />
        </div>
        <aside className="flex h-[48%] min-h-0 flex-col border-t border-border bg-bg-elevated lg:h-auto lg:w-[380px] lg:border-l lg:border-t-0 xl:w-[400px]">
          <GpsTerminal />
          <CardBoard />
        </aside>
      </div>
    </div>
  );
}
