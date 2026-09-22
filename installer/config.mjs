export const SKILL_SOURCE = "minfengyuan/harness-knowledge-base";

export const SKILL_EXCEPTIONS = Object.freeze({
  "dev-mode": Object.freeze({ agents: ["codex"], adapter: "codex-subagents" }),
  "optimize-astra-instructions": Object.freeze({ agents: ["codex"] }),
});

export function enrichSkill(skill) {
  return { ...skill, ...(SKILL_EXCEPTIONS[skill.name] ?? {}) };
}
