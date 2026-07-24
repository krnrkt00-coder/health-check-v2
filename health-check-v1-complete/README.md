# health-check-v1 complete bundle

This bundle contains the files to replace in the Next.js app:

- `src/app/page.tsx`
- `src/app/api/state/route.ts`
- `supabase/schema.sql`

## Required environment variables

Set these in Vercel for the project:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Supabase table

Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.

## Deploy steps

1. Replace the files in your repo with the ones in this bundle.
2. Run `npm install` if needed.
3. Commit and push to `main`.
4. Let Vercel redeploy.

## What the app does

- shared state via Supabase
- add/remove people
- daily attendance and health status logging
- search and date filtering
- summary cards and missing-person view
- responsive layout
