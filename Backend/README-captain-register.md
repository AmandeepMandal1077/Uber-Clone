# Captain API Documentation

## Base URL

```
http://localhost:8000/captain
```

## Authentication

Protected endpoints require a JWT token provided via:

- **Authorization Header**: `Authorization: Bearer <token>`
- **Cookie**: `token=<token>`

---

## Endpoints

### 1. Captain Registration

**POST** `/register`

**Request Body:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securepassword123",
  "vehicle": {
    "type": "Sedan",
    "color": "Black",
    "capacity": 4,
    "number": "ABC1234"
  }
}
```

**Validation:**

- `firstname`: Minimum 3 characters
- `email`: Valid email format, must be unique
- `password`: Minimum 6 characters
- `vehicle.type`: Required
- `vehicle.color`: Minimum 3 characters
- `vehicle.capacity`: Integer, minimum 1
- `vehicle.number`: Required

**Response:** `201 Created`

```json
{
  "token": "jwt_token_here",
  "captain": {
    "_id": "captain_id",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "vehicleType": "Sedan",
    "vehicleColor": "Black",
    "vehicleCapacity": 4,
    "vehicleNumber": "ABC1234"
  }
}
```

**Error Responses:**

- `400`: Validation errors or captain already registered

---

### 2. Captain Login

**POST** `/login`

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
  "captain": {
    "_id": "captain_id",
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "vehicleType": "Sedan",
    "vehicleColor": "Black",
    "vehicleCapacity": 4,
    "vehicleNumber": "ABC1234"
  }
}
```

**Error Responses:**

- `400`: Validation errors
- `401`: Invalid credentials

---

### 3. Captain Logout

**POST** `/logout` 🔒

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

### 4. Get Captain Profile

**GET** `/profile` 🔒

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "_id": "captain_id",
  "fullname": { "firstname": "John", "lastname": "Doe" },
  "email": "john.doe@example.com",
  "vehicleType": "Sedan",
  "vehicleColor": "Black",
  "vehicleCapacity": 4,
  "vehicleNumber": "ABC1234",
  "createdAt": "2023-08-04T10:30:00.000Z"
}
```

**Error Responses:**

- `401`: Invalid/missing token
- `404`: Captain not found

---

## Example Usage

### Register Captain

```bash
curl -X POST http://localhost:8000/captain/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"John","lastname":"Doe"},"email":"john@example.com","password":"password123","vehicle":{"type":"Sedan","color":"Black","capacity":4,"number":"ABC1234"}}'
```

### Login

```bash
curl -X POST http://localhost:8000/captain/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Profile

```bash
curl -X GET http://localhost:8000/captain/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Logout

```bash
curl -X POST http://localhost:8000/captain/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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
- **Unique Email**: Email must be unique per captain
