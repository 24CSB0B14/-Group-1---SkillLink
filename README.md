# SkillLink - Freelance Platform

SkillLink is a comprehensive freelance platform that connects clients with freelancers for various projects and services.

## Project Structure

```
SkillLink_OOPs_Project/
├── backend/           # Node.js/Express API server
│   ├── src/           # Source code
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── ...
│   └── ...
├── frontend/          # React/Vite frontend application
│   ├── src/           # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level components
│   │   ├── services/     # API service layer
│   │   └── ...
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Environment Setup

#### Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
PORT=3000
CORS_ORIGIN=http://localhost:8080,http://localhost:8081
MONGODB_URI=mongodb://localhost:27017/skilllink
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
# Add other required environment variables
```

#### Frontend (.env)
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Running the Application

#### Option 1: Run servers separately

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

#### Option 2: Run both servers with batch file (Windows)

Double-click the `start-dev.bat` file to start both servers simultaneously.

### Accessing the Application

- Frontend: http://localhost:8080 or http://localhost:8081 (if 8080 is in use)
- Backend API: http://localhost:3000
- Backend Health Check: http://localhost:3000/api/v1/healthCheck

## Features

### Core Functionality
- User authentication (signup/login)
- Role-based dashboards (Client/Freelancer)
- Profile management
- Job posting and bidding
- Contract management
- Escrow system
- Work delivery
- Chat system
- Review and rating system

### Advanced Features
- Admin dashboard
- Dispute resolution
- Job search and filtering
- Notifications
- Settings management

## API Services

The frontend communicates with the backend through a service layer:

- `auth.service.js` - Authentication APIs
- `profile.service.js` - Profile management APIs
- `job.service.js` - Job-related APIs
- `bid.service.js` - Bid-related APIs

## Development

### Technologies Used

#### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Cloudinary for media storage
- Nodemailer for emails

#### Frontend
- React
- Vite
- Tailwind CSS
- Shadcn UI components
- React Router
- Axios for API calls
- React Query for data fetching

## Testing the Connection

1. Start both frontend and backend servers
2. Visit the landing page to see connection status
3. Navigate to `/api-test` to run connection tests
4. Use the login/signup forms to test authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is for educational purposes as part of an OOPs course project.