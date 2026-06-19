# 🚀 Freecode - Quick Start Guide

## 📖 Documentation Files

Start with these to understand the project:

1. **README.md** - Complete overview, features, API docs, and deployment guide
2. **PHASE_1_COMPLETE.md** - What was built in Phase 1
3. **PHASE_2_PLAN.md** - Detailed plan for Phase 2 (code execution engine)
4. **BUILD_SUMMARY.md** - Statistics, achievements, and next steps

## 🏃 Start Development (5 minutes)

### Prerequisites
- Docker & Docker Compose installed
- Node.js 20+ (if running without Docker)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone and setup
cd Freecode
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Initialize database
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed

# 4. Access the app
# Frontend: http://localhost:3000
# API: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
```

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Worker:**
```bash
cd worker
npm install
npm run dev
```

## 🧪 Test the System

### 1. Create Account
- Go to http://localhost:3000/register
- Fill in email, username, password
- Click "Create Account"

### 2. Login
- Go to http://localhost:3000/login
- Use your credentials
- Should redirect to /problems

### 3. Browse Problems
- Click "Problems" in sidebar
- See list of problems (3 sample problems included)
- Use filters: difficulty, search, topics
- Click on a problem to see details

### 4. Check API Documentation
- Go to http://localhost:3001/api/docs
- Try out any endpoint (requires auth token)

## 📊 Project Statistics

- **Total Files**: 85+
- **Lines of Code**: 5,000+
- **Languages**: TypeScript, JavaScript, SQL
- **Frameworks**: React, NestJS, Docker
- **Database Models**: 10
- **API Endpoints**: 20+

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│              http://localhost:3000                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/REST API
┌────────────────────┴────────────────────────────────────┐
│                Backend (NestJS)                          │
│              http://localhost:3001                       │
└────────┬─────────────────────────────────┬──────────────┘
         │                                 │
    ┌────▼─────┐                    ┌────▼──────┐
    │PostgreSQL │                    │  Redis    │
    │Database   │                    │Cache/Queue│
    └───────────┘                    └─────┬─────┘
                                          │
                                    ┌─────▼──────────┐
                                    │ Worker Service │
                                    │ (Phase 2)      │
                                    └────────────────┘
```

## 🔑 Key API Endpoints

### Authentication
```bash
# Register
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST /api/v1/auth/login
{
  "emailOrUsername": "user@example.com",
  "password": "SecurePass123"
}
```

### Problems
```bash
# Get all problems
GET /api/v1/problems?page=1&limit=20&difficulty=EASY

# Get problem details
GET /api/v1/problems/two-sum

# Get test cases
GET /api/v1/problems/{problemId}/testcases
```

### User Progress
```bash
# Get user stats
GET /api/v1/users/progress
Authorization: Bearer {token}

# Bookmark a problem
POST /api/v1/users/bookmarks/{problemId}
Authorization: Bearer {token}
```

## 🔐 Default Credentials

After running `prisma:seed`, no default users are created. You must:
1. Register a new account
2. Login with your credentials

## 📁 Important Files

### Backend
- `backend/src/main.ts` - Entry point
- `backend/src/app.module.ts` - Root module
- `backend/prisma/schema.prisma` - Database schema
- `backend/.env` - Environment variables

### Frontend
- `frontend/src/App.tsx` - Router setup
- `frontend/src/main.tsx` - Entry point
- `frontend/src/services/api.ts` - API client
- `frontend/src/store/authStore.ts` - Auth state

### Worker
- `worker/src/index.ts` - Entry point
- `worker/src/execution/executor.ts` - Code executor

## 🛠️ Common Tasks

### Update Database Schema
```bash
# Edit backend/prisma/schema.prisma
# Then run:
docker-compose exec backend npm run prisma:migrate
# Or manually:
cd backend && npm run prisma:migrate
```

### Add Sample Data
```bash
docker-compose exec backend npm run prisma:seed
# Or manually:
cd backend && npm run prisma:seed
```

### View Database
```bash
# Using Prisma Studio
docker-compose exec backend npm run prisma:studio
# Open http://localhost:5555
```

### Run Tests
```bash
# Backend tests
docker-compose exec backend npm run test

# Frontend tests
docker-compose exec frontend npm run test
```

### Format Code
```bash
# Backend
docker-compose exec backend npm run format

# Frontend
docker-compose exec frontend npm run format
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000/3001
lsof -i :3000
kill -9 {PID}
```

### Database Connection Failed
```bash
# Ensure PostgreSQL is running
docker-compose logs postgres

# Reset database
docker-compose exec backend npm run db:reset
```

### Node Modules Issues
```bash
# Clear and reinstall
rm -rf backend/node_modules frontend/node_modules worker/node_modules
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Learning Resources

### NestJS
- Official Docs: https://docs.nestjs.com
- Video Tutorial: https://www.youtube.com/watch?v=GHTA143_b-s

### React
- Official Docs: https://react.dev
- React Router: https://reactrouter.com

### Prisma
- Official Docs: https://www.prisma.io/docs
- Video Tutorial: https://www.youtube.com/watch?v=RnQXEsNeo6M

### TailwindCSS
- Official Docs: https://tailwindcss.com/docs
- Component Library: https://tailwindui.com

## 🚀 Next Phase

Phase 2 focuses on the **Code Execution Engine**:
- Docker-based code execution
- Monaco Editor integration
- Support for 9+ programming languages
- Real-time test execution

See `PHASE_2_PLAN.md` for details.

## 📞 Need Help?

1. Check `README.md` for comprehensive documentation
2. Review API docs at http://localhost:3001/api/docs
3. Check `PHASE_1_COMPLETE.md` for what was built
4. Look at error logs: `docker-compose logs {service}`

## ✅ Success Checklist

After starting the app:
- [ ] Frontend loads at http://localhost:3000
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can see problems list
- [ ] Can view problem details
- [ ] API docs load at http://localhost:3001/api/docs
- [ ] Database seeded with sample problems

## 🎯 What's Working

✅ Authentication (register, login, token refresh)
✅ Problem listing with filters
✅ Problem search and sorting
✅ User progress tracking foundation
✅ Bookmark functionality structure
✅ API versioning and documentation
✅ Dark/light theme
✅ Responsive design

## 🔲 Coming in Phase 2

🔲 Code execution engine
🔲 Monaco Editor integration
🔲 Real-time code submission
🔲 Test result display
🔲 Problem import pipeline
🔲 Discussions & comments
🔲 Admin dashboard

---

**Ready to start?** Run `docker-compose up -d` and visit http://localhost:3000 ! 🚀
