<<<<<<< HEAD
# -Group-1---SkillLink
A platform that helps freelancers and clients connect, communicate, and get work done together.
=======
# SkillLink - Freelance Platform

SkillLink is a comprehensive freelance platform that connects clients with freelancers for various projects and services.

## Repository

GitHub: [https://github.com/24CSB0B14/-Group-1---SkillLink](https://github.com/24CSB0B14/-Group-1---SkillLink)

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

#### Option 1: Install All Dependencies (Recommended)
```bash
npm run install:all
```

#### Option 2: Install Separately

1. Install root dependencies:
   ```bash
   npm install
   ```

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
Copy the example file and configure:
```bash
cd backend
cp .env.example .env
```

Update the following values in `backend/.env`:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong random secret for JWT tokens
- `ACCESS_TOKEN_SECRET` - Strong random secret for access tokens
- `REFRESH_TOKEN_SECRET` - Strong random secret for refresh tokens
- `CLOUDINARY_*` - Your Cloudinary credentials (for file uploads)
- `MAILTRAP_*` - Your Mailtrap credentials (for email in development)

#### Frontend (.env)
Copy the example file:
```bash
cd frontend
cp .env.example .env
```

The default configuration should work for local development.

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

Double-click the `start-dev.bat` file to start both servers simultaneously.

### Accessing the Application

- Frontend: http://localhost:8082
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

The frontend communicates with the backend through a well-structured service layer:

- `auth.service.js` - Authentication and user management
- `profile.service.js` - User profile operations
- `job.service.js` - Job posting and management
- `bid.service.js` - Bidding system
- `contract.service.js` - Contract management
- `escrow.service.js` - Escrow and payment handling
- `dispute.service.js` - Dispute resolution
- `review.service.js` - Rating and review system
- `notification.service.js` - User notifications
- `admin.service.js` - Administrative functions

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
>>>>>>> frontend-work
