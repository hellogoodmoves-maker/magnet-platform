# Magnetic product build tracker
Updated: 31 October 2026

This is the source of truth for build progress. A feature is only [x] when implementation is complete AND the stated verification has passed. [~] means implemented but not fully tested, [ ] means outstanding. Changes should include evidence in the notes.

## Foundation
- [x] Existing Magnetic Vercel and GitHub project identified. Verified repository and project IDs.
- [x] Magnetic Supabase project created in Sydney. Verified ACTIVE_HEALTHY.
- [x] Initial database schema created: workspaces, workspace_members, social_accounts, posts, post_targets. Verified all five tables present with row-level security enabled.
- [~] Database security configuration. RLS enabled; initial advisor warnings identified and anon execution revoked. **Not yet passed comprehensive RLS cross-tenant testing.**
- [x] Browser-only Studio prototype committed at studio/index.html. Verified GitHub commit; not verified as end-to-end functional production service.
- [x] Vercel environment configured with Magnetic Supabase URL and publishable key. Verified successful creation for production, preview and development.\n- [~] Magnetic cloud beta at /studio/live.html uses Supabase Auth (signup/sign-in/sign-out) and queries workspaces/posts. Committed and deployed; **requires human browser end-to-end test before completion**.
- [~] Workspace creation UI calls create_workspace RPC. Database permissions checked; browser persistence test outstanding.
- [~] Cloud beta includes create/edit/delete posts against Supabase. Browser cross-session/device testing outstanding.
- [ ] Test user isolation: second user cannot access first user's workspace, posts, accounts or targets.
- [ ] Workspace invitation and role management. Test owner/admin/editor/viewer permissions.
## Real publishing
- [ ] LinkedIn OAuth approval and accounts linked. Test real account connection and refresh.
- [ ] Meta OAuth approved for Facebook Pages and Instagram. Test real connection.
- [~] Publishing queue foundation: publishing_jobs (unique target, state, retry fields) and publishing_events created; RLS enabled and direct client writes revoked. Verified schema exists. **No worker, social API delivery or end-to-end job test yet.**\n- [~] Atomic worker database primitives implemented: `private.claim_due_publishing_jobs` (due/connected/approved targets, SKIP LOCKED) and `private.finish_publishing_job` (success, bounded retry and event history). Verified functions installed and callable by service_role but not authenticated clients; zero-job query tested. **Not a running worker and no real delivery tested.**\n- [~] Server-side worker deployed as protected dry-run endpoint; function ACTIVE, no delivery actions and no scheduled trigger. Not yet end-to-end invoked.\n- [x] Automatic timeout-recovery schedule registered and verified active (every five minutes). First actual scheduled execution not yet observed.\n- [~] Timed-out job recovery SQL installed and empty-queue/permissions checks passed. Unknown delivery outcomes are marked failed for manual reconciliation, not automatically resent.\n- [ ] Running publishing worker with timezone-safe scheduling, platform adapters and idempotent delivery.
- [ ] Publish a test LinkedIn post to authorised account, verify platform ID.
- [ ] Publish a test Facebook Page post and Instagram post to authorised accounts.
- [ ] Retry, error handling and clear publishing history.
- [ ] Publishing approval gate and per-client account permissions.
## AI functionality
- [ ] AI caption drafting with per-client tone of voice.
- [ ] AI content ideas and calendar proposal.
- [ ] Human approval workflow and audit log.
- [ ] PR monitoring agent proof of concept.
## Product and launch
- [ ] Subscription and billing.
- [ ] Security audit, account deletion, privacy policy and data management.
- [ ] End-to-end automated test suite for critical flows.
- [ ] Final frontend design and responsive usability testing.

## Technical decisions
- GitHub: hellogoodmoves-maker/magnet-platform
- Vercel: magnet-platform (existing project)
- Supabase: Magnetic (mbzidcvdjcmowavhmrmr), Sydney ap-southeast-2
- Existing Magnetic homepage remains in place.
- Studio initial prototype at /studio/ currently uses localStorage; **not connected to Supabase**.
- Do not use real customer content until login, tenant isolation and persistence are tested.
- Facebook Groups publishing not assumed to be available through official Meta API.
- Automatic outreach and personal DMs remain deferred.

## Incident log\n- 2026-10-31: Login remains user-reported FAILED after signup. Work continues on independent backend. Added publishing queue and event history, verified RLS and restricted client writes. Social publishing still unavailable.\n
- 2026-10-31: User screenshot shows signup request accepted but no email received. Verified auth.users contains one confirmed user; auth logs show signup and verify actions. Signup button is functional, **sign-in and workspace flow not yet tested**. Updated ambiguous signup message to suggest signing in if previously registered.

- 2026-10-31: Third report: users can type but buttons do nothing. Checked JS syntax (valid). Moved click-handling code from inline script into same-origin /studio/app.js to avoid inline-script blocking. Verified Vercel returns HTTP 200 for both HTML and JavaScript assets. **Actual browser click test still outstanding; do not mark resolved.**
- 2026-10-31: Second user report: signup still nonresponsive. Replaced external JS module import with standalone direct Supabase Auth/REST requests. Commit 2fdd2b9. Deployment pending verification and signup still **FAILED / UNVERIFIED**; do not mark auth complete.

- 2026-10-31: User reported signup and login buttons unresponsive. Identified unhandled browser-side module loading as a plausible cause; deployed fallback JS loader and visible startup error. **Root cause not yet conclusively established and user signup retest pending.**

## Progress log
- 2026-10-31: Enabled pg_cron and installed `magnetic-stale-job-recovery` schedule (`*/5 * * * *`). Verified cron.job active=true, jobid=1. This runs timeout quarantine only, not delivery; first scheduled execution has not yet been observed.\n
- 2026-10-31: Installed `private.recover_stale_publishing_jobs` to quarantine timed-out processing jobs for manual reconciliation (no automatic retry where delivery outcome is unknown). Verified service_role allowed, authenticated user denied, empty-queue invocation succeeded. No recurring trigger configured.\n
- 2026-10-31: Deployed Supabase Edge Function `magnetic-publishing-worker` v1 (ACTIVE), POST and server service-role only. Dry run counts pending jobs and explicitly does not claim/publish. Confirmed deployment status, not yet invoked end-to-end. See docs/publishing-worker.md.\n\n- 2026-10-31: Added private atomic publishing claim/finish functions, restricted execution privileges, checked empty queue (0 rows). Social API delivery remains disabled and login remains blocked.\n
- 2026-10-31: Project and schema set up. GitHub Studio prototype exists; authentication and true publishing still outstanding.
- 2026-10-31: Added this task tracker to GitHub.\n- 2026-10-31: Configured Vercel environment variables.\n- 2026-10-31: Added /studio/live.html with Supabase Auth, workspaces and posts UI. Verified GitHub commit, Vercel READY deployment, DB grants and policy count; end-to-end browser tests still pending.
