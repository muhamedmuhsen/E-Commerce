# 🛒 E-Commerce REST API

A RESTful API for an e-commerce platform built with **Node.js**, **Express 5**, and **MongoDB**. Features JWT-based authentication, role-based access control, input validation, image upload with type validation, purchase-verified reviews, and a service-layer architecture for clean, maintainable code.

---

## ✨ Features

- **Authentication & Authorization** — Register/login with JWT tokens; role-based access control (admin, manager, user)
- **Password Recovery** — Forgot password flow with email verification codes
- **Product Catalog** — Full CRUD for products with category & subcategory relationships
- **Category Management** — Categories with nested subcategories support
- **Brand Management** — Brand CRUD with image upload
- **Shopping Cart** — Add/remove items, update quantities, apply coupon codes
- **Order Management** — Direct orders and cart-based checkout with shipping calculations
- **Reviews** — Product reviews with purchase verification (only verified buyers can review)
- **Wishlist** — Save and manage favorite products
- **Coupon System** — Admin-managed discount coupons
- **User Management** — Admin-managed user accounts with profile image upload
- **Image Upload** — Multer-based file upload with MIME type validation (JPEG, PNG, WEBP)
- **Advanced Querying** — Filtering, sorting, field selection, keyword search, and pagination
- **Input Validation** — Request validation via `express-validator` with structured error responses
- **Security** — Helmet, CORS, rate limiting, XSS protection, MongoDB injection sanitization, HPP
- **Error Handling** — Centralized error middleware with custom error classes
- **Service Layer** — Business logic separated into services with a base service pattern

---

## 🛠 Tech Stack

