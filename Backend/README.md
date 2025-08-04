# Uber Clone Backend API Documentation

## Base URL

```
http://localhost:8000
```

## Environment Variables

```
PORT=8000
DATABASE_URI=mongodb://0.0.0.0/uber-clone
JWT_SECRET=uber-clone
```

---

## Authentication

All protected endpoints require a JWT token provided via:

- **Authorization Header**: `Authorization: Bearer <token>`
- **Cookie**: `token=<token>`

---

## Endpoints

### 1. User Registration

**POST** `/users/register-user`

**Request Body:**

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

**Validation:**

- `email`: Valid email format
- `firstname`: Minimum 2 characters
- `password`: Minimum 6 characters

**Response:** `201 Created`

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**

- `400`: Validation errors
- `500`: Email already exists

---

### 2. User Login

**POST** `/users/login`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**

- `400`: Validation errors
- `401`: Invalid credentials

---

### 3. User Logout

**POST** `/users/logout` 🔒

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses:**

- `401`: Invalid/missing token

---

### 4. Get User Profile

**GET** `/users/profile` 🔒

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "_id": "user_id",
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "createdAt": "2023-08-04T10:30:00.000Z"
}
```

**Error Responses:**

- `401`: Invalid/missing token
- `404`: User not found

---

## Status Codes

| Code  | Description                          |
| ----- | ------------------------------------ |
| `200` | Success                              |
| `201` | Created                              |
| `400` | Bad Request (validation errors)      |
| `401` | Unauthorized (authentication failed) |
| `404` | Not Found                            |
| `500` | Internal Server Error                |

---

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: 24-hour token expiry
- **Token Blacklisting**: Logout invalidates tokens
- **Input Validation**: express-validator middleware
- **CORS**: Cross-origin requests enabled

---

## Example Usage

### Register User

```bash
curl -X POST http://localhost:8000/users/register-user \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Profile

```bash
curl -X GET http://localhost:8000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Logout

```bash
curl -X POST http://localhost:8000/users/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
