import { useEffect } from "react";
import { AgentAssignBar } from "./AgentAssignBar";
import { handleAgentKeydown } from "./agentKeyboard";
import { mountAgentBridge, signalAgentReady } from "./agentBridge";
import { CardBoard } from "./CardBoard";
import { GpsTerminal } from "./GpsTerminal";
import { Timeline, TopBar } from "./Hud";
import { MapCanvas } from "./MapCanvas";
import { PumpGlance } from "./PumpGlance";
import { BriefScreen, DebriefScreen, TitleScreen } from "./Screens";
import { useGame } from "./store";

export function GameApp() {
  const screen = useGame((s) => s.screen);
  const boot = useGame((s) => s.boot);
  const compiled = useGame((s) => s.compiled);
  useEffect(() => {
    mountAgentBridge();
    boot();
    signalAgentReady();
  }, [boot]);

  useEffect(() => {
    window.addEventListener("keydown", handleAgentKeydown);
    return () => window.removeEventListener("keydown", handleAgentKeydown);
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
          <PumpGlance />
          <Timeline />
        </div>
        <aside className="flex h-[48%] min-h-0 flex-col border-t border-border bg-bg-elevated lg:h-auto lg:w-[380px] lg:border-l lg:border-t-0 xl:w-[400px]">
          <AgentAssignBar />
          <GpsTerminal />
          <CardBoard />
        </aside>
      </div>
    </div>
  );
}