| Layer            | Technology                                               |
| ---------------- | -------------------------------------------------------- |
| **Runtime**      | Node.js (ES Modules)                                     |
| **Framework**    | Express 5                                                |
| **Database**     | MongoDB with Mongoose 8                                  |
| **Auth**         | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`            |
| **Validation**   | `express-validator`                                      |
| **File Upload**  | `multer` (with image type filtering)                     |
| **Email**        | `nodemailer`                                             |
| **Security**     | `helmet`, `cors`, `express-rate-limit`, `xss-clean`, `hpp`, `express-mongo-sanitize` |
| **Logging**      | Morgan, Winston                                          |
| **Utilities**    | `slugify`, `dotenv`, `lodash`, `uuid`                    |
| **Dev Tools**    | Nodemon                                                  |

---

## 📁 Project Structure

```
E-Commerce/
├── config/
│   ├── database.js              # MongoDB connection setup
│   └── multer.js                # Multer config with image type validation
├── controllers/
│   ├── auth.controller.js       # Register, login, password reset
│   ├── base.controller.js       # Generic CRUD controller (inherited by all)
│   ├── brand.controller.js      # Brand CRUD
│   ├── cart.controller.js       # Shopping cart operations
│   ├── category.controller.js   # Category CRUD
│   ├── coupon.controller.js     # Coupon management
│   ├── order.controller.js      # Order creation & management
│   ├── product.controller.js    # Product CRUD
│   ├── review.controller.js     # Product reviews
│   ├── sub-category.controller.js # Subcategory CRUD
│   ├── user.controller.js       # User CRUD + profile management
│   └── wish-list.controller.js  # Wishlist operations
├── middlewares/
│   ├── async-wrapper.js         # try/catch wrapper for async handlers
│   ├── authenticate-jwt.js      # JWT verification middleware
│   ├── check-product-purchase.js # Verifies user purchased product before review
│   ├── error-handler.js         # Global error response middleware
│   ├── is-allowed.js            # Role-based access control
│   ├── normalize-body.js        # Normalizes multipart form body
│   └── validate-request.js      # express-validator result formatter
├── models/
│   ├── address.model.js         # User address schema
│   ├── brand.model.js           # Brand schema
│   ├── cart.model.js            # Shopping cart schema
│   ├── category.model.js        # Category schema
│   ├── coupon.model.js          # Discount coupon schema
│   ├── order.model.js           # Order schema with shipping
│   ├── product.model.js         # Product schema
│   ├── review.model.js          # Product review schema
│   ├── sub-category.model.js    # SubCategory schema
│   ├── user.model.js            # User schema with password hashing
│   └── wish-list.model.js       # Wishlist schema
├── routes/
│   ├── auth.route.js            # Auth endpoints
│   ├── brand.route.js           # Brand endpoints
│   ├── cart.route.js            # Cart endpoints
│   ├── category.route.js        # Category endpoints
│   ├── coupon.route.js          # Coupon endpoints
│   ├── order.route.js           # Order endpoints
│   ├── product.route.js         # Product endpoints
│   ├── review.route.js          # Review endpoints
│   ├── sub-category.route.js    # Subcategory endpoints
│   ├── user.route.js            # User endpoints
│   └── wish-list.route.js       # Wishlist endpoints
├── services/
│   ├── auth.service.js          # Authentication business logic
│   ├── base.service.js          # Generic CRUD service (inherited by all)
│   ├── brand.service.js         # Brand business logic
│   ├── cart.service.js          # Cart business logic
│   ├── category.service.js      # Category business logic
│   ├── coupon.service.js        # Coupon business logic
│   ├── order.service.js         # Order & shipping business logic
│   ├── product.service.js       # Product business logic
│   ├── review.service.js        # Review business logic
│   ├── sub-category.service.js  # Subcategory business logic
│   ├── user.service.js          # User business logic
│   └── wish-list.service.js     # Wishlist business logic
├── utils/
│   ├── api-errors.js            # Custom error classes (BadRequest, NotFound, etc.)
│   ├── api-features.js          # Query builder: filter, sort, search, paginate
│   ├── create-token.js          # JWT token creation utility
│   ├── hasing.js                # Password hashing utility
│   ├── rate-limiting.js         # Rate limiter configuration
│   ├── send-email.js            # Email sending utility (nodemailer)
│   └── constants/               # Shipping prices, cities, etc.
├── validators/
│   ├── auth.validator.js
│   ├── brand.validator.js
│   ├── cart.validator.js
│   ├── category.validator.js
│   ├── common.validator.js      # Shared validation rules
│   ├── coupon.validator.js
│   ├── order.validator.js
│   ├── product.validator.js
│   ├── review.validator.js
│   ├── sub-category.validator.js
│   ├── user.validator.js
│   └── wish-list.validator.js
├── .gitignore
├── package.json
└── server.js                    # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/muhamedmuhsen/E-Commerce.git
cd E-Commerce

# 2. Install dependencies
npm install

# 3. Create environment config
cp .env.example .env   # or create .env manually
```

### Environment Variables

Create a `.env` file in the project root with:

```env
PORT=8000
NODE_ENV=development
DATABASE_URI=mongodb://localhost:27017/e-commerce
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

### Run the Server

```bash
npm start
```

The server will start on `http://localhost:8000` (or your configured `PORT`).

---

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Endpoint                | Access  | Description                          |
| ------ | ----------------------- | ------- | ------------------------------------ |
| POST   | `/auth/register`        | Public  | Register a new user                  |
| POST   | `/auth/login`           | Public  | Login & receive a JWT                |
| POST   | `/auth/forgetPassword`  | Public  | Send password reset code via email   |
| POST   | `/auth/verifyResetCode` | Public  | Verify the password reset code       |
| PUT    | `/auth/resetPassword`   | Public  | Reset password after code verification |

### Categories

| Method | Endpoint              | Access  | Description                          |
| ------ | --------------------- | ------- | ------------------------------------ |
| GET    | `/categories`         | Public  | Get all categories                   |
| POST   | `/categories`         | Admin   | Create a category                    |
| GET    | `/categories/:id`     | Public  | Get a specific category              |
| PUT    | `/categories/:id`     | Admin   | Update a category                    |
| DELETE | `/categories/:id`     | Admin   | Delete a category                    |

### Subcategories

