## Adding Packages To Project

Example adding package mysql2 to api (backend)

```bash
pn i mysql2 --filter api
```

Example adding package date-fns to dashboard (frontend)

```bash
pn i date-fns --filter dashboard
```

Example adding shadcn/ui components to dashboard (frontend)

```bash
cd app/dashboard
pn dlx shadcn-ui@latest add calendar
```

## Running Project

```bash
pn run dev
```

## ENV File

Must have VITE_ prefix because we are not using dotenv.

```env
VITE_DB_STARLINK_URL="postgresql://user:pass@10.45.253.245:5432/starlink" 
VITE_DB_STARSPACE_URL="mysql://user:pass@10.80.253.86:3306/dtp_star" 
```