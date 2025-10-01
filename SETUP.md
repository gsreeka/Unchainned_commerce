# EngineStorefront Setup Guide

This guide will help you set up and run the EngineStorefront project locally using Docker.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

### Required Software
1. **Docker Desktop** (latest version)
   - Download from: https://www.docker.com/products/docker-desktop/
   - Make sure Docker Desktop is running before proceeding

2. **Git** (to clone the repository)
   - Download from: https://git-scm.com/downloads

3. **Node.js 22+** (for local development, optional)
   - Download from: https://nodejs.org/
   - This project requires Node.js version 22 or higher

## Project Structure

```
EngineStorefront/
├── engine/          # Backend API (Unchained Commerce)
├── storefront/      # Frontend Next.js application
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EngineStorefront
```

### 2. Environment Configuration

#### Engine Configuration
Navigate to the `engine` directory and ensure the `.env` file exists with all required variables:

```bash
cd engine
```

Create or verify the `.env` file contains:
```env
NODE_ENV=development
PORT=3001
MONGO_URL=mongodb://mongo:27017/unchained_core
UNCHAINED_ENDPOINT=http://localhost:3001/graphql
DISABLE_PDF_GENERATION=true

# Email configuration
EMAIL_WEBSITE_NAME=Unchained
EMAIL_FROM=noreply@unchained.local
EMAIL_WEBSITE_URL=http://localhost:3001

# Security secrets (change these in production!)
UNCHAINED_SECRET=secret
UNCHAINED_GRIDFS_PUT_UPLOAD_SECRET=secret
UNCHAINED_TOKEN_SECRET=random-token-that-is-not-secret-at-all
UNCHAINED_SEED_PASSWORD=password

# Cookie configuration
UNCHAINED_COOKIE_DOMAIN=localhost
UNCHAINED_COOKIE_SAMESITE=none

# Root URL
ROOT_URL=http://localhost:3001
```

#### Storefront Configuration
Navigate to the `storefront` directory and configure environment variables as needed.

### 3. Docker Setup

#### Build and Start Services
From the root directory (`EngineStorefront/`):

```bash
# Build all services (this may take 10-15 minutes on first run)
docker-compose build --no-cache

# Start all services in detached mode
docker-compose up -d
```

#### Verify Services are Running
```bash
# Check container status
docker-compose ps

# Check logs for any issues
docker-compose logs engine
docker-compose logs storefront
docker-compose logs mongo
```

### 4. Access the Applications

Once all containers are running successfully:

- **Storefront (Frontend)**: http://localhost:3000
- **Engine API (Backend)**: http://localhost:3001
- **GraphQL Playground**: http://localhost:3001/graphql
- **MongoDB**: localhost:27017

### 5. Health Checks

The services include health checks. You can verify they're working:

```bash
# Check if engine is healthy
curl http://localhost:3001/health

# Check if storefront is responding
curl http://localhost:3000
```

## Common Commands

### Development Workflow
```bash
# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart engine

# View real-time logs
docker-compose logs -f engine

# Rebuild and restart after code changes
docker-compose up -d --build

# Clean rebuild (removes cache)
docker-compose build --no-cache
docker-compose up -d
```

### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongo mongosh

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

### Troubleshooting Commands
```bash
# Check Docker system info
docker system info

# Clean up unused Docker resources
docker system prune -a

# Check container resource usage
docker stats

# Execute commands inside containers
docker-compose exec engine sh
docker-compose exec storefront sh
```

## Troubleshooting

### Common Issues

#### 1. Node.js Version Errors
**Error**: `npm warn EBADENGINE Unsupported engine`
**Solution**: The Dockerfiles use Node.js 22. If you see Node.js 18 errors, rebuild without cache:
```bash
docker-compose build --no-cache
```

#### 2. Missing Environment Variables
**Error**: `Missing required environment variables at boot time`
**Solution**: Ensure all required environment variables are set in the `.env` files as shown above.

#### 3. Port Already in Use
**Error**: `Port 3000/3001 is already in use`
**Solution**: 
```bash
# Find and kill processes using the ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
# Kill the process using the PID shown
taskkill /PID <PID> /F
```

#### 4. MongoDB Connection Issues
**Error**: `MongoNetworkError` or connection timeouts
**Solution**:
```bash
# Restart MongoDB container
docker-compose restart mongo

# Check MongoDB logs
docker-compose logs mongo
```

#### 5. Build Failures
If builds fail due to network issues or package installation problems:
```bash
# Clean Docker cache and rebuild
docker system prune -a
docker-compose build --no-cache --pull
