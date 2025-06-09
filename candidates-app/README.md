# Candidates App - DDD Architecture

## Overview
Backend application for managing candidates built with NestJS following Domain-Driven Design (DDD) principles.

## Architecture

### Domain Layer (`src/domain/`)
Contains the core business logic and rules:

- **Entities**: `CandidateEntity` - Core business objects with identity
- **Value Objects**: 
  - `CandidateIdVO` - Unique identifier
  - `CandidateNameVO` - Name validation and formatting
  - `SeniorityVO` - Seniority level with validation
  - `YearsExperienceVO` - Years of experience validation
  - `AvailabilityVO` - Availability status with business logic
- **Repository Interface**: `CandidateRepository` - Domain contract for data persistence

### Application Layer (`src/application/`)
Orchestrates domain objects and coordinates application flow:

- **Use Cases**:
  - `CreateCandidateUseCase` - Creates new candidates from Excel data
  - `GetAllCandidatesUseCase` - Retrieves all candidates
- **DTOs**: Data transfer objects for application boundaries
- **Service Interfaces**: `ExcelParserService` - Contract for external services

### Infrastructure Layer (`src/infrastructure/`)
Implements technical concerns and external integrations:

- **Controllers**: REST API endpoints
- **Repositories**: `InMemoryCandidateRepository` - In-memory data storage
- **External Services**: `XlsxExcelParserService` - Excel file parsing
- **Modules**: Dependency injection configuration

### Shared Layer (`src/shared/`)
Common utilities and constants used across layers:

- **Constants**: Dependency injection tokens

## API Endpoints

### POST /candidates
Creates a new candidate with Excel file upload.

**Request:**
- `firstName` (form field): Candidate's first name
- `lastName` (form field): Candidate's last name  
- `excelFile` (file upload): Excel file with candidate data

**Excel Format:**
The Excel file should contain one data row with three columns:
1. **Seniority**: "Junior" or "Senior"
2. **Years of Experience**: Numeric value (≥ 0)
3. **Availability**: true or false

**Response:**
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string", 
  "seniority": "Junior|Senior",
  "yearsOfExperience": number,
  "availability": boolean,
  "createdAt": "ISO date"
}
```

### GET /candidates
Retrieves all candidates.

**Response:** Array of candidate objects (same format as POST response)

## Running the Application

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## Testing

The application includes comprehensive tests using Jest:

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

### Test Structure
- **Domain Tests**: Value Objects and Entities validation
- **Application Tests**: Use Cases with mocked dependencies
- **Infrastructure Tests**: Repository and Service implementations
- **E2E Tests**: Full API integration tests

Current test coverage includes:
- ✅ 49 unit tests across all layers
- ✅ 6 e2e tests for API endpoints
- ✅ Value object validation and business rules
- ✅ Entity creation and transformation
- ✅ Use case orchestration
- ✅ Repository operations
- ✅ Excel parsing functionality
- ✅ API endpoint behavior

## DDD Benefits Implemented

1. **Separation of Concerns**: Clear boundaries between domain, application, and infrastructure
2. **Domain-Centric**: Business logic encapsulated in domain objects
3. **Testability**: Each layer can be tested independently
4. **Flexibility**: Easy to swap implementations (e.g., database, Excel parser)
5. **Maintainability**: Changes in one layer don't affect others
6. **Business Logic Protection**: Domain rules enforced through value objects

## Key Design Patterns

- **Repository Pattern**: Abstract data access
- **Value Object Pattern**: Encapsulate business rules and validation
- **Use Case Pattern**: Application-specific business logic
- **Dependency Injection**: Loose coupling between components
- **Factory Pattern**: Object creation with validation