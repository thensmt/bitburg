// Headless smoke test using captured sessions in .auth/<role>-profile/.
// Launches real Chrome (channel: "chrome") with each role's persistent profile.
//
// Usage:  node scripts/smoke/run-smoke.mjs

import { chromium } from "playwright";
import { existsSync } from "fs";
import { resolve } from "path";

const BASE = "http://localhost:3000";

const results = [];
function record(label, expected, actual, pass) {
  results.push({ label, pass });
  const icon = pass ? "✅" : "❌";
  console.log(`${icon} ${label}`);
  if (!pass) console.log(`     expected: ${expected}\n     actual:   ${actual}`);
}

async function checkRedirect(page, path, expectedPathSubstring, label) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  const finalUrl = page.url();
  const pass = finalUrl.includes(expectedPathSubstring);
  record(label, `url contains "${expectedPathSubstring}"`, finalUrl, pass);
}

async function runRole(role, tests) {
  const profileDir = resolve(`.auth/${role}-profile`);
  if (!existsSync(profileDir)) {
    console.log(`\n⚠️  Skipping ${role} — profile missing. Run: node scripts/smoke/capture-session.mjs ${role}`);
    return;
  }
  console.log(`\n=== ${role.toUpperCase()} ===`);
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: true,
    channel: "chrome",
  });
  const page = context.pages()[0] ?? (await context.newPage());
  try { await tests(page); }
  finally { await context.close(); }
}

// --- ADMIN ---
await runRole("admin", async (page) => {
  await checkRedirect(page, "/dashboard", "/admin", "admin hitting /dashboard is redirected to /admin");
  await checkRedirect(page, "/admin", "/admin", "admin can load /admin");
  await checkRedirect(page, "/jobs/new", "/dashboard", "admin hitting /jobs/new is redirected (not CLIENT)");
  await checkRedirect(page, "/apply", "/dashboard", "admin hitting /apply is redirected (not PRO)");
  await checkRedirect(page, "/onboarding", "/dashboard", "admin hitting /onboarding is bounced (already onboarded)");
});

// --- PRO ---
await runRole("pro", async (page) => {
  await checkRedirect(page, "/dashboard", "/dashboard", "pro loads /dashboard");
  await checkRedirect(page, "/jobs/new", "/dashboard", "pro hitting /jobs/new is redirected (not CLIENT)");
  await checkRedirect(page, "/admin", "/dashboard", "pro hitting /admin is redirected (not ADMIN)");
  await checkRedirect(page, "/onboarding", "/dashboard", "pro hitting /onboarding is bounced");
  await checkRedirect(page, "/apply", "/apply", "pro can load /apply");
});

// --- CLIENT ---
await runRole("client", async (page) => {
  await checkRedirect(page, "/dashboard", "/dashboard", "client loads /dashboard");
  await checkRedirect(page, "/jobs/new", "/jobs/new", "client can load /jobs/new");
  await checkRedirect(page, "/admin", "/dashboard", "client hitting /admin is redirected");
  await checkRedirect(page, "/apply", "/dashboard", "client hitting /apply is redirected (not PRO)");
  await checkRedirect(page, "/onboarding", "/dashboard", "client hitting /onboarding is bounced");
});

const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} passed` + (failed ? `, ${failed} FAILED` : ""));
process.exit(failed ? 1 : 0);
