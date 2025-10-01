# Unchained Commerce

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm/yarn
- MongoDB (or use the Docker setup)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/gsreeka/Unchainned_commerce.git
   cd Unchainned_commerce
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Update the environment variables in `.env` as needed.

3. Build and start the application:
   ```bash
   # Build the Docker images
   docker-compose build
   
   # Start the containers in detached mode
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: mongodb://localhost:27017/unchained

> **Note**: The first time you run `docker-compose up -d`, it will take some time to download and build all the required images.

### Local Development Setup

1. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install engine dependencies
   cd engine
   npm install
   
   # Install storefront dependencies
   cd ../storefront
   npm install
   ```

2. Start the development servers:
   ```bash
   # In one terminal (engine)
   cd engine
   npm run dev
   
   # In another terminal (storefront)
   cd storefront
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/unchained

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## Project Structure

```
├── engine/               # Backend API
├── storefront/           # Frontend application
├── docker-compose.yml    # Docker Compose configuration
└── .env.example         # Example environment variables
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


