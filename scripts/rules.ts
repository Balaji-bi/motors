/**
 * Firestore rules tooling.
 *
 *   npx tsx scripts/rules.ts pull     → writes the live ruleset to firestore.rules.live
 *   npx tsx scripts/rules.ts deploy   → publishes firestore.rules to the project
 *
 * Deploying replaces the ruleset for the WHOLE project, which also serves the
 * Driving School demo — so firestore.rules must always contain that app's rules
 * verbatim plus the Tamil Motors section.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { GoogleAuth } from 'google-auth-library';

loadEnv({ path: '.env.local' });

const RULES_FILE = 'firestore.rules';

function serviceAccount() {
  const keyPath = process.env.FIREBASE_ADMIN_CREDENTIALS!;
  return JSON.parse(readFileSync(resolve(keyPath), 'utf8')) as { project_id: string };
}

async function client() {
  const sa = serviceAccount();
  const auth = new GoogleAuth({
    credentials: sa as never,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  return { api: await auth.getClient(), project: sa.project_id };
}

async function currentRulesetName(api: Awaited<ReturnType<typeof client>>['api'], project: string) {
  const res = await api.request<{ releases?: { name: string; rulesetName: string }[] }>({
    url: `https://firebaserules.googleapis.com/v1/projects/${project}/releases`,
  });
  const release = (res.data.releases ?? []).find((r) => r.name.endsWith('cloud.firestore'));
  if (!release) throw new Error('No cloud.firestore release found on this project.');
  return release.rulesetName;
}

async function pull() {
  const { api, project } = await client();
  const name = await currentRulesetName(api, project);
  const res = await api.request<{ source: { files: { name: string; content: string }[] } }>({
    url: `https://firebaserules.googleapis.com/v1/${name}`,
  });
  const content = res.data.source.files[0].content;
  writeFileSync('firestore.rules.live', content, 'utf8');
  console.log(`Pulled ${name}`);
  console.log(`Wrote firestore.rules.live (${content.length} bytes)`);
}

async function deploy() {
  const { api, project } = await client();
  const content = readFileSync(RULES_FILE, 'utf8');

  // 1. Create the ruleset (this also compiles/validates it server-side).
  const created = await api.request<{ name: string }>({
    url: `https://firebaserules.googleapis.com/v1/projects/${project}/rulesets`,
    method: 'POST',
    data: { source: { files: [{ name: 'firestore.rules', content }] } },
  });
  console.log(`Created ruleset ${created.data.name}`);

  // 2. Point the cloud.firestore release at it.
  await api.request({
    url: `https://firebaserules.googleapis.com/v1/projects/${project}/releases/cloud.firestore`,
    method: 'PATCH',
    data: { release: { name: `projects/${project}/releases/cloud.firestore`, rulesetName: created.data.name } },
  });
  console.log('Released to cloud.firestore. Rules are live.');
}

const cmd = process.argv[2];
const run = cmd === 'pull' ? pull : cmd === 'deploy' ? deploy : null;
if (!run) { console.error('Usage: rules.ts pull | deploy'); process.exit(1); }
run().catch((e) => {
  const err = e as { message?: string; response?: { data?: unknown } };
  console.error('Failed:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
