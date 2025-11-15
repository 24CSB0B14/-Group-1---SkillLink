# SkillLink Frontend

React frontend application for the SkillLink freelance platform.

## Project Info

**Tech Stack:**
- React 18
- Vite
- Tailwind CSS
- Shadcn UI Components
- React Router
- React Query
- Axios

## Getting Started

### Prerequisites

Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Navigate to the frontend directory
cd frontend

# Step 2: Install the necessary dependencies
npm install

# Step 3: Start the development server
npm run dev
```

### Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Available Scripts

- `npm run dev` - Start development server (http://localhost:8082)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── ui/          # Shadcn UI components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Route-level components
│   ├── services/        # API service layer
│   ├── App.jsx          # Main app component with routes
│   └── main.jsx         # Application entry point
├── public/              # Static assets
└── ...
```

## Technologies Used

- **Vite** - Fast build tool and dev server
- **React** - UI library
- **TypeScript** - Type safety for utilities
- **Shadcn UI** - Accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client

## Deployment

Build the project for production:

```sh
npm run build
```

The build output will be in the `dist/` directory.
