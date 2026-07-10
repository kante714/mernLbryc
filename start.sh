#!/bin/bash
echo "Starting LBRYC MERN App..."
echo ""
echo "Make sure MongoDB is running first!"
echo ""

# Backend
echo "[1/2] Starting backend on port 5000..."
cd backend && npm install && npm run seed && npm run dev &
BACKEND_PID=$!

sleep 3

# Frontend
echo "[2/2] Starting frontend on port 3000..."
cd ../frontend && npm install && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers starting..."
echo "   Backend:  http://localhost:5000/api/health"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers."

wait $BACKEND_PID $FRONTEND_PID
