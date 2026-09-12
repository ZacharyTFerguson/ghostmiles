/** Agent / automation mode — opt-in via URL (?agent=1). Does not change puzzle answers. */

export type AgentConfig = {
  enabled: boolean;
  /** Skip brief/debrief chrome; chain cases on successful submit. */
  express: boolean;
  /** Jump straight to play for this case number ("01"–"05"), skipping title/brief. */
  caseNumber: string | null;
  /** Unlock all cases on the title screen (practice / race restarts). */
  unlockAll: boolean;
};

function readParam(search: string, key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(search).get(key);
}

function parseCaseNumber(raw: string | null): string | null {
  if (!raw) return null;
  const n = raw.padStart(2, "0");
  return /^0[1-5]$/.test(n) ? n : null;
}

export function readAgentConfig(search = typeof window !== "undefined" ? window.location.search : ""): AgentConfig {
  const agent = readParam(search, "agent");
  const speed = readParam(search, "speed");
  const enabled = agent === "1" || agent === "true" || speed === "agent";

  return {
    enabled,
    express: enabled && (readParam(search, "express") === "1" || readParam(search, "express") === "true"),
    caseNumber: enabled ? parseCaseNumber(readParam(search, "case")) : null,
    unlockAll: enabled,
  };
}

/** Van callsign → car id shortcuts for keyboard assign. */
export const VAN_KEYS: Record<string, string> = {
  a: "alpha",
  b: "bravo",
  c: "charlie",
  d: "delta",
};

export type GhostMilesWindowApi = {
  ready: boolean;
  agent: AgentConfig;
  getState: () => ReturnType<typeof import("./store").useGame.getState>;
  getPhase: () => {
    screen: string;
    caseIndex: number;
    caseNumber: string | null;
    caseId: string | null;
    unassignedCardIds: string[];
    allowFraud: boolean;
  };
  selectCard: (id: string) => void;
  assign: (cardId: string, target: string) => void;
  assignSelected: (target: string) => void;
  submit: () => void;
  startCase: (index?: number) => void;
  skipBrief: () => void;
  skipDebrief: () => void;
};

declare global {
  interface Window {
    __ghostMiles?: GhostMilesWindowApi;
  }
}
