# RO Water Purifier Website + Enterprise E-Commerce Admin

Full-stack RO Water Purifier business website with a React + Vite frontend, Node.js backend, and an enterprise e-commerce admin panel powered by PostgreSQL and Prisma.

## Project Structure

- `client/` - React 19 + Vite frontend with MUI admin panel
- `server/` - Node.js + Express backend with Prisma/PostgreSQL admin APIs
- `docs/` - installation, API, schema and deployment guides
- `docker/` - Docker build files

## Admin Features

- JWT authentication, refresh tokens, forgot/reset/change password
- Role based access control with users, roles and permissions
- Dashboard statistics, sales charts, revenue graphs and low-stock alerts
- Product, category, brand, order, customer, inventory, coupon, banner, CMS, review, settings and log management
- Product image upload support through Multer
- CSV, Excel and PDF report exports
- Activity logging and Winston backend logs

## Local Setup

Backend:

```bash
cd server
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Frontend:

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

Seeded admin:

```text
superadmin@example.com
Admin@12345
```

## Docker

```bash
docker compose up --build
docker compose exec server npm run db:seed
```

## Documentation

- `docs/installation-guide.md`
- `docs/database-schema.md`
- `docs/api-reference.md`
- `docs/folder-structure.md`
- `docs/deployment-guide.md`
