# Admin API Endpoints

This file documents the admin endpoints added under `/api/v1/admin`.

Authentication: All admin routes require a valid JWT in the `Authorization: Bearer <token>` header, and the user must have `role: 'admin'`.

Users
- GET `/api/v1/admin/users` - list users (query: `page`, `limit`, `keyword`)
- GET `/api/v1/admin/users/:id` - get user by id
- PUT `/api/v1/admin/users/:id` - update user (body: `name`, `email`, `role`, `phone`, `address`)
- DELETE `/api/v1/admin/users/:id` - delete user

Products
- GET `/api/v1/admin/products` - list products (query: `page`, `limit`, `keyword`)
- PUT `/api/v1/admin/products/:id` - update product (body: `name`, `price`, `description`, `category`, `stock_quantity`, `slug`)
- DELETE `/api/v1/admin/products/:id` - delete product

Orders
- GET `/api/v1/admin/orders` - list orders (query: `page`, `limit`)
- GET `/api/v1/admin/orders/:id` - get order
- PUT `/api/v1/admin/orders/:id` - update order status (body: `status`)
- DELETE `/api/v1/admin/orders/:id` - delete order

Notes
- Product stock quantities are adjusted when orders are created, cancelled, refunded, or deleted.
- The admin product update will update the product slug automatically if the `name` changes (unless `slug` provided).
