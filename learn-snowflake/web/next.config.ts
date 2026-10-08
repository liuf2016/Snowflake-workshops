import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // A stray package-lock.json above this repo can make Turbopack infer the workspace
  // root one level too high (same issue as ../claw-support/web) — pin it explicitly.
  turbopack: {
    root: path.join(__dirname),
  },
  // Don't auto-generate web/AGENTS.md + web/CLAUDE.md — this repo already has its own
  // hand-written CLAUDE.md at the repo root, which is what the Dev Docs viewer serves.
  agentRules: false,
};

export default nextConfig;
