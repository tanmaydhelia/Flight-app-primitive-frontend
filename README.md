# Flight Booking Microservices Application

A flight booking system built with a microservices architecture using Spring Boot (backend) and Angular (frontend). Features include user authentication (JWT), flight search, booking management, and notifications via Kafka.

## Architecture Overview

Core components:

- **API Gateway (Port 9000):** Single entry point, routing, and security.
- **Service Registry (Eureka):** Service discovery.
- **Identity Service:** User registration and JWT authentication.
- **Flight Service:** Flight inventory, search, and admin operations.
- **Booking Service:** Manage passenger bookings and tickets.
- **Notification Service:** Kafka consumer for alerts/notifications.
- **Config Server:** Centralized configuration.

## Microservices & Ports

| Service | Port | Description |
| :--- | :---: | :--- |
| Service Registry | `8761` | Eureka server |
| Config Server | `8888` | Centralized configuration |
| API Gateway | `9000` | Frontend entry point |
| Identity Service | `9091` | Auth & user management |
| Flight Service | `9080` | Flight search & admin |
| Booking Service | `9081` | Booking management |
| Notification Service | `9082` | Kafka consumer |

## Technology Stack

- Backend: Java 17+, Spring Boot 3.x, Spring Cloud (Gateway, Eureka, Config, OpenFeign)  
- Database: MySQL  
- Messaging: Apache Kafka, Zookeeper  
- Containerization: Docker, Docker Compose  
- Frontend: Angular (standalone components)

## Setup & Installation

### 1. Prerequisites

- Java 17 or higher  
- Maven  
- Docker Desktop (for MySQL and Kafka)  
- Node.js (for Angular frontend)

### 2. Infrastructure (MySQL, Kafka, Zookeeper)

Use the provided `docker-compose.yml` to start MySQL, Kafka, and Zookeeper:

```bash
docker-compose up -d
```

Ports used by the composition:

- MySQL: `3306`  
- Kafka: `9092`  
- Zookeeper: `2181`

Note: The database is initialized automatically using `init.sql` (if included).

### 3. Start the Microservices

Recommended order to start services:

1. Service Registry: `flightapp-service-registry`  
2. Config Server: `config-server` (optional if using local properties)  
3. Identity Service: `flightapp-identity-service`  
4. Flight Service: `flightapp-flight-service`  
5. Booking Service: `flightapp-booking-service`  
6. Notification Service: `flightapp-notification-service`  
7. API Gateway: `flightapp-api-gateway`

To start each service from its project folder:

```bash
cd <service-folder-name>
mvn spring-boot:run
```

### 4. Start the Frontend

From the Angular project folder:

```bash
ng serve
```

Open the app at: http://localhost:4200

## 🔌 API Endpoints (via API Gateway)

All requests should be sent to the Gateway: `http://localhost:9000`

Authentication
- Register: `POST /auth/register`
- Login (token): `POST /auth/token`
- Validate: `GET /auth/validate?token=...`

Flights
- Search flights: `POST /flight/api/search`
- Add flight (admin): `POST /flight/api/v1.0/flight/admin/airline/inventory/add`

Bookings
- Book ticket: `POST /booking/api/v1.0/flight/booking`
- Cancel ticket: `DELETE /booking/api/v1.0/flight/booking/cancel/{pnr}`

## Security

- JWT (JSON Web Token) secures protected endpoints.  
- API Gateway validates the `Authorization` header for protected routes (Flight and Booking services).

---

## Part 2 — How the Frontend Accesses Spring Endpoints

The frontend uses the API Gateway pattern: the Angular app only communicates with the gateway at `http://localhost:9000`, which routes requests to appropriate microservices.

### 1. Single Entry Point
Frontend → API Gateway (`http://localhost:9000`)  
Gateway → internal microservices (9091, 9080, 9081, ...)

### 2. Route Configuration (examples)

A Gateway `application.properties` (or config) maps incoming paths to services.

A. Authentication
- Frontend request: `POST http://localhost:9000/auth/register`  
- Gateway matches `Path=/auth/**` and forwards to Identity Service (`9091`) at `/auth/register`.

B. Flight Requests
- Frontend request: `POST http://localhost:9000/flight/api/search`  
- Gateway matches `Path=/flight/**`, applies `StripPrefix=1` (removes `/flight`), applies authentication filter, forwards to Flight Service (`9080`) at `/api/search`.

C. Booking Requests
- Frontend request: `POST http://localhost:9000/booking/api/v1.0/flight/booking`  
- Gateway matches `Path=/booking/**`, `StripPrefix=1`, authentication filter, forwards to Booking Service (`9081`) at `/api/v1.0/flight/booking`.

### 3. Authentication Flow

1. Angular posts credentials to `POST http://localhost:9000/auth/token`.  
2. Identity Service validates credentials and returns a JWT string.  
3. Angular stores the token (e.g., in `localStorage`).  
4. Subsequent requests include header: `Authorization: Bearer <token>` (via an HTTP interceptor).  
5. API Gateway validates the JWT (using utilities like `JwtUtil`):
    - If valid: request is forwarded to the target microservice.  
    - If invalid: gateway responds with `401 Unauthorized` or `403 Forbidden`.

---

Keep service-specific configuration (ports, URLs, credentials) consistent across `application.properties` (or config server) and `docker-compose.yml` to avoid connectivity issues.
