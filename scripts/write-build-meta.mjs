import { mkdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';

import { metaFromEnv } from './report-lib.mjs';

// Run in CI after the tests so the published build knows which run it came from.
mkdirSync('allure-results', { recursive: true });
writeFileSync('allure-results/build-meta.json', `${JSON.stringify(metaFromEnv(process.env))}\n`);
