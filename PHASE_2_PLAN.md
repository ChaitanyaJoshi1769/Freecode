# 🎯 Phase 2 - Code Execution Engine & Code Editor

## Overview
Phase 2 focuses on implementing the core code execution engine and Monaco code editor integration. This enables users to write, execute, and test code against multiple programming languages.

## 🔧 Phase 2 Objectives

### 1. Code Execution Engine (Worker Service)
Implement Docker-based code execution with support for 9+ languages.

#### Tasks
- [ ] **Docker Integration**
  - [ ] Setup Dockerode for container management
  - [ ] Create Docker images for each language
  - [ ] Implement container lifecycle management
  - [ ] Resource limit configuration

- [ ] **Language Executors**
  - [ ] Python 3.11 executor
  - [ ] JavaScript/Node.js 20 executor
  - [ ] Java 17 executor
  - [ ] C++ 20 executor
  - [ ] Go 1.21 executor
  - [ ] Rust 1.75 executor
  - [ ] Ruby 3.2 executor
  - [ ] C# executor
  - [ ] Kotlin executor

- [ ] **Test Case Execution**
  - [ ] Read test cases from database
  - [ ] Execute code with test inputs
  - [ ] Capture output (stdout/stderr)
  - [ ] Compare with expected output
  - [ ] Return detailed test results

- [ ] **Performance Metrics**
  - [ ] Execution time tracking
  - [ ] Memory usage monitoring
  - [ ] Timeout enforcement
  - [ ] Resource limit handling

- [ ] **Error Handling**
  - [ ] Compilation errors
  - [ ] Runtime errors
  - [ ] Timeout errors
  - [ ] Memory limit exceeded
  - [ ] Stack traces and debugging info

### 2. Code Editor UI (Frontend)
Integrate Monaco Editor for rich code editing experience.

#### Tasks
- [ ] **Monaco Editor Setup**
  - [ ] Integrate @monaco-editor/react
  - [ ] Language syntax highlighting
  - [ ] Multiple language support
  - [ ] Theme integration (dark/light)
  - [ ] Font configuration

- [ ] **Editor Features**
  - [ ] Code formatting (Prettier integration)
  - [ ] Code auto-completion
  - [ ] Keyboard shortcuts
  - [ ] Minimap
  - [ ] Breadcrumbs
  - [ ] Go to line
  - [ ] Find and replace

- [ ] **Problem Details Layout**
  - [ ] Split view: Problem description (left) | Code editor (right)
  - [ ] Language selector dropdown
  - [ ] Submit button
  - [ ] Code auto-save to localStorage
  - [ ] Reset code button

- [ ] **Test Results Display**
  - [ ] Test case execution status
  - [ ] Pass/Fail indicators
  - [ ] Expected vs Actual output
  - [ ] Execution time and memory
  - [ ] Error messages
  - [ ] Scrollable test results

### 3. Submission Flow
Complete the submission and result display flow.

#### Tasks
- [ ] **API Integration**
  - [ ] Code submission endpoint
  - [ ] Polling for results (or WebSocket)
  - [ ] Error handling

- [ ] **Submission UI**
  - [ ] Loading state during execution
  - [ ] Execution timer
  - [ ] Cancellation option
  - [ ] Result summary card

- [ ] **Result Visualization**
  - [ ] Status badges (Accepted, Wrong Answer, etc.)
  - [ ] Syntax highlighting for code
  - [ ] Test result cards
  - [ ] Performance metrics display

### 4. Backend Updates
Enhance backend to support code execution.

#### Tasks
- [ ] **Submissions Service Enhancement**
  - [ ] Update submission with results
  - [ ] Calculate statistics
  - [ ] Update user progress

- [ ] **Admin Dashboard API** (Partial)
  - [ ] User management endpoints
  - [ ] Problem management endpoints
  - [ ] Statistics endpoints

## 📋 Implementation Order

### Week 1: Docker & Executor Foundation
```
1. Setup Dockerode integration
2. Create Docker images for languages
3. Implement base executor
4. Python executor implementation
5. JavaScript executor implementation
```

### Week 2: Additional Executors & Testing
```
1. Java executor
2. C++ executor
3. Go executor
4. Basic testing of executors
5. Error handling refinement
```

### Week 3: Code Editor Integration
```
1. Monaco Editor integration
2. Language selector
3. Theme support
4. Auto-save feature
5. Syntax highlighting
```

