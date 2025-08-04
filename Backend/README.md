# Uber Clone Backend API Documentation

## User Registration API

### Overview

This API endpoint allows new users to register and create an account in the system. Upon successful registration, the user receives an authentication token and their profile information.

---

## POST `/users/register-user`

### Description

Registers a new user in the system with email, name, and password. The endpoint validates the input data, hashes the password for security, creates the user in the database, and returns an authentication token.

### Request

#### Headers

```
Content-Type: application/json
```

#### Request Body

The request body must be a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

#### Required Fields

| Field                | Type   | Description          | Validation Rules                                                |
| -------------------- | ------ | -------------------- | --------------------------------------------------------------- |
| `fullname.firstname` | String | User's first name    | ✅ Required, minimum 2 characters                               |
| `fullname.lastname`  | String | User's last name     | ⚪ Optional                                                     |
| `email`              | String | User's email address | ✅ Required, must be a valid email format, minimum 5 characters |
| `password`           | String | User's password      | ✅ Required, minimum 6 characters                               |

### Responses

#### Success Response

**Status Code:** `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60f7b1b3b3f3f3f3f3f3f3f3",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketIO": null,
    "createdAt": "2023-08-04T10:30:00.000Z",
    "updatedAt": "2023-08-04T10:30:00.000Z"
  }
}
```

#### Validation Error Response

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "type": "field",
      "value": "jo",
      "msg": "First Name must be atleast 2 characters long",
      "path": "fullname.firstname",
      "location": "body"
    },
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "123",
      "msg": "Password must be atleast 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

#### Duplicate Email Error Response

**Status Code:** `500 Internal Server Error` (when email already exists)

```json
{
  "error": "Email already exists"
}
```

### Example Requests

#### cURL Example

```bash
curl -X POST http://localhost:8000/users/register-user \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

#### JavaScript (Fetch API) Example

```javascript
const response = await fetch("http://localhost:8000/users/register-user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    fullname: {
      firstname: "John",
      lastname: "Doe",
    },
    email: "john.doe@example.com",
    password: "securepassword123",
  }),
});

const data = await response.json();
console.log(data);
```

### Status Codes Summary

| Status Code | Description                                           |
| ----------- | ----------------------------------------------------- |
| `201`       | User successfully created                             |
| `400`       | Validation errors in request body                     |
| `500`       | Server error (e.g., duplicate email, database issues) |

### Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with a salt round of 10 before storage
- **JWT Token**: Upon successful registration, a JWT token is generated for authentication
- **Input Validation**: All inputs are validated using express-validator middleware
- **Unique Email**: Email addresses must be unique across the system

### Database Schema

The user data is stored in MongoDB with the following schema:

```javascript
{
  fullname: {
    firstname: { type: String, required: true, minlength: 2 },
    lastname: { type: String }
  },
  email: { type: String, required: true, unique: true, minlength: 5 },
  password: { type: String, required: true, minlength: 6, select: false },
  socketIO: { type: String }
}
```

### Notes

- The password field is excluded from query results by default (`select: false`)
- The `lastname` field is optional and can be omitted from the request
- The API uses JSON Web Tokens (JWT) for authentication
- The server runs on port 8000 by default (configurable via environment variables)
- MongoDB connection is required for the API to function properly

### Environment Variables Required

```
PORT=8000
DATABASE_URI=mongodb://0.0.0.0/uber-clone
JWT_SECRET=uber-clone
```
