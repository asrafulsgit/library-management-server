# 📚 Library Management

A RESTful API to manage books and borrowing operations, built with **Express**, **TypeScript**, **MongoDB**, and **Zod** for robust validation and consistent error handling.
 
---

## 🎯 Purpose of the Project

This project simulates a mini-library system for managing book inventory and borrowing records. The key goals include:

* Learning how to structure a TypeScript + Express backend project.
* Implementing schema validation using Zod.
* Handling custom error formats to match real-world production APIs.
* Working with MongoDB aggregations for reporting (borrow summary).

---

## 🚀 Features

* 📘 Create, read, update, and delete books.
* 📦 Borrow books and reduce available inventory.
* 📊 View total quantity of books borrowed (summary using aggregation).
* ✅ Strict validation with informative error responses.
* 🔍 Filter, sort, and limit books.

---

## 🧪 Technologies Used

* **Express** for API routing
* **TypeScript** for type safety
* **MongoDB** with Mongoose ODM
* **Zod** for schema validation


## ▶️ Setup Project locally

# 1. Clone the repository
git clone https://github.com/asrafulsgit/library-management-server.git

# 2. Navigate to the project folder
cd library-management

# 3. Install dependencies
npm install
# or
yarn install

# 4. Create a .env file and add the following:
PORT=8000
MONGO_URI= ''

# Running the Server in Development
npm run dev
# or
yarn dev


---

## 🌐 API Endpoints

### 🔹 Book Routes

#### ➕ Create Book

**POST** `/api/books`
Create a new book with validation.

**Request:**

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

#### 📄 Get All Books

**GET** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`
Returns filtered and sorted book list.

**Query Params:**

* `filter`: Genre filter (e.g., `FANTASY`)
* `sortBy`: Field to sort by (default: `createdAt`)
* `sort`: `asc` or `desc` (default: `desc`)
* `limit`: Result limit (default: `10`)

**Response:**

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
    {...}
  ]
}
```

#### 🔍 Get Book by ID

**GET** `/api/books/:bookId`

**Response:**

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

#### 💊 Update Book

**PUT** `/api/books/:bookId`

**Request:**

```json
{
  "copies": 50
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 50,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-20T08:30:00.000Z"
  }
}
```

#### ❌ Delete Book

**DELETE** `/api/books/:bookId`

**Response:**

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

### 🔹 Borrow Routes

#### ➕ Borrow a Book

**POST** `/api/borrow`
Deducts book copies and records the borrow.

**Request:**

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

#### 📊 Borrowed Books Summary

**GET** `/api/borrow`
Returns total quantity borrowed per book with book details.

**Response:**

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## ❗ Error Format

All validation errors follow this format:

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

---

