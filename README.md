# 🎭 PW-AI-Framework

> ## 🚧 WORK IN PROGRESS 🚧
> **This project is under active development. Nothing here is final.**
> Folders, scripts, and workflows mentioned below are **planned**, not necessarily built yet.
> Check the [Progress Tracker](#-progress-tracker) to see what is actually done.
> Commits land daily. Expect frequent changes.

![status](https://img.shields.io/badge/status-work%20in%20progress-orange)
![playwright](https://img.shields.io/badge/Playwright-TypeScript-45ba4b)
![ci](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF)
![docker](https://img.shields.io/badge/Docker-planned-2496ED)

An AI-assisted, end-to-end test automation framework built with **Playwright + TypeScript + Docker + GitHub Actions + Playwright MCP + GitHub Copilot agents**.

**Goal:** mimic a real project workflow. A "JIRA-style" task file goes in, and tests, reports, and fixes come out. Humans only **review**.

**Application under test:** [LambdaTest Selenium Playground](https://www.lambdatest.com/selenium-playground/)

---

## 🎯 What we plan to build

| # | Feature | Status |
|---|---------|--------|
| 1 | Playwright + TypeScript framework (no BDD / Cucumber) | 🔜 Planned |
| 2 | Page Object Model with **2 files per page**: `XPage.ts` (locators + actions) and `XPage.assertions.ts` (assertions only) | 🔜 Planned |
| 3 | Strict ESLint + Prettier + Husky + commit conventions | 🔜 Planned |
| 4 | Playwright **Planner → Generator → Healer** agents | 🔜 Planned |
| 5 | JIRA-style task intake: drop a `.md` file in `jira-tasks/` and the automation picks it up | 🔜 Planned |
| 6 | Custom AI agents: code reviewer, README updater, nightly bug analyst | 🔜 Planned |
| 7 | GitHub Actions: PR checks, nightly runs, auto issue creation on failure | 🔜 Planned |
| 8 | Allure reports + custom dashboard (latest run + last 50 runs) | 🔜 Planned |
| 9 | Docker: containerised tests and dashboard, shareable via a simple link | 🔜 Planned |
| 10 | One new UI element covered **every day** (Dropdown, Radio, Alerts, Broken links, Broken images...) | 🔜 Planned |

---

## 🧭 Rough sketch of the framework

```
 jira-tasks/PW-001-dropdown.md      ← task dropped here (acts like a JIRA ticket)
              │
              ▼
   GitHub Action: task intake       ← "ticket moved to In Progress"
              │
              ▼
   🧠 Planner agent                 → specs/PW-001.plan.md
   (reads description, steps, acceptance criteria, deliverables)
              │
              ▼
   ⚙️ Generator agent               → Page Object + Assertions + Tests
              │
              ▼
   Pull Request → CI (lint, typecheck, tests) → AI code review → 👤 Human review → Merge
              │
              ▼
   🌙 Nightly run → Allure report → Dashboard (latest + last 50)
              │ on failure
              ▼
   🔍 Bug-analyst agent → Issue → 🩹 Healer agent → Fix PR → 👤 Human review
```

---

## 📁 Planned project structure

```
.github/
  agents/                  # planner, generator, healer + custom agents
  workflows/               # ci, nightly, task-intake
  copilot-instructions.md  # rules for AI agents
jira-tasks/                # 📥 task files (JIRA simulation)
specs/                     # test plans created by the planner
src/
  base/                    # BasePage
  fixtures/                # custom Playwright fixtures
  pages/<element>/         # XPage.ts + XPage.assertions.ts
  utils/
tests/<element>/           # *.spec.ts
scripts/                   # task and dashboard scripts
dashboard/                 # report dashboard UI
docker/                    # Dockerfiles + compose
docs/adr/                  # architecture decisions
```

---

## 🧱 Planned tech stack

- **Test framework:** Playwright, TypeScript
- **Design pattern:** Page Object Model (actions and assertions split in separate files)
- **Code quality:** ESLint (strict), Prettier, Husky, lint-staged, commitlint
- **AI:** Playwright Test Agents (planner, generator, healer), Playwright MCP, GitHub Copilot custom agents
- **CI/CD:** GitHub Actions (PR checks and nightly runs)
- **Reporting:** Allure, custom dashboard on GitHub Pages
- **Containers:** Docker, Docker Compose

---

## 🧪 Daily automation loop (planned)

1. Add a task for today's UI element (Dropdown, Radio buttons, Checkboxes, Alerts, Broken links, Broken images, ...)
2. The planner creates a test plan covering every way to handle the element
3. The generator writes the page objects and tests, one set per strategy
4. The PR gets an AI review, then a human review, then merge
5. The nightly run publishes a report, and the healer fixes any failures
6. Repeat tomorrow with a new element

---

## 📊 Progress tracker

- [x] Repository created
- [ ] Project scaffold (Playwright + TypeScript)
- [ ] ESLint, Prettier, Git hooks
- [ ] Page Object convention + fixtures
- [ ] Playwright agents (planner, generator, healer)
- [ ] JIRA-style task intake
- [ ] CI workflow
- [ ] Allure + dashboard + Docker
- [ ] GitHub Pages publishing (latest + last 50)
- [ ] Nightly run + failure analysis loop
- [ ] Custom agents (README updater, code reviewer)
- [ ] Daily UI element automation begins

### UI elements coverage

| Element | Task | Status |
|---------|------|--------|
| Dropdown | PW-001 | ⏳ Not started |
| Radio buttons | PW-002 | ⏳ Not started |
| Checkboxes | PW-003 | ⏳ Not started |
| Broken links | PW-004 | ⏳ Not started |
| Broken images | PW-005 | ⏳ Not started |

---

## ⚠️ Disclaimer

- This is a **learning and portfolio project** and not production software.
- All commands, folders, and workflows above describe the **target state** and will be added step by step.
- AI generates code, but **every change is reviewed by a human** before merging.

## 📄 License

MIT
