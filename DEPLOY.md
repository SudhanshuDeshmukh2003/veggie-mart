# Deploy checklist

## Database (required for live orders)

1. Open `CLAIM_URL` from your local `.env` and claim the Prisma Postgres database  
   **OR** create a free Postgres DB (Neon / Supabase / Prisma Console).
2. Copy `DATABASE_URL` into Vercel → Project → Settings → Environment Variables.
3. First Vercel deploy runs `prisma migrate deploy` and creates tables.

## Vercel env vars

- `DATABASE_URL`
- `AUTH_SECRET`
- `ADMIN_WHATSAPP`
- `SHOP_UPI_ID`
- `SHOP_UPI_NAME`

## After first deploy

```powershell
npm run db:seed
```

(Use the same production `DATABASE_URL` in `.env` while seeding.)