| Method | Endpoint                                   | Access  | Description                              |
| ------ | ------------------------------------------ | ------- | ---------------------------------------- |
| GET    | `/subcategories`                           | Public  | Get all subcategories                    |
| POST   | `/subcategories`                           | Admin   | Create a subcategory                     |
| GET    | `/categories/:id/subcategories`            | Public  | Get subcategories of a specific category |
| POST   | `/categories/:id/subcategories`            | Admin   | Create subcategory under a category      |
| GET    | `/subcategories/:id`                       | Admin   | Get a specific subcategory               |
| PUT    | `/subcategories/:id`                       | Admin   | Update a subcategory                     |
| DELETE | `/subcategories/:id`                       | Admin   | Delete a subcategory                     |

### Brands

| Method | Endpoint              | Access  | Description                            |
| ------ | --------------------- | ------- | -------------------------------------- |
| GET    | `/brands`             | Public  | Get all brands                         |
| POST   | `/brands`             | Admin   | Create a brand (with image upload)     |
| GET    | `/brands/:id`         | Public  | Get a specific brand                   |
| PUT    | `/brands/:id`         | Admin   | Update a brand (with image upload)     |
| DELETE | `/brands/:id`         | Admin   | Delete a brand                         |

### Products

| Method | Endpoint              | Access  | Description             |
| ------ | --------------------- | ------- | ----------------------- |
| GET    | `/products`           | Public  | Get all products        |
| POST   | `/products`           | Admin   | Create a product        |
| GET    | `/products/:id`       | Public  | Get a specific product  |
| PUT    | `/products/:id`       | Admin   | Update a product        |
| DELETE | `/products/:id`       | Admin   | Delete a product        |

### Reviews

| Method | Endpoint              | Access          | Description                              |
| ------ | --------------------- | --------------- | ---------------------------------------- |
| GET    | `/reviews/:id`        | Public          | Get all reviews for a product            |
| POST   | `/reviews/:id`        | Authenticated†  | Add a review (purchase verified)         |
| PUT    | `/reviews/:id`        | Authenticated   | Update your review                       |
| DELETE | `/reviews/:id`        | Authenticated   | Delete your review                       |

> † Only users who have purchased the product (with a delivered/confirmed/shipped order) can submit a review.

### Cart

| Method | Endpoint                | Access          | Description                     |
| ------ | ----------------------- | --------------- | ------------------------------- |
| GET    | `/carts`                | Authenticated   | Get cart items                  |
| POST   | `/carts`                | Authenticated   | Add item to cart                |
| DELETE | `/carts`                | Authenticated   | Clear all cart items            |
| PUT    | `/carts/apply-coupon`   | Authenticated   | Apply a coupon code to cart     |
| PUT    | `/carts/:id`            | Authenticated   | Update product quantity in cart |
| DELETE | `/carts/:id`            | Authenticated   | Remove item from cart           |

### Orders

| Method | Endpoint                | Access          | Description                     |
| ------ | ----------------------- | --------------- | ------------------------------- |
| GET    | `/orders/user`          | Authenticated   | Get logged-in user's orders     |
| GET    | `/orders`               | Admin           | Get all orders                  |
| POST   | `/orders/direct`        | Authenticated   | Create a direct order           |
| POST   | `/orders/from-cart`     | Authenticated   | Create an order from cart       |
| GET    | `/orders/:id`           | Authenticated   | Get a specific order            |
| PUT    | `/orders/:id`           | Authenticated   | Update an order                 |
| PUT    | `/orders/status/:id`    | Authenticated   | Update order status             |
| DELETE | `/orders/:id`           | Admin           | Delete an order                 |

### Coupons

| Method | Endpoint              | Access  | Description             |
| ------ | --------------------- | ------- | ----------------------- |
| GET    | `/coupons`            | Admin   | Get all coupons         |
| POST   | `/coupons`            | Admin   | Create a coupon         |
| GET    | `/coupons/:id`        | Admin   | Get a specific coupon   |
| PUT    | `/coupons/:id`        | Admin   | Update a coupon         |
| DELETE | `/coupons/:id`        | Admin   | Delete a coupon         |

