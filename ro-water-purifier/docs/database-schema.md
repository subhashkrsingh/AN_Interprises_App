# PostgreSQL Database Schema

Primary schema source:

- Prisma schema: `server/prisma/schema.prisma`
- SQL reference script: `server/prisma/schema.sql`
- Seed script: `server/prisma/seed.js`

Core tables:

- `users`, `roles`, `permissions`, `user_roles`, `role_permissions`
- `products`, `product_images`, `product_variants`, `categories`, `brands`, `vendors`
- `customers`, `addresses`, `orders`, `order_items`
- `inventory`, `inventory_logs`
- `coupons`, `reviews`, `banners`, `cms_pages`
- `notifications`, `settings`, `activity_logs`

Use Prisma migrations for the application database:

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

Default seeded admin:

```text
Email: superadmin@example.com
Password: Admin@12345
```
