# Enterprise E-Commerce Admin Folder Structure

```text
project-root/
  client/
    src/
      app/                 Redux store, app providers, admin navigation
      components/admin/    Reusable admin UI components
      features/            Redux slices and RTK Query API layer
      layouts/             Admin shell with sidebar/header
      pages/admin/         Admin pages and resource screens
      routes/              Admin route tree
  server/
    prisma/                Prisma schema, SQL reference, seed script
    src/
      config/              Env, logger, Prisma client
      controllers/         HTTP request handlers
      services/            Business rules
      repositories/        Prisma data access layer
      middleware/          Auth, RBAC, validation, upload, errors
      routes/              REST API routes
      validators/          express-validator rule sets
      utils/               Shared helpers
      jobs/                Background-job entry points
  docker/                  Dockerfiles
  docs/                    Install, API, database and deployment guides
```
