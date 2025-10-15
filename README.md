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

- **POST** `/categories/create` - Create a new category
- **GET** `/categories/get-all` - Get all categories with pagination
  - Query params: `page` (default: 1), `limit` (default: 10)

### Expenses

- **POST** `/expenses/create-expense` - Create a new expense
- **GET** `/expenses/get-all-expenses` - Get all expenses (with filters)
  - Query params: `month` (1-12), `year` (YYYY), `categoryId`, `page`, `limit`

### Reports

- **GET** `/reports/summary` - Get monthly summary
  - Query params: `month` (1-12), `year` (YYYY) - Required

## Request/Response Examples

### Create Category
```bash
POST /categories/create
Content-Type: application/json

{
  "name": "Food & Dining"
}

Response:
{
  "success": true,
  "message": "Category created",
  "data": {
    "_id": "670e1234567890abcdef1234",
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
POST /expenses/create-expense
Content-Type: application/json

{
  "title": "Grocery Shopping",
  "amount": 1500,
  "categoryId": "670e1234567890abcdef1234",
  "date": "2025-10-15T07:00:00.000Z",
  "note": "Weekly groceries from local market"
}

Response:
{
  "success": true,
  "message": "Expense created",
  "data": {
    "_id": "670e9876543210fedcba9876",
    "title": "Grocery Shopping",
    "amount": 1500,
    "categoryId": "670e1234567890abcdef1234",
    "date": "2025-10-15T07:00:00.000Z",
    "note": "Weekly groceries from local market",
    "isDeleted": false,
    "createdAt": "2025-10-15T10:30:00.000Z",
    "updatedAt": "2025-10-15T10:30:00.000Z"
  }
}
```

### Get All Expenses
```bash
GET /expenses/get-all-expenses?page=1&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "_id": "670e9876543210fedcba9876",
      "title": "Grocery Shopping",
      "amount": 1500,
      "categoryId": {
        "_id": "670e1234567890abcdef1234",
        "name": "Food & Dining",
        "slug": "food-dining"
      },
      "date": "2025-10-15T07:00:00.000Z",
      "note": "Weekly groceries",
      "isDeleted": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Filter Expenses by Month
```bash
GET /expenses/get-all-expenses?month=10&year=2025&page=1&limit=10
```

### Filter Expenses by Category
```bash
GET /expenses/get-all-expenses?categoryId=670e1234567890abcdef1234&page=1&limit=10
```

### Filter by Month & Category
```bash
GET /expenses/get-all-expenses?month=10&year=2025&categoryId=670e1234567890abcdef1234&page=1&limit=10
```

### Get Monthly Summary
```bash
GET /reports/summary?month=10&year=2025

Response:
{
  "success": true,
  "data": {
    "month": 10,
    "year": 2025,
    "totalExpenses": 15000,
    "expenseCount": 45,
    "byCategory": [
      {
        "_id": "670e1234567890abcdef1234",
        "categoryName": "Food & Dining",
        "total": 8000,
        "count": 20
      },
      {
        "_id": "670e1234567890abcdef5678",
        "categoryName": "Transportation",
        "total": 5000,
        "count": 15
      },
      {
        "_id": "670e1234567890abcdef9012",
        "categoryName": "Entertainment",
        "total": 2000,
        "count": 10
      }
    ]
  }
}
```

## Database Schema

### Category Schema
```typescript
@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}
```

**Fields:**
- `name` (String, required, indexed, trimmed)
- `slug` (String, required, unique, lowercase)
- `isDeleted` (Boolean, default: false, indexed)
- `timestamps` (createdAt, updatedAt) - Auto-generated

### Expense Schema
```typescript
@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true, type: Date, index: true })
  date: Date;

  @Prop()
  note?: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}
```

**Fields:**
- `title` (String, required, trimmed)
- `amount` (Number, required)
- `categoryId` (ObjectId, required, indexed, ref: Category)
- `date` (Date, required, indexed, ISO 8601 format)
- `note` (String, optional)
- `isDeleted` (Boolean, default: false, indexed)
- `timestamps` (createdAt, updatedAt) - Auto-generated

**Indexes:**
- Single indexes: `categoryId`, `date`, `isDeleted`
- Compound index: `{ date: 1, categoryId: 1 }`

### DTOs (Data Transfer Objects)

#### CreateCategoryDto
```typescript
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

#### CreateExpenseDto
```typescript
export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  amount: number;

  @IsMongoId()
  categoryId: string;

  @IsDateString()
  date: string; // ISO 8601 format

  @IsOptional()
  @IsString()
  note?: string;
}
```

#### FilterExpenseDto
```typescript
export class FilterExpenseDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;
}
```

#### PaginationDto
```typescript
export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
```

## Postman Collection

A complete Postman collection is available in the `postman/` folder.

**Import Instructions:**
1. Open Postman
2. Click **Import** button
3. Select `postman/expense-management-api.postman_collection.json`
4. Collection will be imported with all endpoints

**Collection includes:**
- ✅ All Category endpoints (Create, List)
- ✅ All Expense endpoints (Create, List, Filter by Month/Category)
- ✅ Reports endpoint (Monthly Summary)
- ✅ Pre-configured variables (baseUrl, categoryId)
- ✅ Sample request bodies

**Usage:**
- Update `{{categoryId}}` variable after creating a category
- Default `{{baseUrl}}` is set to `http://localhost:3000`

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
