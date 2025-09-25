# Stage 1: Base system dependencies
FROM node:24-alpine AS base
 
# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont
 
# Set Chrome binary location
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production \
    PORT=3001
 
# Create app directory and set permissions
RUN mkdir -p /app && \
    chown -R node:node /app && \
    chmod -R 775 /app && \
    chmod g+s /app
 
WORKDIR /app
 
# Stage 2: Dependencies
FROM base AS deps
 
# Copy package files
COPY --chown=node:node package*.json ./
 
# Install production dependencies first
RUN npm ci --only=production --prefer-offline --no-audit --progress=false
 
# Copy production node_modules for later use
RUN cp -R node_modules prod_node_modules
 
# Install dev dependencies
RUN npm ci --prefer-offline --no-audit --progress=false
 
# Stage 3: Development image
FROM base AS dev
 
# Copy package files
COPY --chown=node:node package*.json ./
 
# Install all dependencies
RUN npm ci --prefer-offline --no-audit --progress=false
 
# Copy application code
COPY --chown=node:node . .
 
# Switch to node user
USER node
 
# Expose the application port
EXPOSE 3001
 
# Start the application in development mode
CMD ["npm", "run", "dev"]
 
# Stage 4: Production image
FROM base AS prod
 
# Copy production node_modules
COPY --from=deps /app/prod_node_modules ./node_modules
 
# Copy application code
COPY --chown=node:node . .
 
# Switch to node user
USER node
 
# Expose the application port
EXPOSE 3001
 
# Start the application in production mode
CMD ["npm", "start"]