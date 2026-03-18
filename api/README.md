# Wild Oasis API 🚀

A robust, TypeScript-based REST API for the Wild Oasis hotel management system. Built with Express.js, PostgreSQL, and Prisma ORM.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Authentication](#authentication)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Development Tips](#development-tips)
- [Deployment](#deployment)

## Overview

The Wild Oasis API serves as the backend for the hotel management system, providing comprehensive endpoints for:

- **Authentication**: User login, registration, and token management
- **Cabin Management**: CRUD operations for room inventory
- **Booking System**: Reservation creation, updates, and tracking
- **Guest Management**: Guest profile management
- **Check-in/Check-out**: Room occupancy tracking
- **Settings**: User and system configuration
- **File Uploads**: Avatar and cabin image uploads with image optimization

## Tech Stack

| Layer        | Technology                         |
| ------------ | ---------------------------------- |
| Runtime      | Node.js 18+                        |
| Language     | TypeScript 5                       |
| Framework    | Express 4.19                       |
| ORM          | Prisma 5.15                        |
| Database     | PostgreSQL 14+                     |
| Auth         | JWT (access + refresh tokens)      |
| Validation   | Zod                                |
| File uploads | Multer + Sharp                     |
| Security     | Helmet, express-rate-limit, bcrypt |
| Testing      | Jest, Supertest                    |
| Code Quality | ESLint, Prettier                   |

## Prerequisites

- Node.js ≥ 18
- npm or yarn
- PostgreSQL 14+ (local or hosted: [Railway](https://railway.app), [Supabase](https://supabase.com), [Neon](https://neon.tech))
- Git

## Project Structure

```
api/
├── src/
│   ├── config/                  # Configuration modules
│   │   ├── env.ts               # Environment variables validation
│   │   ├── prisma.ts            # Prisma client instance
│   │   └── swagger.ts           # Swagger documentation config
│   │
│   ├── controllers/             # Request handlers
│   │   ├── authController.ts    # Auth endpoints logic
│   │   ├── bookingController.ts # Booking endpoints logic
│   │   ├── cabinController.ts   # Cabin endpoints logic
│   │   ├── guestController.ts   # Guest endpoints logic
│   │   └── settingsController.ts# Settings endpoints logic
│   │
│   ├── middleware/              # Express middleware
│   │   ├── auth.ts              # JWT authentication
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── upload.ts            # File upload configuration
│   │   └── validate.ts          # Request validation
│   │
│   ├── routes/                  # API routes
│   │   ├── authRoutes.ts
│   │   ├── bookingRoutes.ts
│   │   ├── cabinRoutes.ts
│   │   ├── guestRoutes.ts
│   │   └── settingsRoutes.ts
│   │
│   ├── schemas/                 # Zod validation schemas
│   │   ├── authSchemas.ts
│   │   ├── bookingSchemas.ts
│   │   ├── cabinSchemas.ts
│   │   ├── guestSchemas.ts
│   │   └── settingsSchemas.ts
│   │
│   ├── utils/                   # Helper functions
│   │   ├── AppError.ts          # Custom error class
│   │   ├── catchAsync.ts        # Async error wrapper
│   │   └── helpers.ts           # Utility functions
│   │
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Database seeding script
│   └── migrations/              # Database migrations
│
├── public/
│   └── uploads/                 # User uploads
│       ├── avatars/
│       └── cabins/
│
├── __tests__/                   # Test files
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   └── utils/
│
├── jest.config.js               # Jest configuration
├── tsconfig.json                # TypeScript configuration
├── package.json
└── README.md
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd api
yarn install

# or with npm
npm install
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 3. Database Setup

```bash
# Generate Prisma Client
yarn prisma:generate

# Run migrations
yarn prisma:migrate dev

# (Optional) Seed database with sample data
yarn prisma:seed

# View database with Prisma Studio
yarn prisma:studio
```

### 4. Start Development Server

```bash
yarn dev

# Server will run on http://localhost:3000
```

## Environment Variables

Create a `.env` file based on `env.example`:

```env
# Database credentials
DATABASE_URL=postgresql://user:password@localhost:5432/wild_oasis
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=wild_oasis

# API configuration
API_PORT=3000
NODE_ENV=development

# Authentication secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-secret-key-min-32-chars-change-in-production
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# CORS configuration
CORS_ORIGINS=http://localhost,http://localhost:5173,http://localhost:3000

# File upload
MAX_FILE_SIZE_MB=5

# Logging
LOG_LEVEL=debug
```

> **Tip**: Generate secure secrets with:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

## Available Scripts

### Development

```bash
# Start development server with hot reload
yarn dev

# Build TypeScript
yarn build

# Start production server
yarn start
```

### Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run specific test file
yarn test path/to/test.test.ts
```

### Database

```bash
# Generate Prisma Client
yarn prisma:generate

# Run pending migrations
yarn prisma:migrate dev

# Deploy migrations (production)
yarn prisma:migrate deploy

# Open Prisma Studio GUI
yarn prisma:studio

# Seed database
yarn prisma:seed

# Seed with PostgreSQL script
yarn db:seed:pg
```

### Code Quality

```bash
# Lint code
yarn lint

# Fix linting issues
yarn lint:fix

# Check code formatting
yarn prettier

# Format code
yarn prettier:write
```

## API Endpoints

All routes are prefixed with `/api/v1`. Protected routes require `Authorization: Bearer <accessToken>` header.

### Authentication `/api/v1/auth` (Public)

| Method | Path               | Description                          |
| ------ | ------------------ | ------------------------------------ |
| POST   | `/login`           | User login → returns JWT tokens      |
| POST   | `/signup`          | Create new staff user                |
| POST   | `/refresh-token`   | Refresh access token                 |
| GET    | `/me`              | Get current user profile (protected) |
| PATCH  | `/update-me`       | Update profile (protected)           |
| PATCH  | `/update-password` | Change password (protected)          |

**Login Request:**

```json
{
  "email": "admin@wilodoasis.com",
  "password": "password123"
}
```

**Login Response:**

```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": {
      "id": 1,
      "email": "admin@wilodoasis.com",
      "name": "Admin User",
      "avatar": null,
      "role": "admin"
    }
  }
}
```

### Cabins `/api/v1/cabins` 🔒 (Protected)

| Method | Path   | Description                   |
| ------ | ------ | ----------------------------- |
| GET    | `/`    | List all cabins               |
| GET    | `/:id` | Get cabin details             |
| POST   | `/`    | Create cabin (multipart/form) |
| PATCH  | `/:id` | Update cabin (multipart/form) |
| DELETE | `/:id` | Delete cabin                  |

**Upload**: Use `multipart/form-data` with `image` field for cabin photos.

### Bookings `/api/v1/bookings` 🔒 (Protected)

| Method | Path                         | Description                                   |
| ------ | ---------------------------- | --------------------------------------------- |
| GET    | `/`                          | List bookings (with filter, sort, pagination) |
| GET    | `/:id`                       | Get booking details                           |
| POST   | `/`                          | Create booking                                |
| PATCH  | `/:id`                       | Update booking (status, payment, etc.)        |
| DELETE | `/:id`                       | Delete booking                                |
| GET    | `/today-activity`            | Today's check-ins/check-outs                  |
| GET    | `/after-date?date=ISO`       | Bookings created after date (for charts)      |
| GET    | `/stays-after-date?date=ISO` | Stays starting after date (for charts)        |

**Query Parameters for GET /:**

- `status`: `all`, `unconfirmed`, `checked_in`, `checked_out`
- `sortBy`: `startDate-asc`, `startDate-desc`, `totalPrice-asc`, `totalPrice-desc`
- `page`: integer (default: 1, size: 10)

### Guests `/api/v1/guests` 🔒 (Protected)

| Method | Path   | Description                 |
| ------ | ------ | --------------------------- |
| GET    | `/`    | List all guests             |
| GET    | `/:id` | Get guest details & history |
| POST   | `/`    | Create guest                |
| PATCH  | `/:id` | Update guest                |
| DELETE | `/:id` | Delete guest                |

### Settings `/api/v1/settings` 🔒 (Protected)

| Method | Path | Description           |
| ------ | ---- | --------------------- |
| GET    | `/`  | Get hotel settings    |
| PATCH  | `/`  | Update hotel settings |

**Settings Fields**: `minBookingLength`, `maxBookingLength`, `maxGuestsPerBooking`, `breakfastPrice`

### Static Files

Uploaded images are served statically:

```
GET /public/uploads/cabins/<filename>
GET /public/uploads/avatars/<filename>
```

## Database

### Schema Overview

Key models:

- **User**: System user accounts (staff/admin)
- **Cabin**: Room inventory with pricing
- **Booking**: Reservation records
- **Guest**: External guest information
- **Settings**: System configuration

### Running Migrations

```bash
# Create new migration from schema changes
yarn prisma:migrate dev --name describe_changes

# View migration status
npx prisma migrate status

# Reset database (development only!)
npx prisma migrate reset

# Deploy migrations (production)
yarn prisma:migrate deploy
```

### Database Seeding

```bash
# Seed with TypeScript script
yarn prisma:seed

# Seeds 8 cabins, 10 guests, and sample bookings
# Default admin: admin@wilodoasis.com / password123
```

## Authentication

The API uses JWT (JSON Web Tokens):

1. User logs in → server issues `accessToken` (1 day) and `refreshToken` (7 days)
2. Client stores tokens and includes `Authorization: Bearer <accessToken>` header
3. Token expires → client uses `refreshToken` to request new `accessToken`
4. Protected routes validate token before processing

```typescript
// Protecting routes
router.get('/protected', authenticate, handler);
router.post('/admin-only', authenticate, authorize('admin'), handler);
```

## Validation

Input validation uses **Zod** schemas for type-safe validation:

```typescript
const createCabinSchema = z.object({
  name: z.string().min(1, 'Cabin name required'),
  maxCapacity: z.number().int().positive(),
  regularPrice: z.number().positive(),
  discount: z.number().nonnegative().optional(),
});

router.post('/cabins', validate(createCabinSchema), createCabin);
```

## Error Handling

Errors are caught and returned in a consistent format:

```json
{
  "status": "fail",
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2024-03-17T10:30:00Z"
}
```

Common status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation failed)
- `401`: Unauthorized (no/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Testing

### Run Tests

```bash
# All tests
yarn test

# Watch mode
yarn test:watch

# Coverage report
yarn test:coverage
```

### Test Example

```typescript
describe('AuthController', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@wilodoasis.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });
});
```

## Development Tips

### VS Code Extensions

- ESLint
- Prettier - Code formatter
- Thunder Client (API testing)
- Prisma
- REST Client

### Database Inspection

```bash
# Open Prisma Studio
yarn prisma:studio

# Opens at http://localhost:5555
# GUI for viewing and editing database records
```

### Debugging

```bash
# With Node Inspector
node --inspect-brk dist/server.js

# In VS Code, press Ctrl+Shift+D and select "Node"
```

### Common Issues

**Port Already in Use**

```bash
# macOS/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database Connection Failed**

```bash
# Check PostgreSQL is running
psql -U postgres -h localhost

# Verify DATABASE_URL in .env
```

**Prisma Migration Issues**

```bash
# Reset database  (development only!)
npx prisma migrate reset

# Regenerate client
yarn prisma:generate
```

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT secrets (32+ characters)
- [ ] Use HTTPS only
- [ ] Configure CORS origins properly
- [ ] Use production database with backups
- [ ] Enable rate limiting
- [ ] Set up logging and monitoring
- [ ] Configure email service (if needed)
- [ ] Run `yarn build` and test
- [ ] Use PM2 or Docker for process management

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
```

### Using Docker Compose

```bash
# Build and start API with database
docker compose up --build

# View logs
docker compose logs -f api

# Run migrations
docker compose exec api yarn prisma:migrate dev

# Stop services
docker compose down
```

### Environment for Production

```env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
CORS_ORIGINS=https://yourdomain.com
DATABASE_URL=postgresql://prod_user:secure_password@prod-host:5432/wild_oasis_prod
```

## Security Best Practices

✅ Input validation with Zod  
✅ Password hashing with bcryptjs  
✅ Helmet security headers  
✅ CORS configuration  
✅ Rate limiting on endpoints  
✅ JWT authentication & refresh tokens  
✅ Environment variable secrets  
✅ HTTPS in production  
✅ Regular dependency updates

## Support & Contributing

For issues or contributions:

1. Check existing GitHub issues
2. Follow code style (ESLint, Prettier)
3. Add tests for new features
4. Submit detailed pull requests
5. Include updates to documentation

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**API Spec**: REST (OpenAPI 3.0)
