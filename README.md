# The Wild Oasis 🏨

A modern, full-stack hotel management system built with cutting-edge web technologies. Manage cabins, bookings, guests, and check-ins/check-outs with an intuitive interface and robust backend API.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Available Commands](#available-commands)
- [Architecture](#architecture)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Wild Oasis is a comprehensive hotel management platform designed for managing hospitality operations. It provides:

- **Cabin Management**: List, create, update, and manage cabin inventory
- **Booking System**: Track reservations with detailed guest information
- **Check-in/Check-out**: Streamline arrival and departure processes
- **Dashboard**: Real-time analytics and overview of operations
- **Settings**: Configure system preferences and user accounts
- **User Authentication**: Secure login with JWT-based authentication
- **Dark Mode**: Light and dark theme support

## Tech Stack

### Frontend (UI)

- **Framework**: React 18.3
- **Build Tool**: Vite 5.3
- **Styling**: Styled Components
- **State Management**: React Query (TanStack Query)
- **Form Management**: React Hook Form
- **Routing**: React Router v6
- **Testing**: Jest, React Testing Library
- **Charts**: Recharts
- **UI Components**: React Icons
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend (API)

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **API Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Image Processing**: Sharp
- **Logging**: Morgan

### DevOps

- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2 (for production)
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky, Lint-staged

## Project Structure

```
the-wild-oasis/
├── ui/                          # React frontend application
│   ├── src/
│   │   ├── features/            # Feature modules
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   ├── utils/               # Utility functions
│   │   └── styles/              # Global styles
│   ├── jest.config.js           # Jest configuration
│   ├── vite.config.js           # Vite configuration
│   └── package.json
│
├── api/                         # Node.js backend application
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── utils/               # Utility functions
│   │   ├── app.ts               # Express app setup
│   │   └── server.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── migrations/          # Database migrations
│   │   └── seed.ts              # Database seeding
│   ├── jest.config.js           # Jest configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── package.json
│
├── docker-compose.yaml          # Docker Compose configuration
├── env.example                  # Environment variables template
└── README.md                    # This file
```

## Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package managers
- **Docker**: For containerized development (optional but recommended)
- **PostgreSQL**: v14 or higher (or use Docker)
- **Git**: Version control

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd the-wild-oasis

# Copy and configure environment variables
cp env.example .env

# Start all services with Docker Compose
docker compose up --build

# The application will be available at:
# - UI: http://localhost
# - API: http://localhost:3000
# - Database: PostgreSQL on port 5432
```

### Option 2: Manual Setup

**1. Set up the database:**

```bash
# Ensure PostgreSQL is running
# Update .env with your PostgreSQL credentials
cp env.example .env
```

**2. Set up the API:**

```bash
cd api

# Install dependencies
yarn install

# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate

# (Optional) Seed the database with sample data
yarn prisma:seed

# Start development server
yarn dev

# API will be available at http://localhost:3000
```

**3. Set up the UI:**

```bash
cd ui

# Install dependencies
yarn

# Update VITE_API_URL in .env if needed
# Start development server
yarn dev

# UI will be available at http://localhost:5173
```

## Environment Setup

Copy `env.example` to `.env` and configure the following variables:

### Database

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=wild_oasis
```

### API

```
API_PORT=3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost,http://localhost:3000
MAX_FILE_SIZE_MB=5
```

### UI

```
UI_PORT=80
VITE_API_ORIGIN=http://localhost:3000
VITE_API_URL=http://localhost:3000/api/v1
```

## Available Commands

### UI Commands

```bash
cd ui

# Development
yarn dev                    # Start Vite dev server
yarn build                  # Build for production
yarn preview                # Preview production build

# Testing
yarn test                   # Run Jest tests
yarn test:watch             # Run tests in watch mode
yarn test:coverage          # Generate coverage report

# Code Quality
yarn lint                   # Lint code
yarn lint:fix               # Fix linting issues
yarn prettier               # Check code formatting
yarn prettier:write         # Format code
```

### API Commands

```bash
cd api

# Development
yarn dev                    # Start TypeScript dev server
yarn build                  # Build TypeScript
yarn start                  # Start production server

# Testing
yarn test                   # Run Jest tests
yarn test:watch             # Run tests in watch mode
yarn test:coverage          # Generate coverage report

# Database
yarn prisma:generate        # Generate Prisma client
yarn prisma:migrate         # Run pending migrations
yarn prisma:deploy          # Deploy migrations (production)
yarn prisma:studio          # Open Prisma Studio GUI
yarn prisma:seed            # Seed database with sample data
yarn db:seed:pg             # Seed with PostgreSQL script

# Code Quality
yarn lint                   # Lint code
yarn lint:fix               # Fix linting issues
yarn prettier               # Check code formatting
yarn prettier:write         # Format code
```

### Root Commands

```bash
# Docker operations (from project root)
docker compose up           # Start all services
docker compose up --build   # Build and start services
docker compose down         # Stop all services
docker compose logs -f      # Follow logs
```

## Architecture

### Frontend Architecture

The UI follows a modular feature-based architecture:

- **Features**: Self-contained modules (e.g., authentication, bookings)
- **Custom Hooks**: Reusable logic (`useDarkMode`, `useLocalStorageState`, etc.)
- **Services**: API communication layer
- **Utils**: Helper functions
- **Responsive Design**: Mobile-first approach using Styled Components

### Backend Architecture

The API follows a layered architecture:

- **Routes**: HTTP endpoint definitions
- **Controllers**: Request handlers and business logic
- **Middleware**: Request processing (auth, validation, error handling)
- **Schemas**: Zod validation schemas
- **Database**: Prisma ORM with PostgreSQL
- **RESTful Design**: Standard HTTP methods and status codes

### Database Schema

Key entities:

- **Users**: System user accounts with roles
- **Cabins**: Room inventory with pricing
- **Guests**: External guest information
- **Bookings**: Reservation records
- **Settings**: System configuration

### System Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer - React UI"]
        browser["Web Browser"]
        App["App.jsx<br/>React Router"]
        Pages["Pages Layer"]
        Features["Features<br/>authentication | bookings<br/>cabins | check-in-out<br/>dashboard | settings"]
        Services["Services<br/>API Client<br/>React Query"]
        UI["UI Components<br/>Modal | Button | Forms<br/>Tables | Modals"]
        Hooks["Custom Hooks<br/>useMutation | useQuery<br/>useDarkMode | useOutsideClick"]
    end

    subgraph Network["🌐 Network"]
        HTTP["HTTP/REST API<br/>JSON over TCP"]
    end

    subgraph Server["🖧 API Server - Node.js/Express"]
        Express["Express App"]
        Auth["Auth Routes<br/>POST /login<br/>POST /register<br/>POST /logout"]
        Bookings["Booking Routes<br/>GET /bookings<br/>POST /bookings<br/>PATCH /bookings/:id"]
        Cabins["Cabin Routes<br/>GET /cabins<br/>POST /cabins<br/>PATCH /cabins/:id"]
        Guests["Guest Routes<br/>GET /guests<br/>POST /guests"]
        Settings["Settings Routes<br/>GET /settings<br/>PATCH /settings"]
        Middleware["Middleware<br/>auth | errorHandler<br/>validate | upload"]
        Prisma["Prisma ORM<br/>Client Generator<br/>Schema: schema.prisma"]
    end

    subgraph Database["🗄️ PostgreSQL Database"]
        Users["Users Table<br/>id | email | password<br/>fullName | avatar | role"]
        Cabins_db["Cabins Table<br/>id | name | maxCapacity<br/>regularPrice | discount"]
        Guests_db["Guests Table<br/>id | fullName | email<br/>nationality | age | gender"]
        Bookings_db["Bookings Table<br/>id | startDate | endDate<br/>status | totalPrice | isPaid<br/>cabinId | guestId | createdById"]
        Settings_db["Settings Table<br/>id | minBookingLength<br/>maxBookingLength | breakfastPrice"]
        Migrations["Prisma Migrations<br/>_prisma_migrations table"]
    end

    subgraph Docker["🐳 Docker Infrastructure"]
        UI_Container["UI Container<br/>Nginx 1.27-alpine<br/>Port: 80"]
        API_Container["API Container<br/>Node 22-alpine<br/>Port: 3000"]
        DB_Container["DB Container<br/>PostgreSQL 16-alpine<br/>Port: 5432"]
        Networks["Docker Networks<br/>frontend | backend"]
    end

    subgraph DataModels["📊 Data Models & Features"]
        UserModel["User<br/>✓ Email/Password Auth<br/>✓ Admin/User Roles<br/>✓ Avatar Upload"]
        CabinModel["Cabin<br/>✓ Multi-cabin Management<br/>✓ Image Upload<br/>✓ Price & Discount"]
        GuestModel["Guest<br/>✓ National ID<br/>✓ Nationality<br/>✓ Age & Gender"]
        BookingModel["Booking<br/>✓ Date Range<br/>✓ Status Tracking<br/>✓ Breakfast Add-on<br/>✓ Price Calculation"]
        SettingsModel["Settings<br/>✓ Min/Max Booking Length<br/>✓ Max Guests<br/>✓ Breakfast Price"]
    end

    browser -->|loads| App
    App --> Pages & Features & Services & UI & Hooksmer
    Services -->|HTTP requests| HTTP
    HTTP -->|REST API| Express
    Express --> Auth & Bookings & Cabins & Guests & Settings
    Auth & Bookings & Cabins & Guests & Settings --> Middleware
    Middleware --> Prisma
    Prisma -->|Query/Mutate| Users & Cabins_db & Guests_db & Bookings_db & Settings_db & Migrations

    Users -.->|maps to| UserModel
    Cabins_db -.->|maps to| CabinModel
    Guests_db -.->|maps to| GuestModel
    Bookings_db -.->|maps to| BookingModel
    Settings_db -.->|maps to| SettingsModel

    UI_Container -.->|contains| App
    API_Container -.->|contains| Express
    DB_Container -.->|contains| Users & Cabins_db & Guests_db & Bookings_db & Settings_db
    Networks -.->|connects| UI_Container & API_Container & DB_Container

    style Client fill:#e1f5ff
    style Server fill:#f3e5f5
    style Database fill:#fff3e0
    style Docker fill:#f1f8e9
    style DataModels fill:#fce4ec
    style Network fill:#e0f2f1
```

### Database Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : creates
    USERS {
        string id PK "uuid"
        string email UK "unique"
        string password
        string fullName
        string avatar "optional"
        enum role "admin|user"
        datetime createdAt
    }

    CABINS ||--o{ BOOKINGS : "is booked"
    CABINS {
        int id PK
        string cabinNumber UK "optional"
        string name UK
        int maxCapacity
        float regularPrice
        float discount "default 0"
        string image "optional"
        string description "optional"
        datetime createdAt
    }

    GUESTS ||--o{ BOOKINGS : "makes"
    GUESTS {
        int id PK
        string fullName
        string email UK
        string nationality "optional"
        string nationalId "optional"
        string countryFlag "optional"
        int age "optional"
        string gender "optional"
        datetime createdAt
    }

    BOOKINGS {
        int id PK
        datetime createdAt
        datetime startDate
        datetime endDate
        int numNights
        int numGuests
        enum status "unconfirmed|checked_in|checked_out"
        float totalPrice
        float cabinPrice "default 0"
        float extrasPrice "default 0"
        boolean hasBreakfast "default false"
        string observations "optional"
        boolean isPaid "default false"
        int cabinId FK
        int guestId FK
        string createdById FK "optional"
    }

    SETTINGS {
        int id PK
        int minBookingLength "default 1"
        int maxBookingLength "default 365"
        int maxGuestsPerBooking "default 20"
        float breakfastPrice "default 15"
    }
```

### User Interaction & API Flow

```mermaid
graph LR
    subgraph UI["React UI"]
        Login["🔐 Login Page<br/>Email & Password"]
        Dashboard["📊 Dashboard<br/>Analytics & Stats"]
        Bookings["📅 Bookings<br/>View & Manage"]
        Cabins["🏠 Cabins<br/>View & Edit"]
        CheckIn["✅ Check-In<br/>Guest Arrival"]
        Users["👥 Users<br/>Staff Management"]
        Account["⚙️ Account<br/>Profile & Settings"]
    end

    subgraph API["API Routes"]
        AuthAPI["POST /auth/login<br/>POST /auth/register<br/>POST /auth/logout"]
        BookingAPI["GET /bookings<br/>POST /bookings<br/>PATCH /bookings/:id<br/>DELETE /bookings/:id"]
        CabinAPI["GET /cabins<br/>POST /cabins<br/>PATCH /cabins/:id<br/>DELETE /cabins/:id"]
        GuestAPI["GET /guests<br/>POST /guests<br/>PATCH /guests/:id"]
        SettingsAPI["GET /settings<br/>PATCH /settings"]
        UserAPI["GET /users<br/>POST /users<br/>PATCH /users/:id"]
    end

    subgraph DB["Database Operations"]
        UserOp["User CRUD<br/>Authentication"]
        BookingOp["Booking CRUD<br/>Pricing Calcs"]
        CabinOp["Cabin CRUD<br/>Image Upload"]
        GuestOp["Guest CRUD"]
        SettingOp["Settings CRUD<br/>Global Config"]
    end

    Login -->|JWT Auth| AuthAPI
    Dashboard -->|fetch analytics| BookingAPI & CabinAPI
    Bookings -->|CRUD| BookingAPI
    Cabins -->|CRUD| CabinAPI
    CheckIn -->|update status| BookingAPI
    Users -->|CRUD| UserAPI
    Account -->|GET/PATCH| SettingsAPI

    AuthAPI --> UserOp
    BookingAPI --> BookingOp
    CabinAPI --> CabinOp
    GuestAPI --> GuestOp
    UserAPI --> UserOp
    SettingsAPI --> SettingOp

    style Login fill:#ff9800
    style Dashboard fill:#4caf50
    style Bookings fill:#2196f3
    style Cabins fill:#9c27b0
    style CheckIn fill:#00bcd4
    style Users fill:#f44336
    style Account fill:#ffc107
    style AuthAPI fill:#ff9800,color:#000
    style BookingAPI fill:#2196f3,color:#fff
    style CabinAPI fill:#9c27b0,color:#fff
    style GuestAPI fill:#00bcd4,color:#000
    style SettingsAPI fill:#ffc107,color:#000
    style UserAPI fill:#f44336,color:#fff
```

## Docker Deployment

### Building Images

```bash
# Build specific service
docker compose build api
docker compose build ui

# Build all services
docker compose build
```

### Running Containers

```bash
# Run detached
docker compose up -d

# View logs
docker compose logs -f api
docker compose logs -f ui

# Execute commands in container
docker compose exec api yarn prisma:migrate
docker compose exec api yarn test
```

## Contributing

### Development Workflow

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Make your changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/feature-name`
4. Open a pull request

### Code Standards

- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Maintain TypeScript type safety
- Document complex logic
- Use conventional commit messages

### Testing Requirements

- Unit tests for utilities and business logic
- Integration tests for API routes
- Component tests for UI components
- Aim for 80%+ code coverage

## Security Considerations

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Rate limiting on API endpoints
- ✅ Helmet security headers
- ✅ Input validation with Zod
- ✅ Environment variable isolation
- ⚠️ Always use strong JWT secrets in production
- ⚠️ Enable HTTPS in production
- ⚠️ Keep dependencies updated

## Performance Tips

- **Frontend**:
  - Enable code splitting in Vite
  - Use React Query for efficient data fetching
  - Lazy load route components
  - Optimize images with Sharp

- **Backend**:
  - Use database indexes on frequently queried columns
  - Implement caching strategies
  - Use connection pooling
  - Monitor API response times

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker compose ps

# View database logs
docker compose logs postgres

# Manually run migrations
docker compose exec api yarn prisma:migrate dev
```

### Port Already in Use

```bash
# Change ports in docker-compose.yaml or .env
# Ensure no other services are using ports 80, 3000, 5432
```

### Tests Failing

```bash
# Clear jest cache
yarn test --clearCache

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

## Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## License

MIT License - See LICENSE file for details

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Maintained By**: Development Team
