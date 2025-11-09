Equipment Lending Portal


Table of Contents

Project Overview

Features

Tech Stack

Architecture & Folder Structure

Installation & Setup

Usage

API Endpoints / Functionality

Testing

Deployment

Contributing

License

Acknowledgements

Project Overview

This project is a full-stack application designed to help organisations track equipment lending. Users can borrow, return and track equipment assets; administrators can view dashboards, manage items, users and loans. It is tailored for internal asset management (e.g., labs, offices, event equipment) rather than commercial rental.

The repository uses two main parts: client/ (front-end) and server/ (back-end). The primary purpose is to streamline the workflow of “who has what equipment, when it’s due back, condition, etc.”

Features

User authentication & role-based access (e.g., borrower, admin)

Equipment catalogue / inventory management (add, edit, remove items)

Borrow/loan lifecycle: request equipment → approve/deny → checkout → return

Tracking of loan status: current, overdue, returned

Dashboard / reports for admins: view utilisation statistics, outstanding loans

Search / filter capabilities for equipment and loans

Responsive UI (works on desktops, tablets)

Structured REST API for back-end services

Tech Stack

Front-end

TypeScript

React (presumed) / or modern JS framework (confirm)

CSS / styling (maybe CSS modules or a UI library)

Back-end

Java (likely Spring Boot or similar) given repository language breakdown (Java ~43.6%)

REST API endpoints

Database (could be SQL, e.g., PostgreSQL / MySQL)

Security: JWT or session-based authentication

Other

Folder structure separated into client & server for clear separation of concerns

Build tools, linting, maybe Docker support (if present)

Architecture & Folder Structure

Here’s a high-level view of how things are organised:

/client
  ├── src
  ├── public
  └── package.json
/server
  ├── src
  ├── main/java/… (controllers, services, repositories)
  ├── resources (application.properties, etc)
  └── pom.xml / build.gradle
README.md


Key modules/components:

Client: UI components, services (API calls), state management

Server: Controllers (REST endpoints), Services (business logic), Repositories (data access)

Models/Entities: Equipment, User, Loan

Security/Authentication: login, roles, token/session

Database migrations/seeding (if included)

Installation & Setup
Prerequisites

Node.js & npm (for client)

Java JDK (version X) for server

Build tool: Maven or Gradle

A relational database (PostgreSQL / MySQL)

(Optional) Docker & Docker-Compose

Steps

Clone the repo:

git clone https://github.com/chetan-ranganath/equipment-lending-portal.git
cd equipment-lending-portal


Setup back-end:

Navigate to server/

Configure the database connection in application.properties (or .yml)

Run migrations (if any)

Build and start the server:

mvn clean install
mvn spring-boot:run


Setup front-end:

Navigate to client/

Install dependencies:

npm install


Start development server:

npm start


Open browser and navigate to http://localhost:3000 (or configured port) to view the UI, and ensure the back-end is running at e.g., http://localhost:8080.

Usage

Once installed and running:

Register or login as a user (or use a seeded admin account)

Browse equipment catalogue

Submit a loan request for an item

Admin reviews and approves/denies

Borrower checks out equipment and later returns it

Admin views loan history, oversees overdue items and inventory status

Use filters and search to quickly locate items or users

API Endpoints / Functionality

Here’s a sample list (adapt based on actual implementation):

POST /api/auth/login – authenticate user

GET /api/users – (admin) list users

POST /api/equipment – (admin) add new equipment

GET /api/equipment – list equipment items

POST /api/loans – create a new loan request

PUT /api/loans/{id}/approve – (admin) approve a loan

PUT /api/loans/{id}/return – mark equipment as returned

GET /api/loans?status=overdue – list overdue loans

Make sure you check the server’s controllers folder for the exact routes, request/response formats, any required headers (e.g., Authorization) and data models.

Testing

Unit tests for service and repository layers (Java)

Integration tests for API endpoints

For front-end: component/unit tests (Jest/React Testing Library) if included

Run tests with:

# Server side
mvn test
# Client side
npm test

Deployment

Build production version of client:

npm run build


Package server application (jar/war) and deploy to cloud provider or server.

Consider Dockerizing: create Dockerfile for server, Dockerfile for client, and a docker-compose.yml to bring them together with the database.

Ensure environment variables for database, security secrets, ports are configurable (use .env or application config).

Use CI/CD pipeline (GitHub Actions, Jenkins) for automated builds, tests, and deployment.