### Week 4: Submission & Results
```
1. Complete problem detail layout
2. Submission flow
3. Results display
4. Real-time progress
5. Testing and refinement
```

## 🔌 API Endpoints (Phase 2 Focus)

### Submissions
- `POST /api/v1/submissions` - Submit code ✅ (created in Phase 1, needs enhancement)
- `GET /api/v1/submissions/:id` - Get result ✅
- `DELETE /api/v1/submissions/:id` - Cancel (new)

### Results (New)
- `WebSocket /ws/submissions/:id` - Real-time updates (optional)

## 🐳 Docker Images Needed

```dockerfile
# Python 3.11
FROM python:3.11-slim

# Node.js 20
FROM node:20-alpine

# Java 17
FROM openjdk:17-slim

# C++ with g++
FROM gcc:latest

# Go 1.21
FROM golang:1.21-alpine

# Rust 1.75
FROM rust:1.75-alpine

# Ruby 3.2
FROM ruby:3.2-alpine

# C#
FROM mcr.microsoft.com/dotnet/sdk:latest

# Kotlin
FROM amazoncorretto:17-alpine-jdk
```

## 💾 Database Additions

### Submission Model Enhancement
```prisma
model Submission {
  // ... existing fields ...
  
  // Add for Phase 2
  queueId        String?      // BullMQ job ID
  queuedAt       DateTime?    // When queued
  startedAt      DateTime?    // When execution started
  completedAt    DateTime?    // When completed
}
```

## 🔐 Security Considerations for Code Execution

1. **Container Isolation**
   - Run in separate Docker containers
   - No network access
   - Limited CPU/Memory
   - Read-only filesystem except temp

2. **Resource Limits**
   - CPU: 1 core max
   - Memory: Per difficulty (256MB-1GB)
   - Timeout: Per difficulty (2s-6s)
   - Disk: 100MB limit

3. **Input Validation**
   - Code size limit (100KB)
   - Language validation
   - Test case validation

4. **Logging & Monitoring**
   - Log all executions
   - Monitor resource usage
   - Alert on errors/timeouts
   - Audit trail

## 🧪 Testing Strategy

### Unit Tests
- Executor classes
- Test case validation
- Result parsing

### Integration Tests
- Full submission flow
- Database updates
- Job queue processing

### E2E Tests
- User submits code
- Sees results in UI
- Progress updates

## 📊 Performance Targets

- Average execution: < 500ms
- P95 execution: < 2s (excluding timeout)
- Job queue processing: < 100ms
- UI result display: < 200ms

## 🚀 Deployment Changes

### Docker Compose Update
```yaml
code-runner:
  image: docker:dind
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock

worker:
  depends_on:
    - code-runner
  environment:
    DOCKER_HOST: unix:///var/run/docker.sock
```

## 📚 Dependencies to Add

### Backend
```json
"dockerode": "^4.0.0"
```

### Worker
```json
"dockerode": "^4.0.0",
"tmp": "^0.2.1"
```

### Frontend
```json
"@monaco-editor/react": "^4.5.0",
"prettier": "^3.1.0"
```

## 🎯 Success Criteria

By end of Phase 2:
- [ ] Users can write code in Monaco Editor
- [ ] Code executes in isolated Docker containers
- [ ] 9+ programming languages supported
- [ ] Test results display correctly
- [ ] User progress updates on solve
- [ ] Performance targets met
- [ ] Error handling comprehensive
- [ ] Logging and monitoring in place

## 📈 Metrics to Track

- Code execution success rate
- Average execution time per language
- User submissions per day
- Solve rates by difficulty
- Error rate by language

## 🔗 Related Files to Update

### Backend
- `backend/src/submissions/submissions.service.ts` - Add execution result handling
- `backend/src/problems/problems.service.ts` - Update stats

### Frontend
- `frontend/src/pages/ProblemDetailPage.tsx` - Add editor layout
- `frontend/src/components/CodeEditor.tsx` - New component
- `frontend/src/components/TestResults.tsx` - New component
- `frontend/src/hooks/useSubmission.ts` - New hook

### Worker
- Complete all executor implementations
- Add Docker image management
- Implement test case execution

## 📝 Documentation Updates

- Update API docs with execution details
- Add developer guide for adding language support
- Create troubleshooting guide for execution errors
- Document Docker image maintenance

---

**Estimated Duration**: 3-4 weeks
**Complexity**: High (Docker + execution engine)
**Risk Areas**: Performance, Security, Language compatibility
