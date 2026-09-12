import assert from "node:assert/strict";
import { test } from "node:test";
import { readAgentConfig } from "./agentMode.ts";

test("readAgentConfig", () => {
  assert.deepEqual(readAgentConfig("?agent=1&express=1&case=03"), {
    enabled: true,
    express: true,
    caseNumber: "03",
    unlockAll: true,
  });
  assert.deepEqual(readAgentConfig("?agent=0"), {
    enabled: false,
    express: false,
    caseNumber: null,
    unlockAll: false,
  });
});
