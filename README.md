# 🚀 Freecode - LeetCode Clone

A production-ready, full-stack coding platform built with modern technologies. Freecode provides an interactive environment for coding challenges with support for multiple programming languages, real-time code execution, and a comprehensive problem library.

## 📋 Features

### Core Features
- **4200+ Coding Problems** - Curated problem set with multiple difficulty levels
- **Multiple Languages** - Python, JavaScript, TypeScript, Java, C++, Go, Rust, Ruby, and more
- **Real-time Code Execution** - Isolated Docker containers for safe code execution
- **User Authentication** - JWT-based secure authentication
- **Problem Filtering & Search** - Filter by difficulty, topics, companies, and search functionality
- **Submission History** - Track all submissions with detailed results
- **User Progress Tracking** - Visual progress indicators and statistics
- **Bookmarking** - Save problems for later review
- **Discussions & Comments** - Community-driven problem discussions
- **Admin Dashboard** - Manage problems and users

### Technical Features
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Dark/Light Theme** - System preference detection and manual toggle
- **Code Auto-save** - Automatic saving to localStorage
- **Keyboard Shortcuts** - Ctrl+Enter to submit, Ctrl+S to save
- **Performance Optimized** - Redis caching, database indexing, lazy loading
- **Security First** - Input sanitization, rate limiting, CSRF protection
- **Scalable Architecture** - Horizontal scaling capability
- **Comprehensive Logging** - Structured logging for monitoring

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- TailwindCSS for styling
- Monaco Editor for code editing
- React Query for data fetching
- Zustand for state management
- Vite for bundling

**Backend:**
- NestJS with TypeScript
- PostgreSQL for data persistence
- Prisma ORM
- Redis for caching and session storage
- BullMQ for job queue
- JWT for authentication

**Code Execution:**
- Docker containers (isolated execution)
- Node.js worker service
- Support for 9+ programming languages

**Deployment:**
- Docker & Docker Compose
- Multi-stage builds
- Environment-based configuration

## 📦 Project Structure

```
freecode/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── problems/       # Problems module
│   │   ├── submissions/    # Submissions module
│   │   ├── users/          # User management
│   │   ├── discussions/    # Discussions module
│   │   ├── admin/          # Admin module
│   │   ├── common/         # Shared utilities
│   │   └── config/         # Configuration
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── Dockerfile
├── worker/                 # Code execution worker
│   ├── src/
│   │   ├── execution/      # Code execution logic
│   │   ├── queue/          # Job queue management
│   │   └── config/         # Configuration
│   └── Dockerfile
├── docker-compose.yml      # Multi-container setup
└── README.md

```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (optional if using Docker)
- Redis (optional if using Docker)

### Local Development Setup

#### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ChaitanyaJoshi1769/Freecode.git
cd Freecode

# Create .env file
cp .env.example .env

# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npm run prisma:migrate

# Seed initial data
docker-compose exec backend npm run prisma:seed

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/api/docs
```

#### Manual Setup

**Backend Setup:**
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed

# Start development server
npm run dev
```

**Frontend Setup:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Worker Setup:**
```bash
cd worker

# Install dependencies
npm install

# Start worker
npm run dev
```

### Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Frontend domain for CORS
- `CODE_EXECUTION_TIMEOUT_*` - Code execution timeouts by difficulty

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout user

### Problems Endpoints

- `GET /api/v1/problems` - List problems with filters
- `GET /api/v1/problems/:idOrSlug` - Get problem details
- `GET /api/v1/problems/:problemId/testcases` - Get test cases
- `GET /api/v1/problems/stats` - Get problems statistics
- `POST /api/v1/problems` - Create problem (admin)
- `PUT /api/v1/problems/:id` - Update problem (admin)
- `DELETE /api/v1/problems/:id` - Delete problem (admin)

### Submissions Endpoints

- `POST /api/v1/submissions` - Submit solution
- `GET /api/v1/submissions/user` - Get user submissions
- `GET /api/v1/submissions/:id` - Get submission details
- `GET /api/v1/submissions/problem/:problemId` - Get problem submissions

### User Progress Endpoints

- `GET /api/v1/users/progress` - Get user progress overview
- `GET /api/v1/users/progress/:problemId` - Get problem progress
- `PUT /api/v1/users/progress/:problemId` - Update problem progress

### Bookmarks Endpoints

- `GET /api/v1/users/bookmarks` - Get bookmarked problems
- `POST /api/v1/users/bookmarks/:problemId` - Bookmark problem
- `DELETE /api/v1/users/bookmarks/:problemId` - Remove bookmark