### Wishlists

| Method | Endpoint              | Access          | Description                    |
| ------ | --------------------- | --------------- | ------------------------------ |
| GET    | `/wishlists`          | Authenticated   | Get wishlist                   |
| POST   | `/wishlists`          | Authenticated   | Add product to wishlist        |
| DELETE | `/wishlists`          | Authenticated   | Clear entire wishlist          |
| DELETE | `/wishlists/:id`      | Authenticated   | Remove product from wishlist   |

### Users

| Method | Endpoint                       | Access          | Description                            |
| ------ | ------------------------------ | --------------- | -------------------------------------- |
| GET    | `/users/get-me`                | Authenticated   | Get logged-in user's profile           |
| PUT    | `/users/update-me`             | Authenticated   | Update profile (with image upload)     |
| PATCH  | `/users/update-my-password`    | Authenticated   | Change own password                    |
| DELETE | `/users/deactivate-me`         | Authenticated   | Deactivate own account                 |
| GET    | `/users`                       | Admin/Manager   | Get all users                          |
| POST   | `/users`                       | Admin/Manager   | Create a user (with image upload)      |
| GET    | `/users/:id`                   | Admin/Manager   | Get a specific user                    |
| PUT    | `/users/:id`                   | Admin/Manager   | Update a user (with image upload)      |
| DELETE | `/users/:id`                   | Admin/Manager   | Delete a user                          |

---

## 📤 Image Upload

The API supports image upload for brands and user profiles via `multipart/form-data`:

- **Allowed types:** JPEG, JPG, PNG, WEBP
- **Max file size:** 5 MB
- **Max files per request:** 6
- **Field name:** `image`

Invalid file types receive a `400 Bad Request` error.

---

## 🔍 Query Features

The API supports advanced query parameters on list endpoints:

### Filtering

```
GET /api/v1/products?price[gte]=100&price[lte]=500
```

Supported operators: `gte`, `gt`, `lte`, `lt`, `eq`, `ne`, `in`, `nin`

### Sorting

```
GET /api/v1/products?sort=price:asc
GET /api/v1/products?sort=createdAt:desc
```

Allowed sort fields: `price`, `title`, `createdAt`, `ratingsAverage`, `sold`

### Field Selection

```
GET /api/v1/products?fields=name,price,category
```

### Keyword Search

```
GET /api/v1/products?keyword=phone
```

Searches across `title` and `description` for products; searches `name` for other resources.

### Pagination

```
GET /api/v1/products?page=2&limit=10
```

Response includes pagination metadata: `currentPage`, `limit`, `numberOfPages`, `next`, `prev`.

---

## 🔐 Authentication

Protected routes require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued on registration and login with a **1-hour** expiration. Role-based access is enforced via the `is-allowed` middleware:

| Role       | Access Level                                |
| ---------- | ------------------------------------------- |
| `user`     | Own profile, cart, orders, reviews, wishlist |
| `manager`  | User management + user-level access         |
| `admin`    | Full access to all resources                |

---

## ⚠️ Error Handling

All errors follow a consistent JSON structure:

```json
{
  "success": false,
  "status": "fail",
  "code": 400,
  "message": "Descriptive error message"
}
```

Validation errors return an array of field-level details:

```json
{
  "success": false,
  "code": 400,
  "error": [
    {
      "type": "field",
      "value": null,
      "msg": "Product name is required",
      "path": "name",
      "location": "body"
    }
  ]
}
```

---

## 🔒 Security

The API implements multiple layers of security:

- **Helmet** — Secure HTTP headers
- **CORS** — Cross-origin resource sharing
- **Rate Limiting** — Request throttling on `/api` routes
- **XSS Protection** — Sanitize user input against XSS attacks
- **MongoDB Injection Prevention** — `express-mongo-sanitize`
- **HPP** — HTTP parameter pollution protection
- **JSON Body Limit** — 10KB max request body size

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
