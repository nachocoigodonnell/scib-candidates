# Candidates Management System

A modern candidate management application built with NestJS backend and Angular frontend, implementing Domain-Driven Design (DDD) architecture.

## Features

- **Candidate Management**: Create and view candidates with professional information
- **Excel Upload**: Upload candidate data via Excel files (single row format)
- **Modern UI**: Professional Angular interface with Material Design
- **DDD Architecture**: Clean separation of concerns with domain, application, and infrastructure layers
- **Docker Support**: Full containerization with Docker Compose

## Tech Stack

### Backend
- **NestJS** - Node.js framework with TypeScript
- **Domain-Driven Design** - Clean architecture with value objects and entities
- **In-Memory Storage** - Simple data persistence
- **Excel Processing** - XLSX file parsing
- **Jest** - Unit and integration testing

### Frontend
- **Angular 18** - Modern web framework
- **Material Design V3** - Professional UI components
- **Reactive Forms** - Form validation and handling
- **TypeScript** - Type-safe development

## Quick Start with Docker

1. **Clone and navigate to the project**:
   ```bash
   git clone <repository-url>
   cd candidates.new
   ```

2. **Start with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

3. **Access the applications**:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080

## Development Setup

### Backend Development

```bash
cd candidates-app

# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm test
npm run test:e2e

# Build for production
npm run build
```

### Frontend Development

```bash
cd candidates-webapp

# Install dependencies
npm install

# Run development server
ng serve

# Run tests
ng test

# Build for production
ng build
```

## Excel File Format

Upload Excel files with a single row containing:
1. **Seniority**: "Junior" or "Senior"
2. **Years of Experience**: Numeric value (e.g., 5)
3. **Availability**: true or false

**Example Excel row**: `Senior | 5 | true`

## API Endpoints

- `GET /candidates` - Retrieve all candidates
- `POST /candidates` - Create new candidate with Excel file

## Project Structure

```
candidates.new/
├── candidates-app/          # NestJS Backend
│   ├── src/
│   │   ├── domain/          # Domain layer (entities, value objects)
│   │   ├── application/     # Application layer (use cases, DTOs)
│   │   ├── infrastructure/  # Infrastructure layer (repositories, services)
│   │   └── presentation/    # Presentation layer (controllers)
│   └── test/
├── candidates-webapp/       # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── environments/
└── docker-compose.yml       # Docker orchestration
```

## Docker Configuration

### Ports
- **Frontend**: Port 80 (Nginx)
- **Backend**: Port 8080 (NestJS)

### Services
- `frontend`: Angular app served by Nginx
- `backend`: NestJS API server
- Network: `candidates-network` for service communication

### Health Checks
Both services include health check endpoints for monitoring.

## Commands

```bash
# Start all services
docker-compose up

# Build and start services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Access specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
```
