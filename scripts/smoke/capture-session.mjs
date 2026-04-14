// One-time helper: opens your real Chrome (not Playwright's bundled Chromium)
// with a dedicated profile under .auth/<role>-profile/. You sign in manually;
// the script auto-saves once Clerk lands you on /dashboard or /admin.
//
// Using real Chrome + a persistent profile avoids Google OAuth's anti-automation
// block that rejects Playwright Chromium.
//
// Usage (run from repo root, dev server must be up):
//   node scripts/smoke/capture-session.mjs admin
//   node scripts/smoke/capture-session.mjs pro
//   node scripts/smoke/capture-session.mjs client

import { chromium } from "playwright";
import { mkdirSync, existsSync } from "fs";
import { resolve } from "path";

const role = process.argv[2];
if (!role || !["admin", "pro", "client"].includes(role)) {
  console.error("Usage: node scripts/smoke/capture-session.mjs <admin|pro|client>");
  process.exit(1);
}

const profileDir = resolve(`.auth/${role}-profile`);
if (!existsSync(".auth")) mkdirSync(".auth");
if (!existsSync(profileDir)) mkdirSync(profileDir, { recursive: true });

const context = await chromium.launchPersistentContext(profileDir, {
  headless: false,
  channel: "chrome",
  viewport: null,
});

const page = context.pages()[0] ?? (await context.newPage());
await page.goto("http://localhost:3000/sign-in");

console.log(`\nReal Chrome is open with a dedicated profile for ${role.toUpperCase()}.`);
console.log("Sign in. The script auto-saves once you land on /dashboard or /admin.\n");

try {
  await page.waitForURL(/\/(dashboard|admin)(\/.*)?$/, { timeout: 300_000 });
  console.log(`✅ Signed in. Profile saved at ${profileDir}`);
  console.log(`   Future runs of run-smoke.mjs will reuse this profile automatically.`);
} catch (e) {
  console.error(`❌ Timed out waiting for sign-in (${e.message})`);
  process.exit(1);
} finally {
  await context.close();
}
