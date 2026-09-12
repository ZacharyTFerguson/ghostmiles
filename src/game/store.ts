import { create } from "zustand";
import { readAgentConfig, type AgentConfig } from "./agentMode";
import { sfxAssign, sfxClick, sfxError, sfxSuccess, sfxWhoosh, setMuted, unlockAudio } from "./audio";
import { CASES } from "./cases";
import { loadSave, markCompleted, writeSave } from "./save";
import { compileCase, milesInRange } from "./sim";
import type {
  AssignmentTarget,
  CompiledCase,
  GpsQuery,
  Screen,
} from "./types";
import { MINUTES_PER_REAL_SEC } from "./world";

const SPEEDS = [1, 4, 12] as const;

type GameState = {
  screen: Screen;
  caseIndex: number;
  compiled: CompiledCase | null;
  time: number;
  playing: boolean;
  speed: number;
  selectedCardId: string | null;
  selectedCarId: string | null;
  assignments: Record<string, AssignmentTarget | null>;
  gpsFrom: number | null;
  gpsTo: number | null;
  lastQuery: GpsQuery | null;
  shakeIds: string[];
  status: string | null;
  completed: string[];
  muted: boolean;
  wrongCount: number;
  agent: AgentConfig;
};

type GameActions = {
  boot: () => void;
  goTitle: () => void;
  openBrief: (index: number) => void;
  startCase: () => void;
  setPlaying: (v: boolean) => void;
  cycleSpeed: () => void;
  setTime: (t: number) => void;
  advance: (dt: number) => void;
  selectCard: (id: string | null) => void;
  selectCar: (id: string | null) => void;
  assign: (cardId: string, target: AssignmentTarget) => void;
  unassign: (cardId: string) => void;
  markGpsFrom: () => void;
  markGpsTo: () => void;
  runQuery: (carId: string | "ALL") => void;
  submit: () => void;
  nextCase: () => void;
  skipBrief: () => void;
  skipDebrief: () => void;
  assignSelected: (target: AssignmentTarget) => void;
  selectCardByIndex: (index: number) => void;
  selectNextUnassigned: () => string | null;
  selectPrevUnassigned: () => string | null;
  startPlayAt: (index: number) => void;
  toggleMute: () => void;
  setStatus: (s: string | null) => void;
};

function unassignedIds(compiled: CompiledCase, assignments: Record<string, AssignmentTarget | null>) {
  return compiled.cards.filter((c) => !assignments[c.id]).map((c) => c.id);
}

function emptyAssign(compiled: CompiledCase): Record<string, AssignmentTarget | null> {
  const a: Record<string, AssignmentTarget | null> = {};
  for (const c of compiled.cards) a[c.id] = null;
  return a;
}

function clampTime(t: number, compiled: CompiledCase | null) {
  if (!compiled) return t;
  return Math.min(compiled.def.endMin, Math.max(compiled.def.startMin, t));
}

