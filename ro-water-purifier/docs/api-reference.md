# Admin API Reference

Base URL:

```text
http://localhost:5000/api/admin
```

Authentication:

```text
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me
POST   /auth/forgot-password
POST   /auth/reset-password
PATCH  /auth/change-password
```

Protected modules:

```text
GET    /dashboard

GET    /products
POST   /products
GET    /products/:id
PUT    /products/:id
PATCH  /products/:id
PATCH  /products/:id/restore
DELETE /products/:id
```

The same REST pattern is available for:

```text
categories
brands
vendors
orders
customers
inventory
inventory-logs
coupons
reviews
banners
cms-pages
notifications
settings
users
roles
permissions
activity-logs
```

Reports:

```text
GET /reports?type=sales
GET /reports/export?type=sales&format=csv
GET /reports/export?type=inventory&format=excel
GET /reports/export?type=customers&format=pdf
```

Every protected request requires:

```text
Authorization: Bearer <access-token>
```
