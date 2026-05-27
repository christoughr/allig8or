#!/usr/bin/env node
/**
 * Regression smoke: JSON parse + file/html output per tool.
 * Usage:
 *   node scripts/smoke-generate.mjs
 *   BASE_URL=http://localhost:3000 node scripts/smoke-generate.mjs
 *   SMOKE_TOOLS=website,pdf node scripts/smoke-generate.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const prompts = JSON.parse(
  readFileSync(join(__dirname, '../tests/regression-prompts.json'), 'utf8')
);

const toolsFilter = process.env.SMOKE_TOOLS?.split(',').map((t) => t.trim());

let failed = 0;
let passed = 0;

async function smokeTool(tool, prompt) {
  const label = `[${tool}] ${prompt.slice(0, 48)}…`;
  try {
    const res = await fetch(`${BASE}/api/generate/${tool}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history: [] }),
    });
    const raw = await res.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      const snippet = raw.replace(/\s+/g, ' ').slice(0, 120);
      console.error(`✗ ${label} — HTTP ${res.status}, non-JSON: ${snippet}`);
      failed++;
      return;
    }
    if (!res.ok) {
      console.error(`✗ ${label} — HTTP ${res.status}: ${data.error ?? 'unknown'}`);
      failed++;
      return;
    }
    if (tool === 'website' || tool === 'pdf') {
      if (!data.html || typeof data.html !== 'string' || data.html.length < 100) {
        console.error(`✗ ${label} — missing/short html`);
        failed++;
        return;
      }
    } else if (!data.fileUrl || typeof data.fileUrl !== 'string') {
      console.error(`✗ ${label} — missing fileUrl`);
      failed++;
      return;
    }
    console.log(`✓ ${label}`);
    passed++;
  } catch (e) {
    console.error(`✗ ${label} — ${e.message}`);
    failed++;
  }
}

const tools = toolsFilter ?? Object.keys(prompts);

console.log(`Smoke generate @ ${BASE}`);
for (const tool of tools) {
  const list = prompts[tool];
  if (!list?.length) continue;
  // One prompt per tool for CI speed; set SMOKE_FULL=1 for all
  const subset = process.env.SMOKE_FULL === '1' ? list : [list[0]];
  for (const prompt of subset) {
    await smokeTool(tool, prompt);
  }
}

console.log(`\nDone: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
