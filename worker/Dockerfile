# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    docker-cli \
    python3 \
    openjdk17 \
    g++ \
    gcc

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
