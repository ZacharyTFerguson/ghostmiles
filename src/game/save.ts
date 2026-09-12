const KEY = "ghost-miles-save-v1";
const SAVE_VERSION = 1;

export type SaveData = {
  version: number;
  completed: string[];
  muted: boolean;
};

const defaults: SaveData = { version: SAVE_VERSION, completed: [], muted: false };

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults, completed: [] };
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      version: SAVE_VERSION,
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((x) => typeof x === "string") : [],
      muted: Boolean(parsed.muted),
    };
  } catch {
    return { ...defaults, completed: [] };
  }
}

export function writeSave(data: SaveData) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, version: SAVE_VERSION }));
  } catch {
    // private mode / quota
  }
}

export function markCompleted(id: string) {
  const s = loadSave();
  if (!s.completed.includes(id)) s.completed.push(id);
  writeSave(s);
  return s;
}
