# Magnetic publishing worker (dry-run)
The deployed Supabase Edge Function is named `magnetic-publishing-worker`.

This worker is **deliberately not a publisher yet**. It only counts pending jobs, and it never claims or delivers them. This avoids losing jobs before platform adapters exist.

### Current safety design
- Requires POST.
- Requires a service-role bearer token in addition to JWT verification.
- Never expose that token in public frontend code.
- Uses a server-only database client.
- Returns `mode: dry_run`, `claimed: 0`, and `published: 0`.
- No automatic trigger is configured. No social posts can be published.

### Next milestones
1. Add a protected scheduler trigger and confirm safe server-to-server invocation.
2. Add target/account validation, idempotency keys, and recovery for stale claims.
3. Add a mock adapter integration test and audit log before any live platform APIs.
4. Add approved LinkedIn and Meta connectors, then controlled real delivery.

### Deployment status
Supabase Edge Function `magnetic-publishing-worker` ACTIVE v1 on 2026-10-31.