export const useGame = create<GameState & GameActions>((set, get) => ({
  screen: "title",
  caseIndex: 0,
  compiled: compileCase(CASES[0]),
  time: CASES[0].startMin,
  playing: true,
  speed: 4,
  selectedCardId: null,
  selectedCarId: null,
  assignments: {},
  gpsFrom: null,
  gpsTo: null,
  lastQuery: null,
  shakeIds: [],
  status: null,
  completed: [],
  muted: false,
  wrongCount: 0,
  agent: readAgentConfig(),

  boot: () => {
    const agent = readAgentConfig();
    const save = loadSave();
    const muted = agent.enabled ? true : save.muted;
    setMuted(muted);
    const compiled = compileCase(CASES[0]);
    set({
      completed: save.completed,
      muted,
      compiled,
      time: compiled.def.startMin,
      playing: !agent.caseNumber,
      screen: "title",
      agent,
    });

    if (agent.caseNumber) {
      const idx = CASES.findIndex((c) => c.number === agent.caseNumber);
      if (idx >= 0) get().startPlayAt(idx);
    }
  },

  goTitle: () => {
    const compiled = compileCase(CASES[0]);
    set({
      screen: "title",
      compiled,
      time: compiled.def.startMin,
      playing: true,
      selectedCardId: null,
      selectedCarId: null,
      lastQuery: null,
      status: null,
      shakeIds: [],
    });
  },

  openBrief: (index) => {
    unlockAudio();
    sfxClick();
    const compiled = compileCase(CASES[index]);
    set({
      screen: "brief",
      caseIndex: index,
      compiled,
      time: compiled.def.startMin,
      playing: false,
      assignments: emptyAssign(compiled),
      selectedCardId: null,
      selectedCarId: null,
      gpsFrom: compiled.def.startMin,
      gpsTo: compiled.def.startMin + 20,
      lastQuery: null,
      shakeIds: [],
      status: null,
      wrongCount: 0,
    });
  },

  startCase: () => {
    unlockAudio();
    sfxClick();
    const { compiled, agent } = get();
    if (!compiled) return;
    const firstId = unassignedIds(compiled, get().assignments)[0] ?? null;
    const firstCard = firstId ? compiled.cards.find((c) => c.id === firstId) : null;
    set({
      screen: "play",
      time: firstCard?.timeMin ?? compiled.def.startMin,
      playing: false,
      speed: agent.enabled ? 12 : 4,
      selectedCardId: agent.enabled ? firstId : get().selectedCardId,
    });
  },

  skipBrief: () => get().startCase(),

  skipDebrief: () => get().nextCase(),

  startPlayAt: (index) => {
    get().openBrief(index);
    get().startCase();
  },

  assignSelected: (target) => {
    const { selectedCardId } = get();
    if (!selectedCardId) return;
    get().assign(selectedCardId, target);
  },

  selectCardByIndex: (index) => {
    const { compiled } = get();
    if (!compiled) return;
    const ids = unassignedIds(compiled, get().assignments);
    const id = ids[index];
    if (id) get().selectCard(id);
  },

  selectNextUnassigned: () => {
    const { compiled, assignments, selectedCardId } = get();
    if (!compiled) return null;
    const ids = unassignedIds(compiled, assignments);
    if (!ids.length) return null;
    const idx = selectedCardId ? ids.indexOf(selectedCardId) : -1;
    const next = ids[(idx + 1) % ids.length];
    get().selectCard(next);
    return next;
  },

  selectPrevUnassigned: () => {
    const { compiled, assignments, selectedCardId } = get();
    if (!compiled) return null;
    const ids = unassignedIds(compiled, assignments);
    if (!ids.length) return null;
    const idx = selectedCardId ? ids.indexOf(selectedCardId) : 0;
    const prev = ids[(idx - 1 + ids.length) % ids.length];
    get().selectCard(prev);
    return prev;
  },

  setPlaying: (v) => set({ playing: v }),

  cycleSpeed: () => {
    const { speed } = get();
    const i = SPEEDS.indexOf(speed as (typeof SPEEDS)[number]);
    const next = SPEEDS[(i + 1) % SPEEDS.length];
    set({ speed: next, playing: true });
  },

  setTime: (t) => {
    set({ time: clampTime(t, get().compiled), playing: false });
  },

  advance: (dt) => {
    const s = get();
    if (!s.playing || !s.compiled) return;
    const next = s.time + dt * s.speed * MINUTES_PER_REAL_SEC;
    if (s.screen === "title") {
      const span = s.compiled.def.endMin - s.compiled.def.startMin;
      const wrapped =
        s.compiled.def.startMin +
        ((((next - s.compiled.def.startMin) % span) + span) % span);
      set({ time: wrapped });
      return;
    }
    if (next >= s.compiled.def.endMin) {
      set({ time: s.compiled.def.endMin, playing: false });
      return;
    }
    set({ time: next });
  },

  selectCard: (id) => {
    const { compiled } = get();
    if (!compiled || !id) {
      set({ selectedCardId: id });
      return;
    }
    const card = compiled.cards.find((c) => c.id === id);
    sfxClick();
    set({
      selectedCardId: id,
      time: card ? card.timeMin : get().time,
      playing: false,
    });
  },

  selectCar: (id) => set({ selectedCarId: id }),

  assign: (cardId, target) => {
    const s = get();
    const card = s.compiled?.cards.find((c) => c.id === cardId);
    sfxAssign();
    const nextAssignments = { ...s.assignments, [cardId]: target };
    const remaining = s.compiled ? unassignedIds(s.compiled, nextAssignments) : [];
    const nextId = s.agent.enabled && remaining.length ? remaining[0] : null;
    const nextCard = nextId ? s.compiled?.cards.find((c) => c.id === nextId) : null;
    set({
      assignments: nextAssignments,
      selectedCardId: nextId,
      time: nextCard?.timeMin ?? (card ? card.timeMin : s.time),
      playing: false,
      shakeIds: s.shakeIds.filter((x) => x !== cardId),
      status: null,
    });
  },

  unassign: (cardId) => {
    sfxClick();
    set((s) => ({
      assignments: { ...s.assignments, [cardId]: null },
    }));
  },

  markGpsFrom: () => set({ gpsFrom: Math.round(get().time) }),
  markGpsTo: () => set({ gpsTo: Math.round(get().time) }),

  runQuery: (carId) => {
    const { compiled, gpsFrom, gpsTo } = get();
    if (!compiled || gpsFrom == null || gpsTo == null) return;
    sfxWhoosh();
    const t0 = Math.min(gpsFrom, gpsTo);
    const t1 = Math.max(gpsFrom, gpsTo);
    const cars = carId === "ALL" ? compiled.cars : compiled.cars.filter((c) => c.id === carId);
    const rows = cars.map((c) => ({
      carId: c.id,
      callsign: c.callsign,
      miles: milesInRange(c, t0, t1),
    }));
    set({ lastQuery: { t0, t1, rows } });
  },

  submit: () => {
    const { compiled, assignments } = get();
    if (!compiled) return;
    const missing = compiled.cards.filter((c) => !assignments[c.id]);
    if (missing.length) {
      sfxError();
      set({
        status: `${missing.length} block${missing.length > 1 ? "s" : ""} still unassigned.`,
        shakeIds: missing.map((c) => c.id),
      });
      return;
    }
    const wrong = compiled.cards.filter((c) => assignments[c.id] !== c.answer);
    if (wrong.length) {
      sfxError();
      set({
        wrongCount: get().wrongCount + 1,
        status:
          wrong.length === 1
            ? "One assignment does not hold. Check the clock."
            : `${wrong.length} assignments do not hold. Watch the pumps again.`,
        shakeIds: wrong.map((c) => c.id),
      });
      return;
    }
    sfxSuccess();
    const next = markCompleted(compiled.def.id);
    const { caseIndex, agent } = get();
    if (agent.express && caseIndex + 1 < CASES.length) {
      set({
        completed: next.completed,
        playing: false,
        status: null,
        shakeIds: [],
      });
      get().startPlayAt(caseIndex + 1);
      return;
    }
    set({
      screen: "debrief",
      completed: next.completed,
      playing: false,
      status: null,
      shakeIds: [],
    });
  },

  nextCase: () => {
    const { caseIndex, agent } = get();
    if (caseIndex + 1 < CASES.length) {
      if (agent.express) get().startPlayAt(caseIndex + 1);
      else get().openBrief(caseIndex + 1);
    } else get().goTitle();
  },

  toggleMute: () => {
    const muted = !get().muted;
    setMuted(muted);
    writeSave({ version: 1, completed: get().completed, muted });
    set({ muted });
  },

  setStatus: (status) => set({ status }),
}));
