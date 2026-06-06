# Production Deployment Guide

## Backend

1. Set production secrets:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CLIENT_ORIGIN`
   - SMTP settings
2. Run:

```bash
npm ci
npm run prisma:generate
npm run prisma:deploy
npm run start
```

3. Put the API behind HTTPS and a reverse proxy.
4. Set `COOKIE_SECURE=true`.
5. Store `server/uploads` on persistent storage or an object store.

## Frontend

1. Set:

```text
VITE_ADMIN_API_URL=https://api.example.com/api/admin
```

2. Build:

```bash
npm ci
npm run build
```

3. Serve `client/dist` from Nginx, Apache, a CDN, or object storage.

## Security Checklist

- Rotate seed admin password immediately.
- Use long random JWT secrets.
- Keep PostgreSQL private to the app network.
- Enable HTTPS-only cookies in production.
- Review role permissions before creating staff accounts.
- Back up PostgreSQL and uploaded product images.
