# SkillLink - Frontend and Backend Connection

This document explains how the frontend and backend of the SkillLink application are connected.

## Architecture Overview

The SkillLink application follows a client-server architecture:
- **Frontend**: React application built with Vite
- **Backend**: Node.js/Express API server
- **Communication**: RESTful API calls using Axios

## Connection Setup

### 1. Environment Configuration

The connection between frontend and backend is configured through environment variables:

**Frontend (.env file):**
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Backend (.env file):**
```
PORT=3000
CORS_ORIGIN=http://localhost:8082
```

### 2. API Service Layer

We've created a service layer in the frontend to handle all API communications:

- `src/services/api.js` - Base Axios instance with interceptors
- `src/services/auth.service.js` - Authentication related API calls
- `src/services/profile.service.js` - User profile related API calls
- `src/services/job.service.js` - Job related API calls
- `src/services/bid.service.js` - Bid related API calls

### 3. CORS Configuration

The backend is configured to accept requests from the frontend origins:

```javascript
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "http://localhost:8080",
    credentials : true,
    methods : ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
```

### 4. Proxy Configuration

The frontend Vite configuration includes a proxy for development:

```javascript
server: {
  host: "::",
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## Authentication Flow

1. User submits login/signup form
2. Frontend calls authentication service
3. Authentication service makes API request to backend
4. Backend validates credentials and returns JWT token
5. Frontend stores token in localStorage
6. Subsequent requests include token in Authorization header

## Data Flow

1. React components call service functions
2. Service functions make Axios requests to backend API
3. Backend processes requests and returns JSON responses
4. Frontend receives responses and updates component state

## Testing the Connection

You can test the connection by:
1. Starting both frontend and backend servers
2. Visiting the landing page to see connection status
3. Navigating to `/api-test` to run connection tests
4. Using the login/signup forms to test authentication

## Error Handling

The application includes:
- Request interceptors to add authentication headers
- Response interceptors to handle common errors (401, etc.)
- Error boundaries in React components
- Toast notifications for user feedback