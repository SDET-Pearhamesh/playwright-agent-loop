import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';

import { buildEntry, metaFromEnv, nextBuildId, upsertBuild } from './report-lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const USAGE = `Usage: npm run report:publish -- [--results <dir>] [--zip <artifact.zip>] [--build <n>]

  --results  Allure results folder (default: allure-results)
  --zip      a downloaded GitHub Actions "allure-results" artifact (unzipped for you)
  --build    dashboard build number (default: next number)`;

function option(name) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

if (process.argv.includes('--help')) {
  process.stdout.write(`${USAGE}\n`);
  process.exit(0);
}

const site = join(root, 'report-site');
const buildsFile = join(site, 'builds.json');
const zip = option('zip');
let results = resolve(root, option('results') ?? 'allure-results');
let temp;
if (zip) {
  temp = mkdtempSync(join(tmpdir(), 'allure-'));
  execFileSync('unzip', ['-q', resolve(zip), '-d', temp]);
  results = temp;
}
if (!existsSync(results)) {
  process.stderr.write(`No results at ${results}. Run the tests first.\n`);
  process.exit(1);
}

mkdirSync(site, { recursive: true });
const builds = existsSync(buildsFile) ? JSON.parse(readFileSync(buildsFile, 'utf8')) : [];
const id = option('build') ? Number(option('build')) : nextBuildId(builds);
if (!Number.isInteger(id) || id < 1) {
  process.stderr.write('--build must be a positive whole number.\n');
  process.exit(1);
}

// Carry the previous build's history forward so Allure draws trends.
const previous = builds[0];
const previousHistory = previous && join(site, 'builds', String(previous.id), 'history');
if (previousHistory && existsSync(previousHistory)) {
  cpSync(previousHistory, join(results, 'history'), { recursive: true });
}

const target = join(site, 'builds', String(id));
execFileSync('npx', ['allure', 'generate', results, '--clean', '-o', target], {
  cwd: root,
  stdio: 'inherit',
});

const metaFile = join(results, 'build-meta.json');
const meta = existsSync(metaFile)
  ? JSON.parse(readFileSync(metaFile, 'utf8'))
  : metaFromEnv(process.env);
const summary = JSON.parse(readFileSync(join(target, 'widgets', 'summary.json'), 'utf8'));
const entry = buildEntry({ id, summary, meta });
writeFileSync(buildsFile, `${JSON.stringify(upsertBuild(builds, entry), null, 2)}\n`);
if (temp) rmSync(temp, { recursive: true, force: true });

process.stdout.write(
  `Published build ${String(id)}: ${String(entry.passed)}/${String(entry.total)} passed (${String(entry.passRate)}%).\n` +
    'Dashboard: npm run dashboard:up, then open http://localhost:8088\n',
);
