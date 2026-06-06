# Installation Guide

## Requirements

- Node.js 20+
- PostgreSQL 15+
- npm 10+

## Backend

```bash
cd server
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

## Frontend

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

Open:

```text
http://localhost:5173/admin/login
```

Seeded login:

```text
superadmin@example.com
Admin@12345
```

## Docker

```bash
docker compose up --build
```

After the containers start, seed the database once:

```bash
docker compose exec server npm run db:seed
```
