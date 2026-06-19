# 🚀 Freecode Production Deployment Guide

This guide covers deploying Freecode to production using Docker, AWS, and standard DevOps practices.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment (AWS)](#cloud-deployment-aws)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring & Logging](#monitoring--logging)
6. [Backup & Recovery](#backup--recovery)
7. [Scaling Strategies](#scaling-strategies)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing locally
- [ ] Code reviewed and approved
- [ ] No console.logs or debug code
- [ ] Environment variables configured
- [ ] Security scanning completed (npm audit)
- [ ] Database migrations tested

### Infrastructure
- [ ] SSL/TLS certificates obtained
- [ ] Database backups configured
- [ ] Redis persistence enabled
- [ ] Docker images built and tested
- [ ] Reverse proxy configured (Nginx)
- [ ] Monitoring tools installed

### Documentation
- [ ] API documentation updated
- [ ] Deployment procedures documented
- [ ] Emergency procedures documented
- [ ] Team trained on procedures

## Docker Deployment

### Build Production Images

```bash
# Build all images
docker-compose -f docker-compose.prod.yml build

# Tag images for registry
docker tag freecode-backend:latest your-registry.com/freecode-backend:1.0.0
docker tag freecode-frontend:latest your-registry.com/freecode-frontend:1.0.0
docker tag freecode-worker:latest your-registry.com/freecode-worker:1.0.0

# Push to registry
docker push your-registry.com/freecode-backend:1.0.0
docker push your-registry.com/freecode-frontend:1.0.0
docker push your-registry.com/freecode-worker:1.0.0
```

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  backend:
    image: your-registry.com/freecode-backend:1.0.0
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET}
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/docs"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: your-registry.com/freecode-frontend:1.0.0
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: https://api.freecode.com
    restart: always

  worker:
    image: your-registry.com/freecode-worker:1.0.0
    environment:
      NODE_ENV: production
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      DOCKER_HOST: unix:///var/run/docker.sock
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      - redis
      - postgres
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    restart: always

volumes:
  postgres_data:
  redis_data:
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
upstream backend {
  server backend:3001;
}

upstream frontend {
  server frontend:3000;
}

server {
  listen 80;
  server_name freecode.com www.freecode.com;
  
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  server_name freecode.com www.freecode.com;

  ssl_certificate /etc/nginx/ssl/cert.pem;
  ssl_certificate_key /etc/nginx/ssl/key.pem;

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;

  # API requests
  location /api/ {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 30s;
  }

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## Cloud Deployment (AWS)

### ECS with Fargate

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name freecode-backend
   aws ecr create-repository --repository-name freecode-frontend
   aws ecr create-repository --repository-name freecode-worker
   ```

2. **Push Images to ECR**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
   docker tag freecode-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/freecode-backend:latest
   docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/freecode-backend:latest
   ```

3. **RDS for PostgreSQL**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier freecode-postgres \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password YOUR_PASSWORD \
     --allocated-storage 100 \
     --backup-retention-period 30
   ```

4. **ElastiCache for Redis**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id freecode-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

5. **ECS Task Definition**
   ```json
   {
     "family": "freecode-backend",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "512",
     "memory": "1024",
     "containerDefinitions": [
       {
         "name": "backend",
         "image": "YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/freecode-backend:latest",
         "portMappings": [
           {
             "containerPort": 3001,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "DATABASE_URL",
             "value": "postgresql://admin:PASSWORD@freecode-postgres.xxxxx.us-east-1.rds.amazonaws.com:5432/freecode"
           }
         ]
       }
     ]
   }
   ```

## Environment Configuration

### Production .env

```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/freecode
REDIS_URL=redis://host:6379
JWT_SECRET=generate-long-random-string
REFRESH_TOKEN_SECRET=generate-long-random-string
FRONTEND_URL=https://freecode.com
CORS_ORIGIN=https://freecode.com
LOG_LEVEL=info
CODE_EXECUTION_TIMEOUT_EASY=2000
CODE_EXECUTION_TIMEOUT_MEDIUM=4000
CODE_EXECUTION_TIMEOUT_HARD=6000
```

## Monitoring & Logging

### CloudWatch Metrics

```bash
# Install CloudWatch Agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
rpm -U ./amazon-cloudwatch-agent.rpm
```

### Application Metrics to Track

- Request latency (P50, P95, P99)
- Error rates
- Database query times
- Redis cache hit rate
- Code execution times
- Container memory/CPU usage
- Disk space usage

### Alert Thresholds

```yaml
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    duration: 5m
    action: notify_ops

  - name: SlowAPI
    condition: p99_latency > 1000ms
    duration: 10m
    action: notify_ops

  - name: OutOfMemory
    condition: memory_usage > 90%
    duration: 2m
    action: auto_scale

  - name: DatabaseDown
    condition: db_health == down
    duration: 1m
    action: failover
```

## Backup & Recovery

### Database Backups

```bash
# Daily automated backups
0 2 * * * pg_dump -h localhost -U freecode freecode | gzip > /backups/freecode-$(date +\%Y\%m\%d).sql.gz

# Weekly full backup to S3
0 3 * * 0 tar czf /backups/freecode-full-$(date +\%Y\%m\%d).tar.gz /data && aws s3 cp /backups/freecode-full-*.tar.gz s3://freecode-backups/
```

### Recovery Procedure

```bash
# Restore from backup
gunzip < /backups/freecode-20240618.sql.gz | psql -h localhost -U freecode freecode

# Verify data integrity
psql -h localhost -U freecode freecode -c "SELECT COUNT(*) FROM problems;"
```

## Scaling Strategies

### Horizontal Scaling

1. **Backend API Scaling**
   ```bash
   # ECS Auto Scaling
   aws application-autoscaling register-scalable-target \
     --service-namespace ecs \
     --scalable-dimension ecs:service:DesiredCount \
     --min-capacity 2 \
     --max-capacity 10

   aws application-autoscaling put-scaling-policy \
     --policy-name backend-scaling \
     --service-namespace ecs \
     --scalable-dimension ecs:service:DesiredCount \
     --policy-type TargetTrackingScaling \
     --target-tracking-scaling-policy-configuration "TargetValue=70.0,PredefinedMetricSpecification={PredefinedMetricType=ECSServiceAverageCPUUtilization}"
   ```

2. **Worker Scaling**
   - Scale workers based on queue depth
   - Monitor BullMQ job queue size
   - Auto-scale when queue > 1000 jobs

3. **Database Scaling**
   - Use read replicas for analytics queries
   - Connection pooling via PgBouncer
   - Sharding if needed (future)

### Load Balancing

```nginx
upstream backend {
  least_conn;
  server backend1:3001;
  server backend2:3001;
  server backend3:3001;
}

upstream worker {
  least_conn;
  server worker1:3002;
  server worker2:3002;
  server worker3:3002;
}
```

## Post-Deployment

### Smoke Tests

```bash
curl -X POST https://freecode.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"test@example.com","password":"password"}'

curl -X GET https://freecode.com/api/v1/problems \
  -H "Authorization: Bearer $TOKEN"
```

### Health Checks

- Backend: `/api/docs` returns 200
- Frontend: `/` returns 200
- Database: Connection test passes
- Redis: PING returns PONG
- Worker: Processing jobs

## Disaster Recovery

### RPO & RTO Targets

- **RPO** (Recovery Point Objective): 1 hour
- **RTO** (Recovery Time Objective): 30 minutes

### Recovery Runbook

1. **Detect Failure**
   - Monitor alerts trigger
   - Page on-call engineer

2. **Assess Impact**
   - Check service status
   - Review error logs
   - Determine affected users

3. **Initiate Recovery**
   - Failover to standby
   - Restore from latest backup
   - Verify data integrity

4. **Communicate**
   - Notify users of incident
   - Update status page
   - Send post-mortem

---

**Last Updated**: 2026-06-18
**Maintained By**: Freecode DevOps Team
