@echo off
echo Starting SkillLink Development Servers...
echo ======================================

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers should be starting now.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:8080 or http://localhost:8081
echo.