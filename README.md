# Fresh Veg Mart

Live vegetable ordering site with **Admin** + **Customer** roles, daily prices, COD/UPI checkout, WhatsApp alerts, and a **hosted PostgreSQL** database for real orders.

## Local setup

```powershell
cd C:\Users\Sudhashu\Projects\veggie-mart
npm install
copy .env.example .env
```

1. Put your Postgres `DATABASE_URL` in `.env` (see Deploy below).
2. Run:

```powershell
npm run db:setup
npm run dev
```

Open http://localhost:3000

### Demo logins

| Role  | Email           | Password |
|-------|-----------------|----------|
| Admin | admin@sabzi.com | admin123 |
| User  | user@sabzi.com  | user123  |

### Env vars

```
DATABASE_URL=postgresql://...
AUTH_SECRET=long-random-secret
ADMIN_WHATSAPP=91XXXXXXXXXX
SHOP_UPI_ID=yourshop@upi
SHOP_UPI_NAME=Fresh Veg Mart
```

## Deploy on Vercel (recommended)

### 1. Claim / create a permanent Postgres DB

A temporary Prisma Postgres DB may already be in your local `.env`.

- Open the `CLAIM_URL` from `.env` in the browser and **claim** it (required within ~24 hours), **or**
- Create a free DB at [Neon](https://neon.tech) / [Supabase](https://supabase.com) / [Prisma Console](https://console.prisma.io)

Copy the Postgres connection string.

### 2. Push code to GitHub

```powershell
git add .
git commit -m "Prepare Fresh Veg Mart for Postgres and Vercel"
git remote add origin https://github.com/YOUR_USER/veggie-mart.git
git push -u origin main
```

Do **not** commit `.env` (it is gitignored).

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the GitHub repo  
2. Framework: **Next.js** (auto-detected)  
3. Add Environment Variables:

| Name | Value |
|------|--------|
| `DATABASE_URL` | your Postgres URL |
| `AUTH_SECRET` | long random string |
| `ADMIN_WHATSAPP` | `91XXXXXXXXXX` |
| `SHOP_UPI_ID` | your UPI id |
| `SHOP_UPI_NAME` | Fresh Veg Mart |

4. Click **Deploy**

Build runs: `prisma generate` → `prisma migrate deploy` → `next build`  
That creates tables on the live database automatically.

### 4. Seed demo data (optional, once)

After first deploy, from your PC (with the same `DATABASE_URL` in `.env`):

```powershell
npm run db:seed
```

## Netlify

Also possible, but **Vercel is simpler for Next.js**. On Netlify set the same env vars and use the Next.js runtime. Prefer Vercel unless you already use Netlify.

## How live orders work

```
Customer → Vercel website → PostgreSQL (orders saved)
                ↓
         Admin panel + WhatsApp alert
```

Orders, users, and vegetable prices stay online even when your PC is off.
