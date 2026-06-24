# Likhu Bhujee Ramechhap Youth Club — MERN Application

Official Likhue Bhujee Ramechhap Youth Club website clone built with the MERN stack.

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + React Router v6
- **Backend**: Node.js + Express + MongoDB + Mongoose + JWT Auth

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally

### Backend
```bash
cd backend
npm install
cp .env.example .env        # fill in your values
npm run seed                 # seed sample data
npm run dev                  # starts on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                  # starts on port 3000
```

## Production Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

See DEPLOYMENT.md for full step-by-step instructions.

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lbryc.com | admin123 |
| Subscriber | fan@lbryc.com | fan12345 |
