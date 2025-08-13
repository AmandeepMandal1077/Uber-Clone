# Yatra Backend API

A backend server for the Yatra ride-sharing application (Uber Clone).

## Setup & Configuration

### Prerequisites
- Node.js (v14+)
- MongoDB

### Environment Variables
Create a `.env` file in the root directory with:

```
PORT=8000
DATABASE_URI=mongodb://0.0.0.0/uber-clone
JWT_SECRET=your-secret-key
OPEN_ROUTE_API_KEY=your-openroute-api-key
```

### Installation
```bash
npm install
npm start
```

## Core Features

### Authentication System
- JWT-based authentication for both Users and Captains
- Token blacklisting for secure logout
- Password hashing with bcrypt

### User Management
- User registration and login
- Profile management
- Ride history

### Captain Management
- Captain registration and login
- Vehicle information management
- Ride acceptance and history

### Map Services
- Location geocoding (address to coordinates)
- Distance and time calculation between locations
- Location search with autocomplete suggestions

### Ride Management
- Ride creation with fare calculation
- OTP verification for ride start
- Ride status tracking (pending, in-progress, completed, cancelled)

## API Endpoints

### User Endpoints
- `POST /users/register-user` - Register a new user
- `POST /users/login` - Login existing user
- `POST /users/logout` - Logout user
- `GET /users/profile` - Get user profile

### Captain Endpoints
- `POST /captains/register` - Register a new captain
- `POST /captains/login` - Login existing captain
- `POST /captains/logout` - Logout captain
- `GET /captains/profile` - Get captain profile

### Map Endpoints
- `GET /map/get-coordinates` - Convert address to coordinates
- `GET /map/get-distance-time` - Calculate distance and time between locations
- `GET /map/get-suggestions` - Get location suggestions based on search text

### Ride Endpoints
- `POST /rides/create-ride` - Create a new ride request

## Authentication

All protected endpoints require a JWT token provided via:
- **Header**: `Authorization: Bearer <token>`
- **Cookie**: `token=<token>`

## Status Codes

| Code  | Description                      |
| ----- | -------------------------------- |
| `200` | Success                          |
| `201` | Created                          |
| `400` | Bad Request (validation errors)  |
| `401` | Unauthorized                     |
| `404` | Not Found                        |
| `500` | Internal Server Error            |
