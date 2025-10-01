# Base stage for common setup
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS dev

# Install Chrome dependencies and Chrome
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    && mkdir -p /usr/bin \
    && ln -s /usr/bin/chromium-browser /usr/bin/google-chrome \
    && chmod 755 /usr/bin/chromium-browser /usr/bin/google-chrome

# Tell Puppeteer to use the installed Chrome/Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

# Install dependencies including devDependencies and dotenv
RUN npm install --prefer-offline --no-audit --progress=false dotenv --save-dev

# Copy application code
COPY --chown=node:node . .

# Switch to node user
USER node

# Expose the application port
EXPOSE 3001

# Start the application in development mode
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS prod

# Install production dependencies using clean install
RUN npm ci --only=production --prefer-offline --no-audit --progress=false

# Copy application code
COPY --chown=node:node . .

# Build the application
RUN npm run build

# Switch to node user
USER node
 
# Expose the application port
EXPOSE 3001
 
# Start the application in production mode
CMD ["npm", "start"]
 