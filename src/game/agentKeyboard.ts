import { VAN_KEYS, type AgentConfig } from "./agentMode";
import { CASES } from "./cases";
import { useGame } from "./store";

function isTypingTarget(target: EventTarget | null): boolean {
  const tag = (target as HTMLElement | null)?.tagName;
  return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
}

function caseIndexForNumber(num: string) {
  return CASES.findIndex((c) => c.number === num);
}

function primaryAction(screen: string, agent: AgentConfig) {
  const s = useGame.getState();
  if (screen === "title") {
    const idx = s.agent.caseNumber
      ? caseIndexForNumber(s.agent.caseNumber)
      : CASES.findIndex((c, i) => i === 0 || s.completed.includes(CASES[i - 1].id));
    s.openBrief(idx >= 0 ? idx : 0);
    if (agent.express) s.startCase();
    return;
  }
  if (screen === "brief") {
    s.startCase();
    return;
  }
  if (screen === "debrief") {
    s.nextCase();
    return;
  }
  if (screen === "play") {
    s.submit();
  }
}

export function handleAgentKeydown(e: KeyboardEvent) {
  if (isTypingTarget(e.target)) return;

  const s = useGame.getState();
  const { screen, agent, compiled } = s;

  if (e.code === "Enter" && !e.shiftKey) {
    e.preventDefault();
    primaryAction(screen, agent);
    return;
  }

  if (agent.enabled && e.code === "Escape") {
    e.preventDefault();
    if (screen === "brief") s.skipBrief();
    else if (screen === "debrief") s.skipDebrief();
    return;
  }

  if (screen !== "play" || !compiled) return;

  if (e.code === "Space") {
    e.preventDefault();
    s.setPlaying(!s.playing);
    return;
  }
  if (e.code === "ArrowRight") {
    e.preventDefault();
    s.setTime(s.time + 5);
    return;
  }
  if (e.code === "ArrowLeft") {
    e.preventDefault();
    s.setTime(s.time - 5);
    return;
  }
  if (e.key === "s" || e.key === "S") {
    e.preventDefault();
    s.cycleSpeed();
    return;
  }

  if (agent.enabled && e.key === "[") {
    e.preventDefault();
    s.selectPrevUnassigned();
    return;
  }
  if (agent.enabled && e.key === "]") {
    e.preventDefault();
    s.selectNextUnassigned();
    return;
  }

  const digit = e.key >= "1" && e.key <= "9" ? Number(e.key) - 1 : -1;
  if (digit >= 0) {
    e.preventDefault();
    s.selectCardByIndex(digit);
    return;
  }

  const van = VAN_KEYS[e.key.toLowerCase()];
  if (van && compiled.cars.some((c) => c.id === van)) {
    e.preventDefault();
    s.assignSelected(van);
    return;
  }

  if ((e.key === "f" || e.key === "F" || e.key === "n" || e.key === "N") && compiled.def.allowFraud) {
    e.preventDefault();
    s.assignSelected("FRAUD");
  }
}
