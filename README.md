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

### API
```env
VITE_DB_STARLINK_URL=
VITE_DB_STARSPACE_URL=
VITE_ACCESS_TOKEN_SECRET=
```

### Dashboard
```env
VITE_API_URL="http://localhost:8000"
```
