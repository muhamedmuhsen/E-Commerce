# 🛒 E-Commerce REST API

A RESTful API for an e-commerce platform built with **Node.js**, **Express 5**, and **MongoDB**. Features JWT-based authentication, role-based access control, input validation, and a generic handler factory pattern for clean, DRY controller logic.

---

## ✨ Features

- **Authentication & Authorization** — Register/login with JWT tokens; admin-only routes for write operations
- **Product Catalog** — Full CRUD for products with category & subcategory relationships
- **Category Management** — Categories with nested subcategories support
- **Brand Management** — Brand CRUD operations
- **User Management** — Admin-managed user accounts with secure password handling
- **Advanced Querying** — Filtering, sorting, field selection, keyword search, and pagination
- **Input Validation** — Request validation via `express-validator` with structured error responses
- **Error Handling** — Centralized error middleware with custom `ApiError` class
- **Handler Factory** — Generic CRUD handlers to eliminate repetitive controller code

---

## 🛠 Tech Stack

| Layer            | Technology                                               |
| ---------------- | -------------------------------------------------------- |
| **Runtime**      | Node.js (ES Modules)                                     |
| **Framework**    | Express 5                                                |
| **Database**     | MongoDB with Mongoose 8                                  |
| **Auth**         | JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`            |
| **Validation**   | `express-validator`                                      |
| **Logging**      | Morgan                                                   |
| **Utilities**    | `slugify`, `dotenv`, `validator`                         |
| **Linting**      | ESLint (custom config)                                   |
| **Dev Tools**    | Nodemon                                                  |

---

## 📁 Project Structure

```
E-Commerce/
├── config/
│   └── database.js              # MongoDB connection setup
├── controllers/
│   ├── auth.controller.js       # Register & login logic
│   ├── brand.controller.js      # Brand CRUD (uses handler factory)
│   ├── category.controller.js   # Category CRUD (uses handler factory)
│   ├── product.controller.js    # Product CRUD (uses handler factory)
│   ├── subcategory.controller.js# Subcategory CRUD (uses handler factory)
│   ├── user.controller.js       # User CRUD + password change
│   └── handlersFactory.js       # Generic getAll/getOne/create/update/delete
├── middlewares/
│   ├── asyncWrapper.js          # try/catch wrapper for async route handlers
│   ├── authenticateJWT.js       # JWT verification + admin role check
│   ├── errorHandler.js          # Global error response middleware
│   └── validateRequest.js       # express-validator result formatter
├── models/
│   ├── brand.model.js           # Brand schema
│   ├── category.model.js        # Category schema
│   ├── product.model.js         # Product schema (refs Category & SubCategory)
│   ├── subcategory.model.js     # SubCategory schema (refs Category)
│   └── user.model.js            # User schema with pre-save password hashing
├── routes/
│   ├── auth.route.js            # POST /register, /login
│   ├── brand.route.js           # Brand CRUD routes
│   ├── category.route.js        # Category CRUD + nested subcategory routes
│   ├── product.route.js         # Product CRUD routes
│   ├── subcategory.route.js     # Subcategory CRUD routes (supports mergeParams)
│   └── user.route.js            # User CRUD + change-password routes
├── utils/
│   ├── ApiError.js              # Custom error class with statusCode & status
│   └── apiFeatures.js           # Query builder: filter, sort, search, paginate, fields
├── validators/
│   ├── validateBrandRequest.js
│   ├── validateCategoryRequest.js
│   ├── validateProductRequest.js
│   ├── validateSubCategoryRequest.js
│   └── validateUserRequest.js
├── .eslintrc.json
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
cp config.env.example config.env   # or create config.env manually
```

### Environment Variables

Create a `config.env` file in the project root with:

```env
PORT=8000
NODE_ENV=development
DATABASE_URI=mongodb://localhost:27017/e-commerce
JWT_SECRET=your_jwt_secret_key
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

| Method | Endpoint              | Access  | Description             |
| ------ | --------------------- | ------- | ----------------------- |
| POST   | `/auth/register`      | Public  | Register a new user     |
| POST   | `/auth/login`         | Public  | Login & receive a JWT   |

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

| Method | Endpoint              | Access  | Description             |
| ------ | --------------------- | ------- | ----------------------- |
| GET    | `/brands`             | Public  | Get all brands          |
| POST   | `/brands`             | Admin   | Create a brand          |
| GET    | `/brands/:id`         | Public  | Get a specific brand    |
| PUT    | `/brands/:id`         | Admin   | Update a brand          |
| DELETE | `/brands/:id`         | Admin   | Delete a brand          |

### Products

| Method | Endpoint              | Access  | Description             |
| ------ | --------------------- | ------- | ----------------------- |
| GET    | `/products`           | Public  | Get all products        |
| POST   | `/products`           | Admin   | Create a product        |
| GET    | `/products/:id`       | Public  | Get a specific product  |
| PUT    | `/products/:id`       | Admin   | Update a product        |
| DELETE | `/products/:id`       | Admin   | Delete a product        |

### Users

| Method | Endpoint                       | Access  | Description             |
| ------ | ------------------------------ | ------- | ----------------------- |
| GET    | `/users`                       | Admin   | Get all users           |
| POST   | `/users`                       | Admin   | Create a user           |
| GET    | `/users/:id`                   | Admin   | Get a specific user     |
| PUT    | `/users/:id`                   | Admin   | Update a user           |
| DELETE | `/users/:id`                   | Admin   | Delete a user           |
| PATCH  | `/users/change-password/:id`   | Admin   | Change user password    |

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

Tokens are issued on registration and login with a **1-hour** expiration. Admin-only routes additionally verify that the authenticated user has `role: "admin"`.

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

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
