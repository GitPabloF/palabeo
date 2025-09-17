# API Documentation

This directory contains all the API routes for the Palabeo application. The API is built using Next.js App Router with TypeScript and follows RESTful conventions.

## Authentication

Most endpoints require authentication via NextAuth.js. The API uses JWT tokens for session management.

## Base URL

All API endpoints are prefixed with `/api/`

## Routes Overview

### Authentication Routes

#### `POST /api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**

- `201`: User created successfully
- `400`: Validation error
- `409`: User already exists

#### `GET/POST /api/auth/[...nextauth]`

NextAuth.js authentication endpoints for login/logout.

**Features:**

- Credentials provider (email/password)
- JWT session strategy
- Role-based access control

### Translation Routes

#### `GET /api/translate`

Translate a word using the WordReference API.

**Query Parameters:**

- `word` (required): The word to translate
- `from` (optional): Source language code (default: 'es')
- `to` (optional): Target language code (default: 'fr')
- `isReversedLang` (optional): Boolean to reverse language direction

**Response:**

```json
{
  "message": "success",
  "data": {
    "wordFrom": "hola",
    "wordTo": "bonjour",
    "typeCode": "intj",
    "typeName": "interjection",
    "langFrom": "es",
    "langTo": "fr",
    "exampleFrom": "¡Hola! ¿Cómo estás?",
    "exampleTo": "Salut ! Comment ça va ?"
  }
}
```

**Rate Limiting:** 429 status when rate limit exceeded

### User Routes

#### `GET /api/users`

Get all users (Admin only).

**Authentication:** Required (Admin role)

**Response:**

```json
{
  "message": "Users retrieved successfully",
  "data": [...],
  "count": 10
}
```

#### `POST /api/users`

Create a new user (Admin only).

**Authentication:** Required (Admin role)

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "userLanguage": "es",
  "learnedLanguage": "fr"
}
```

#### `GET /api/users/me`

Get current user's profile and recent words.

**Authentication:** Required

**Response:**

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "userLanguage": "es",
  "learnedLanguage": "fr",
  "role": "USER",
  "userWords": [...],
  "_count": {
    "userWords": 5
  }
}
```

#### `GET /api/users/[userId]`

Get a specific user by ID.

**Authentication:** Required (Own data or Admin)

**Parameters:**

- `userId`: User ID (UUID)

#### `PUT /api/users/[userId]`

Update a user's information.

**Authentication:** Required (Own data or Admin)

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "name": "New Name",
  "userLanguage": "en",
  "learnedLanguage": "es"
}
```

#### `DELETE /api/users/[userId]`

Delete a user account.

**Authentication:** Required (Own account only)

### User Words Routes

#### `GET /api/users/[userId]/words`

Get all words for a specific user.

**Authentication:** Required (Own data or Admin)

**Query Parameters:**

- `page` (optional): Page number for pagination
- `limit` (optional): Number of items per page

**Response:**

```json
{
  "message": "Words retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### `POST /api/users/[userId]/words/[wordId]`

Add a word to a user's vocabulary list.

**Authentication:** Required (Own data or Admin)

**Parameters:**

- `userId`: User ID (UUID)
- `wordId`: Word ID (number)

**Response:**

```json
{
  "message": "Word added successfully",
  "data": {
    "userWord": {
      "id": "relation_id",
      "userId": "user_id",
      "wordId": 123,
      "createdAt": "2024-01-01T00:00:00Z",
      "word": {...}
    }
  }
}
```

#### `DELETE /api/users/[userId]/words/[wordId]`

Remove a word from a user's vocabulary list.

**Authentication:** Required (Own data or Admin)

**Parameters:**

- `userId`: User ID (UUID)
- `wordId`: Word ID (number)

### Words Routes

#### `GET /api/words`

Search and filter words in the database.

**Authentication:** Required

**Query Parameters:**

- `langTo` (optional): Target language code
- `langFrom` (optional): Source language code
- `typeCode` (optional): Word type code
- `tag` (optional): Word tag
- `word` (optional): Search term

**Response:**

```json
[
  {
    "id": 123,
    "wordFrom": "hola",
    "wordTo": "bonjour",
    "langFrom": "es",
    "langTo": "fr",
    "typeCode": "intj",
    "typeName": "interjection",
    "exampleFrom": "¡Hola! ¿Cómo estás?",
    "exampleTo": "Salut ! Comment ça va ?",
    "tag": "greeting",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### `POST /api/words`

Create a new word in the database.

**Authentication:** Required

**Request Body:**

```json
{
  "wordFrom": "hola",
  "wordTo": "bonjour",
  "langFrom": "es",
  "langTo": "fr",
  "typeCode": "intj",
  "typeName": "interjection",
  "exampleFrom": "¡Hola! ¿Cómo estás?",
  "exampleTo": "Salut ! Comment ça va ?",
  "tag": "greeting"
}
```

#### `GET /api/words/[wordId]`

Get a specific word by ID.

**Authentication:** Required

**Parameters:**

- `wordId`: Word ID (number)

#### `DELETE /api/words/[wordId]`

Delete a word from the database (Admin only).

**Authentication:** Required (Admin role)

**Parameters:**

- `wordId`: Word ID (number)

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details" // optional
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (resource already exists)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Validation

All endpoints use comprehensive input validation with detailed error messages. Validation errors return a structured response:

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Rate Limiting

The translation endpoint (`/api/translate`) implements rate limiting to prevent abuse. Users exceeding the rate limit will receive a 429 status code.

## Security Features

- Input validation and sanitization
- SQL injection prevention via Prisma ORM
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- CORS protection
- Rate limiting on sensitive endpoints

## Database Schema

The API uses Prisma ORM with the following main entities:

- `User`: User accounts and profiles
- `Word`: Vocabulary words and translations
- `UserWord`: Many-to-many relationship between users and words

## Environment Variables

Required environment variables:

- `NEXTAUTH_SECRET`: JWT secret for NextAuth
- `NEXTAUTH_URL`: Application URL
- `DATABASE_URL`: PostgreSQL connection string
- `WORDREFERENCE_PROXY_URL`: Translation service proxy URL
