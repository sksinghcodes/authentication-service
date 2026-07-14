
# Authentication Service

A user authentication service built with Node.js, Express, TypeScript, PostgreSQL, and JWT. It includes secure login, registration, and email verification.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Run Locally](#run-locally)
- [API Reference](#api-reference)
- [Request Examples](#request-examples)
- [Error Responses](#error-responses)
- [Security Features](#security-features)
- [Future Improvements / Roadmap](#future-improvements)

## Features

- User registration
- Email verification
- Secure authentication
- Input validation
- Global error handling


## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- node-postgres (pg)
- Nodemailer


## Project Structure
```
authentication-service/
├── postgres-migrate/
│   ├── migrations/      # Database migration files
│   └── templates/       # Templates used to generate new migrations
├── src/
│   ├── config/          # Environment variables and application configuration
│   ├── controllers/     # Handles HTTP requests and responses
│   ├── errors/          # Custom error classes
│   ├── middleware/      # Express middleware
│   ├── repositories/    # Database queries and data access
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types and interfaces
│   ├── utils/           # Shared utility functions
│   ├── app.ts           # Configures the Express application
│   └── index.ts         # Application entry point
├── .env.example         # Example environment variables
├── .gitignore           # Files and directories ignored by Git
├── package.json         # Project metadata, scripts, and dependencies
├── tsconfig.json        # TypeScript compiler configuration
└── README.md            # Project documentation
```

    
## Environment Variables

Create a `.env` file in the project root and configure the following required variables:

```env
DATABASE_URL=<database_url>
FRONTEND_URL=<frontend_url>
SMTP_HOST=<smtp_host>
SMTP_PORT=<smtp_port>
SMTP_USER=<smtp_user>
SMTP_PASSWORD=<smtp_password>
```

For the complete list of supported environment variables and their default values, see [`src/config/env.ts`](src/config/env.ts).

## Database Setup

1. Create a PostgreSQL database.

2. Update the `DATABASE_URL` environment variable in your `.env` file.

Example:

```env
DATABASE_URL=postgres://user:password@localhost:5432/authentication_service_db_local
```

3. Run the database migrations.

```bash
npm run migrate up
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

## API Reference

| Method | Endpoint             | Description                                              |
| :----- | :------------------- | :------------------------------------------------------- |
| POST   | `/auth/register`     | Register a new user and send an email verification link. |
| POST   | `/auth/verify-email` | Verify a user's email using the verification token.      |
more to be added

## Request Examples

### Register

**Request**

`POST /auth/register`

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "Password@123"
}
```

**Success Response (201 Created)**

```json
{
  "id": "0c4fd55f-4f69-473f-8df5-63b6d09ebd92",
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "email": "john@example.com"
}
```

---

### Verify Email

**Request**

`POST /auth/verify-email`

```json
{
  "token": "7b9d7a2f8d3d7a8c7f4a..."
}
```

**Success Response (200 OK)**

```json
{
  "success": true,
  "message": "Email verified successfully"
}
```
## Error Responses

### Validation Error (400 Bad Request)

Returned when one or more request fields fail validation.

```json
{
  "errors": {
    "email": "Email is invalid",
    "password": "Password length should not be less than 8"
  }
}
```

### Resource Conflict (400 Bad Request)

Returned when a unique field already exists.

```json
{
  "errors": {
    "email": "Email already exists"
  }
}
```

### Invalid or Expired Verification Token (400 Bad Request)

Returned when the verification token is missing, invalid, or has expired.

```json
{
  "errors": {
    "token": "Invalid or expired email verification token"
  }
}
```

### Internal Server Error (500 Internal Server Error)

Returned when an unexpected error occurs on the server.

```json
{
  "message": "Internal server error"
}
```

## Security Features
- Password hashing using bcrypt
- SHA-256 hashing for verification tokens
- Database transactions for consistency
- Email verification before account activation
- Parameterized SQL queries
- Global error handling

## Future Improvements / Roadmap
- JWT authentication
- Refresh tokens
- Password reset
- OAuth (Google/GitHub)
- Rate limiting
- Account lockout
- Two-factor authentication
- Session management
- API documentation (OpenAPI/Swagger)
- Unit and integration tests
