# Expense Management API

A comprehensive Expense Management System built with NestJS and MongoDB. This API allows you to manage expenses with categories, filter by month/category, and generate monthly summary reports.

## Features

- ✅ Category Management (CRUD with soft delete)
- ✅ Expense Management (CRUD with soft delete)
- ✅ Filter expenses by month and category
- ✅ Monthly summary reports with category-wise totals
- ✅ Pagination support
- ✅ Request validation using class-validator
- ✅ MongoDB with proper indexing
- ✅ Standardized response format

## Tech Stack

- **Framework:** NestJS 11.x
- **Database:** MongoDB with Mongoose
- **Validation:** class-validator & class-transformer
- **Language:** TypeScript

## Folder Structure

```
src/
├── categories/
│   ├── schema/
│   │   └── category.schema.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── expenses/
│   ├── schema/
│   │   ├── dto/
│   │   │   ├── create-expense.dto.ts
│   │   │   └── filter-expense.dto.ts
│   │   └── expense.schema.ts
│   ├── expenses.controller.ts
│   ├── expenses.service.ts
│   └── expenses.module.ts
├── reports/
│   ├── reports.controller.ts
│   └── reports.module.ts
├── common/
│   └── interfaces/
│       ├── dto/
│       │   ├── create-category.dto.ts
│       │   └── pagination.dto.ts
│       └── response-payload.interfaces.ts
└── utils/
    └── slugify.ts
```

## Description

Built with [NestJS](https://github.com/nestjs/nest) framework for Day 6 Task - Expense Management API.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nestjs-mongo-advanced-day7
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy .env.example to .env
cp .env.example .env

# Update .env with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/expense-management
PORT=3000
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running on your system
mongod
```

## Running the Application

```bash
# development mode
npm run start:dev

# production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`

## API Endpoints

### Categories

- **POST** `/api/categories` - Create a new category
- **GET** `/api/categories` - Get all categories

### Expenses

- **POST** `/api/expenses` - Create a new expense
- **GET** `/api/expenses` - Get all expenses (with filters)
  - Query params: `month` (YYYY-MM), `categoryId`, `page`, `pageSize`

### Reports

- **GET** `/api/reports/summary` - Get monthly summary
  - Query params: `month` (YYYY-MM) - Required

## Request/Response Examples

### Create Category
```bash
POST /api/categories
Content-Type: application/json

{
  "name": "Food & Dining"
}

Response:
{
  "success": true,
  "message": "Category created",
  "data": {
    "_id": "...",
    "name": "Food & Dining",
    "slug": "food-dining",
    "isDeleted": false,
    "createdAt": "2025-10-15T06:41:00.000Z",
    "updatedAt": "2025-10-15T06:41:00.000Z"
  }
}
```

### Create Expense
```bash
POST /api/expenses
Content-Type: application/json

{
  "title": "Lunch at Restaurant",
  "amount": 1500,
  "categoryId": "67...",
  "date": "2025-10-15",
  "note": "Team lunch"
}

Response:
{
  "success": true,
  "message": "Expense created",
  "data": {
    "_id": "...",
    "title": "Lunch at Restaurant",
    "amount": 1500,
    "categoryId": "67...",
    "date": "2025-10-15T00:00:00.000Z",
    "note": "Team lunch",
    "isDeleted": false
  }
}
```

### Get Expenses with Filters
```bash
GET /api/expenses?month=2025-10&categoryId=67...&page=1&pageSize=10

Response:
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Get Monthly Summary
```bash
GET /api/reports/summary?month=2025-10

Response:
{
  "success": true,
  "data": {
    "month": "2025-10",
    "total": 15000,
    "byCategory": [
      {
        "categoryId": "67...",
        "categoryName": "Food & Dining",
        "total": 8000
      },
      {
        "categoryId": "67...",
        "categoryName": "Transportation",
        "total": 5000
      }
    ]
  }
}
```

## Database Schema

### Category Schema
- `name` (String, required, indexed)
- `slug` (String, required, unique, lowercase)
- `isDeleted` (Boolean, default: false, indexed)
- `timestamps` (createdAt, updatedAt)

### Expense Schema
- `title` (String, required)
- `amount` (Number, required)
- `categoryId` (ObjectId, required, indexed, ref: Category)
- `date` (Date, required, indexed)
- `note` (String, optional)
- `isDeleted` (Boolean, default: false, indexed)
- `timestamps` (createdAt, updatedAt)
- Compound index: `date + categoryId`

## Postman Collection

Import the `Expense-Management-API.postman_collection.json` file into Postman to test all endpoints.

## Project Structure Features

- ✅ Proper folder structure with DTOs, interfaces, schemas
- ✅ Soft delete implementation
- ✅ MongoDB indexing for performance
- ✅ ValidationPipe with class-validator
- ✅ Pagination support
- ✅ Standardized ResponsePayload format
- ✅ Month and category filtering
- ✅ Aggregation pipeline for reports

## License

This project is [MIT licensed](LICENSE).
