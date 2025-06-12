# Candidates Management System

A complete candidate management platform with business metrics monitoring, built using modern microservices architecture and Domain-Driven Design (DDD).

## 🏗️ Architecture Overview

The system is composed of two independent Docker Compose stacks:

- **Application Stack** (`docker-compose.app.yml`): Core business functionality
- **Monitoring Stack** (`docker-compose.monitoring.yml`): Observability and metrics

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)

### 1. Start Monitoring Stack
```bash
# Create monitoring network first
docker network create candidates-monitoring-network

# Start monitoring services
docker-compose -f docker-compose.monitoring.yml up -d
```

### 2. Start Application Stack
```bash
# Start application services
docker-compose -f docker-compose.app.yml up --build
```

### 3. Access Applications
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8080
- **Grafana**: http://localhost:3000 (admin/admin123)
- **Prometheus**: http://localhost:9090

## 📊 System Components

### Application Stack (docker-compose.app.yml)
| Service | Container Name | Port | Purpose |
|---------|---------------|------|---------|
| **frontend** | candidates-frontend | 80 | Angular UI with Material Design |
| **backend** | candidates-backend | 8080 | NestJS API with DDD architecture |
| **database** | candidates-database | 8800 | PostgreSQL 15 database |
| **localstack** | candidates-localstack | 4566 | S3-compatible storage emulation |

### Monitoring Stack (docker-compose.monitoring.yml)
| Service | Container Name | Port | Purpose |
|---------|---------------|------|---------|
| **prometheus** | candidates-prometheus | 9090 | Metrics collection and storage |
| **grafana** | candidates-grafana | 3000 | Dashboards and visualization |
| **node-exporter** | candidates-node-exporter | 9100 | System metrics (CPU, memory, disk) |
| **postgres-exporter** | candidates-postgres-exporter | 9187 | PostgreSQL metrics |
| **loki** | candidates-loki | 3100 | Log aggregation |
| **promtail** | candidates-promtail | - | Log collection agent |

## 🎯 Features

### Core Functionality
- **Candidate Management**: Create, view, search, and paginate candidates
- **Excel Processing**: Upload XLSX files with candidate data
- **File Storage**: S3-compatible file storage with LocalStack
- **Business Metrics**: Track candidate creation by seniority and availability

### Technical Features
- **Domain-Driven Design**: Clean separation of domain, application, and infrastructure
- **Pagination & Search**: Advanced candidate filtering and sorting
- **Business Metrics**: Custom Prometheus metrics for business insights
- **Log Aggregation**: Centralized logging with Loki

## 🔧 Development

### Backend Development (NestJS)
```bash
cd candidates-app

# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Run tests
npm test
npm run test:e2e

# Run linting and type checking
npm run lint
npm run typecheck
```

### Frontend Development (Angular)
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

## 📝 Excel File Format

Upload Excel files with a single data row containing:

| Column A | Column B | Column C |
|----------|----------|----------|
| Seniority | Years Experience | Availability |
| "Senior" or "Junior" | Number (1-20) | true or false |

**Example**: `Senior | 7 | true`

## 🌐 API Endpoints

### Candidates
- `GET /candidates` - List all candidates with pagination
- `POST /candidates` - Create candidate with Excel upload
- `GET /candidates/:id/download-file` - Download candidate's Excel file

### Monitoring
- `GET /health` - Application health check
- `GET /metrics` - Prometheus metrics endpoint

### Query Parameters (GET /candidates)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Sort field (firstName, lastName, createdAt, etc.)
- `sortOrder`: ASC or DESC (default: DESC)
- `search`: Search term for name filtering

## 📈 Monitoring & Metrics

### Business Metrics
- `candidates_created_total`: Total candidates created (labeled by seniority, availability)

### System Metrics (via node-exporter)
- CPU usage, memory consumption, disk I/O
- Network statistics, filesystem metrics

### Application Metrics
- PostgreSQL performance metrics
- Container health and status

### Grafana Dashboards
Access Grafana at `http://localhost:3000` with credentials `admin/admin123` to view:
- Business metrics dashboard
- System performance overview
- Database metrics

## 🧪 Load Testing

Use the included data generator to create test candidates:

```bash
cd .data-generator
npm install
npm start
```

This script generates random candidates for 2 minutes to test the monitoring dashboard.

## 🗂️ Project Structure

```
candidates.new/
├── candidates-app/              # NestJS Backend
│   ├── src/
│   │   ├── domain/             # Domain entities and value objects
│   │   ├── application/        # Use cases and DTOs
│   │   ├── infrastructure/     # Controllers, repositories, services
│   │   └── shared/            # Common utilities
│   └── test/
├── candidates-webapp/           # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── environments/
├── .data-generator/            # Load testing script
├── monitoring/                 # Monitoring configurations
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── promtail/
├── docker-compose.app.yml      # Application stack
└── docker-compose.monitoring.yml  # Monitoring stack
```

## 🐳 Docker Commands

### Application Stack
```bash
# Start application services
docker-compose -f docker-compose.app.yml up --build

# Stop application services
docker-compose -f docker-compose.app.yml down

# View application logs
docker-compose -f docker-compose.app.yml logs -f
```

### Monitoring Stack
```bash
# Start monitoring services
docker-compose -f docker-compose.monitoring.yml up -d

# Stop monitoring services
docker-compose -f docker-compose.monitoring.yml down

# View monitoring logs
docker-compose -f docker-compose.monitoring.yml logs -f
```

### Both Stacks
```bash
# Start everything
docker network create candidates-monitoring-network
docker-compose -f docker-compose.monitoring.yml up -d
docker-compose -f docker-compose.app.yml up --build

# Stop everything
docker-compose -f docker-compose.app.yml down
docker-compose -f docker-compose.monitoring.yml down
```

## 🔧 Environment Configuration

### Application Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8080 | Backend API port |
| `NODE_ENV` | production | Node.js environment |
| `DATABASE_HOST` | database | PostgreSQL host |
| `DATABASE_PORT` | 5432 | PostgreSQL port |
| `AWS_ENDPOINT` | http://localstack:4566 | S3 endpoint |
| `S3_BUCKET_NAME` | candidates-files | S3 bucket name |

### Monitoring Configuration
- Prometheus retention: 30 days
- Grafana admin password: `admin123`
- Log retention: Configured per service