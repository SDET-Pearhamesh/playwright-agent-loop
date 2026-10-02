/** Next sequential dashboard build number. */
export function nextBuildId(builds) {
  return builds.reduce((max, build) => Math.max(max, build.id), 0) + 1;
}

/** Builds the dashboard entry for one published run from Allure's summary.json and CI metadata. */
export function buildEntry({ id, summary, meta = {}, now = new Date() }) {
  const stats = summary?.statistic ?? {};
  const total = stats.total ?? 0;
  const passed = stats.passed ?? 0;
  return {
    id,
    publishedAt: now.toISOString(),
    total,
    passed,
    failed: stats.failed ?? 0,
    broken: stats.broken ?? 0,
    skipped: stats.skipped ?? 0,
    passRate: total === 0 ? 0 : Math.round((passed / total) * 1000) / 10,
    durationMs: summary?.time?.duration ?? 0,
    trigger: meta.trigger ?? 'local',
    runLabel: meta.runLabel ?? null,
    branch: meta.branch ?? null,
    commit: meta.commit ?? null,
    runUrl: meta.runUrl ?? null,
  };
}

/** Adds or replaces a build and keeps the list newest first. */
export function upsertBuild(builds, entry) {
  return [...builds.filter((build) => build.id !== entry.id), entry].sort((a, b) => b.id - a.id);
}

/** Reads CI metadata from GitHub Actions environment variables. */
export function metaFromEnv(env) {
  if (env.GITHUB_ACTIONS !== 'true') return { trigger: 'local' };
  const repo = env.GITHUB_REPOSITORY;
  const trigger =
    env.GITHUB_EVENT_NAME === 'schedule' ? 'nightly' : (env.GITHUB_EVENT_NAME ?? 'ci');
  return {
    trigger,
    runLabel: `${trigger} #${env.GITHUB_RUN_NUMBER ?? '?'}`,
    branch: env.GITHUB_HEAD_REF || env.GITHUB_REF_NAME || null,
    commit: env.GITHUB_SHA ? env.GITHUB_SHA.slice(0, 7) : null,
    runUrl:
      repo && env.GITHUB_RUN_ID
        ? `https://github.com/${repo}/actions/runs/${env.GITHUB_RUN_ID}`
        : null,
  };
}
