# Magnetic product build tracker
Updated: 31 October 2026

This is the source of truth for build progress. A feature is only [x] when implementation is complete AND the stated verification has passed. [~] means implemented but not fully tested, [ ] means outstanding. Changes should include evidence in the notes.

## Foundation
- [x] Existing Magnetic Vercel and GitHub project identified. Verified repository and project IDs.
- [x] Magnetic Supabase project created in Sydney. Verified ACTIVE_HEALTHY.
- [x] Initial database schema created: workspaces, workspace_members, social_accounts, posts, post_targets. Verified all five tables present with row-level security enabled.
- [~] Database security configuration. RLS enabled; initial advisor warnings identified and anon execution revoked. **Not yet passed comprehensive RLS cross-tenant testing.**
- [x] Browser-only Studio prototype committed at studio/index.html. Verified GitHub commit; not verified as end-to-end functional production service.
- [ ] Magnetic app connects to Supabase and authenticates real users. Test signup, email verification, sign-in, sign-out, refresh.
- [ ] Create a workspace using authenticated user. Test persistence after sign-out and sign-in.
- [ ] Create/edit/delete posts from the real database. Test data persists in a different browser/device.
- [ ] Test user isolation: second user cannot access first user's workspace, posts, accounts or targets.
- [ ] Workspace invitation and role management. Test owner/admin/editor/viewer permissions.
## Real publishing
- [ ] LinkedIn OAuth approval and accounts linked. Test real account connection and refresh.
- [ ] Meta OAuth approved for Facebook Pages and Instagram. Test real connection.
- [ ] Publishing job worker with timezone-safe scheduling, deduplication and idempotency.
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

## Progress log
- 2026-10-31: Project and schema set up. GitHub Studio prototype exists; authentication and true publishing still outstanding.
- 2026-10-31: Added this task tracker to GitHub.
