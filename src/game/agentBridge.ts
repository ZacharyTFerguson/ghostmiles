import { readAgentConfig, type GhostMilesWindowApi } from "./agentMode";
import { useGame } from "./store";

export function mountAgentBridge() {
  if (typeof window === "undefined") return;

  const agent = readAgentConfig();
  const api: GhostMilesWindowApi = {
    ready: false,
    agent,
    getState: () => useGame.getState(),
    getPhase: () => {
      const s = useGame.getState();
      const unassigned = s.compiled
        ? s.compiled.cards.filter((c) => !s.assignments[c.id]).map((c) => c.id)
        : [];
      return {
        screen: s.screen,
        caseIndex: s.caseIndex,
        caseNumber: s.compiled?.def.number ?? null,
        caseId: s.compiled?.def.id ?? null,
        unassignedCardIds: unassigned,
        allowFraud: s.compiled?.def.allowFraud ?? false,
      };
    },
    selectCard: (id) => useGame.getState().selectCard(id),
    assign: (cardId, target) => useGame.getState().assign(cardId, target as import("./types").AssignmentTarget),
    assignSelected: (target) =>
      useGame.getState().assignSelected(target as import("./types").AssignmentTarget),
    submit: () => useGame.getState().submit(),
    startCase: (index) => {
      const s = useGame.getState();
      if (index != null) s.startPlayAt(index);
      else s.startCase();
    },
    skipBrief: () => useGame.getState().skipBrief(),
    skipDebrief: () => useGame.getState().skipDebrief(),
  };

  window.__ghostMiles = api;
}

export function signalAgentReady() {
  if (typeof window === "undefined" || !window.__ghostMiles) return;
  window.__ghostMiles.ready = true;
  window.dispatchEvent(new CustomEvent("ghostmiles:ready"));
}