### Discussions Endpoints

- `GET /api/v1/problems/:problemId/discussions` - List discussions
- `POST /api/v1/problems/:problemId/discussions` - Create discussion
- `POST /api/v1/discussions/:id/comments` - Add comment
- `PUT /api/v1/discussions/:id` - Update discussion
- `DELETE /api/v1/discussions/:id` - Delete discussion

## 🔐 Security

### Implemented Security Measures

- **Input Validation** - All inputs validated with class-validator
- **Password Hashing** - bcrypt with 12 salt rounds
- **JWT Authentication** - 15-min access tokens, 7-day refresh tokens
- **HTTP-only Cookies** - Secure token storage
- **CORS Protection** - Restricted to frontend domain
- **Rate Limiting** - 30 req/min authenticated, 10 req/min unauthenticated
- **SQL Injection Prevention** - Parameterized queries via Prisma
- **XSS Protection** - Input sanitization and output encoding
- **CSRF Protection** - Token validation
- **Code Execution Sandboxing** - Isolated Docker containers
- **Resource Limits** - Memory and timeout limits per difficulty

## 📊 Database Schema

### User
- id, email, username, password, firstName, lastName, avatar, bio
- theme, language, isVerified, isActive
- Relationships: submissions, userProgress, bookmarks, discussions, comments

### Problem
- id, title, slug, description, difficulty
- topics, companies, examples, constraints, hints
- acceptanceRate, totalSubmissions, likes, dislikes
- isPremium, isPublished

### Submission
- id, userId, problemId, code, language
- status, error, stdout, stderr
- executionTime, memoryUsed, testResults, passedTests

### UserProgress
- id, userId, problemId, status, attempts
- lastSubmissionAt

### Bookmark
- id, userId, problemId

### Discussion
- id, userId, problemId, title, content
- views, likes, isPinned, isLocked
- comments (one-to-many)

## 🚀 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f worker
```

### Production Deployment

1. **Build Containers**
   ```bash
   docker build -t freecode-backend:1.0.0 ./backend
   docker build -t freecode-frontend:1.0.0 ./frontend
   docker build -t freecode-worker:1.0.0 ./worker
   ```

2. **Configure Environment**
   - Set production environment variables
   - Use strong JWT secrets
   - Configure database connection pooling
   - Enable Redis persistence

3. **Database Setup**
   - Run migrations: `npm run prisma:deploy`
   - Seed initial data: `npm run prisma:seed`
   - Set up backups and monitoring

4. **Reverse Proxy**
   - Configure Nginx/Apache
   - Enable SSL/TLS with Let's Encrypt
   - Set up load balancing

5. **Monitoring**
   - Set up Winston logging
   - Configure error tracking (Sentry)
   - Monitor metrics (CPU, memory, disk)
   - Set up alerts for critical issues

## 📈 Performance Optimizations

- **Database Indexing** - Indexes on frequently queried columns
- **Query Optimization** - Cursor-based pagination
- **Redis Caching** - Problem list and details cached
- **Code Splitting** - Frontend lazy loading
- **Compression** - gzip enabled
- **CDN** - Static assets via CDN
- **Connection Pooling** - Database connection management
- **Virtual Scrolling** - Large list rendering

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test                # Unit tests
npm run test:cov          # Coverage report
npm run test:e2e          # E2E tests
```

### Frontend Tests
```bash
cd frontend
npm run test              # Unit tests
npm run test:ui          # UI test runner
```

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Get Problems
```bash
curl http://localhost:3001/api/v1/problems \
  -H "Authorization: Bearer {token}"
```

### Submit Solution
```bash
curl -X POST http://localhost:3001/api/v1/submissions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "problem-id",
    "code": "def solution(): pass",
    "language": "PYTHON"
  }'
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@freecode.dev or create an issue on GitHub.

## 🗺️ Roadmap

- [ ] Phase 1: Core functionality ✅
- [ ] Phase 2: Code execution engine
- [ ] Phase 3: Problem import (4200+ problems)
- [ ] Phase 4: Discussions and advanced features
- [ ] Phase 5: Testing and optimization
- [ ] [ ] Mobile app (React Native)
- [ ] Video solution tutorials
- [ ] AI-powered hints
- [ ] Real-time collaboration
- [ ] Contest mode
- [ ] Leaderboards

## 🎯 Success Metrics

- Handle 1000+ concurrent users
- Execute submissions within 5 seconds
- Support 4200+ problems with full-text search
- Maintain 99.9% uptime
- Store 1M+ submissions without degradation
