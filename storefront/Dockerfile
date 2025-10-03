FROM node:22-alpine AS development

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --no-cache dos2unix git python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies for development
RUN npm install --include=dev

# Install Tailwind CSS and PostCSS
RUN npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss7-compat postcss-import postcss-nested

# Copy application code
COPY . .

# Fix line endings
RUN find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" | xargs dos2unix 2>/dev/null || true

# Install full-icu for i18n
RUN npm install full-icu

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=Europe/Amsterdam
ENV NODE_ICU_DATA=node_modules/full-icu
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Expose port
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "dev"]

# Production build stage (kept for reference, but not used in development)
FROM node:22-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=Europe/Amsterdam
ENV NODE_ICU_DATA=node_modules/full-icu

# Install full-icu
RUN npm install full-icu

# Copy package files and install production dependencies
COPY --from=development /usr/src/app/package*.json ./
RUN npm install --omit=dev

# Copy built application
COPY --from=development /usr/src/app .

# Health check
HEALTHCHECK --timeout=1s --start-period=2s \
  CMD wget --spider -q http://localhost:3000 || exit 1

EXPOSE 3000

CMD ["npm", "start"]
 
CMD ["npm", "start"]