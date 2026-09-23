<!-- Before you fill this in: set the PR title to a proper, descriptive summary of the change (e.g. "Fix notification preferences save failing on timezone change") — not the raw branch name (e.g. "feat/AFP-notif-preference") and not left as GitHub's auto-filled single-commit message. -->

**PR Title:** Align folder structure with Next.js conventions, add developer guide and PR template

## Summary

<!-- What does this PR do, and why? Link the Jira/issue ticket if there is one. -->

Aligns the project's folder structure with the official Next.js App Router conventions per docs, and adds two missing project docs: a `DEVELOPER_GUIDE.md` covering setup, tech stack, project structure, coding standards, and our auth architecture, plus a `PULL_REQUEST_TEMPLATE.md` so future PRs follow a consistent format.

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor (no behavior change)
- [x] Chore / tooling / CI

## Test plan

<!-- How did you verify this works? List the specific commands/steps, not just "tests pass". -->

- [ ] `npm run lint` passes locally
- [ ] `npm run dev` starts without errors after the restructure
- [ ] Manually verified all existing routes still resolve correctly after moving folders
- [ ] Reviewed `DEVELOPER_GUIDE.md` and `PULL_REQUEST_TEMPLATE.md` render correctly on GitHub

## Screenshots / recordings

<!-- Required for any visual change. Delete this section if not applicable. -->

Not applicable — no UI changes.

## Checklist

- [x] No unrelated changes bundled into this PR
- [x] Breaking changes (schema, routes, shared services) are called out explicitly below
- [x] Any new environment variables or config are documented

## Notes for reviewers

<!-- Anything reviewers should pay special attention to, known trade-offs, or follow-up work intentionally left out of scope. -->

- No behavior changes — this is purely structural/documentation.
- `DEVELOPER_GUIDE.md` documents the current project structure and our auth architecture (login/register via TanStack Query + Zustand) for onboarding purposes.
- Please flag if any folder placement doesn't match how you'd expect it per the Next.js docs — happy to adjust before merge.
