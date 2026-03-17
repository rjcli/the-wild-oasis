# Wild Oasis UI

A modern, responsive React-based frontend for the Wild Oasis hotel management system. Built with Vite, Styled Components, and React Query.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [Architecture](#architecture)
- [Custom Hooks](#custom-hooks)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Performance & Optimization](#performance--optimization)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## Overview

The Wild Oasis UI provides a comprehensive user interface for hotel management operations:

- **Dashboard**: Real-time analytics and key metrics
- **Cabin Management**: Browse, create, edit, and manage cabins
- **Booking System**: View, create, and manage reservations
- **Guest Management**: Manage guest profiles and history
- **Check-in/Check-out**: Streamline guest arrival and departure
- **Settings**: User profile and system preferences
- **Dark Mode**: Light and dark theme support
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Build Tool       | Vite 5.3                        |
| Framework        | React 18.3                      |
| Language         | JavaScript/JSX                  |
| Styling          | Styled Components 6.1           |
| State Management | React Query (TanStack) 5.51     |
| Routing          | React Router 6.25               |
| Form Management  | React Hook Form 7.52            |
| Form Validation  | (Zod via API)                   |
| HTTP Client      | Browser Fetch API               |
| Charts           | Recharts 3.8                    |
| Icons            | React Icons 5.2                 |
| Notifications    | React Hot Toast 2.4             |
| Date Handling    | date-fns 3.6                    |
| Dark Mode        | Custom Hook + localStorage      |
| Testing          | Jest 30+, React Testing Library |
| Code Quality     | ESLint, Prettier                |

## Project Structure

```
ui/
├── src/
│   ├── features/                 # Feature modules (self-contained)
│   │   ├── authentication/       # Login/signup flows
│   │   ├── bookings/             # Booking list, details, create
│   │   ├── cabins/               # Cabin management
│   │   ├── check-in-out/         # Check-in/check-out flows
│   │   ├── dashboard/            # Dashboard with analytics
│   │   └── settings/             # User settings
│   │
│   ├── components/               # Reusable UI components
│   │   ├── CommonComponents.jsx
│   │   ├── FilterMenu.jsx
│   │   ├── FormRow.jsx
│   │   └── ...
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useDarkMode.js        # Dark/light theme toggle
│   │   ├── useLocalStorageState.js
│   │   ├── useMoveBack.js
│   │   └── useOutsideClick.js
│   │
│   ├── pages/                    # Page components
│   │   ├── Account.jsx
│   │   ├── Booking.jsx
│   │   ├── Bookings.jsx
│   │   ├── CabinDetail.jsx
│   │   ├── Cabins.jsx
│   │   ├── Checkin.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   └── Settings.jsx
│   │
│   ├── services/                 # API services
│   │   ├── apiClient.js         # Fetch/axios configuration
│   │   ├── apiAuth.js           # Authentication endpoints
│   │   ├── apiBookings.js       # Booking endpoints
│   │   ├── apiCabins.js         # Cabin endpoints
│   │   ├── apiGuests.js         # Guest endpoints
│   │   └── apiSettings.js       # Settings endpoints
│   │
│   ├── styles/                   # Global styles
│   │   ├── GlobalStyles.js       # Global CSS-in-JS
│   │   └── theme.js             # Theme configuration
│   │
│   ├── ui/                       # UI-specific utilities
│   │   ├── ...
│   │
│   ├── utils/                    # Utility functions
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   │
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
│
├── __tests__/                     # Test files
│   ├── hooks/
│   └── __mocks__/
│
├── public/                        # Static assets
│   ├── img/
│   └── data/
│
├── jest.config.js                # Jest configuration
├── vite.config.js                # Vite configuration
├── index.html                    # HTML entry point
├── package.json
└── README.md
```

## Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Backend API**: Running instance of Wild Oasis API (localhost:3000)

## Installation & Setup

### 1. Install Dependencies

```bash
cd ui
yarn install

# or with npm
npm install
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your API configuration
nano .env
```

### 3. Start Development Server

```bash
yarn dev

# UI will be available at http://localhost:5173
```

### 4. Build for Production

```bash
yarn build

# Preview production build
yarn preview
```

## Environment Variables

Create a `.env` file (copy from `env.example`):

```env
# API configuration
VITE_API_ORIGIN=http://localhost:3000
VITE_API_URL=http://localhost:3000/api/v1

# Optional: Application metadata
VITE_APP_TITLE=Wild Oasis
VITE_APP_VERSION=1.0.0
```

**Note**: Environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Available Scripts

### Development

```bash
# Start development server with hot reload
yarn dev

# Build for production
yarn build

# Preview production build locally
yarn preview
```

### Testing

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate coverage report
yarn test:coverage
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

## Features

### 📊 Dashboard

- Key metrics overview (revenue, bookings, occupancy)
- Sales trend charts
- Recent bookings
- Today's check-in/check-out activities

### 🏠 Cabin Management

- List all cabins with images
- Create new cabins with image upload
- Edit cabin details
- Delete cabins
- Search and filter cabins

### 📅 Booking System

- View all bookings with status
- Filter by status (unconfirmed, checked_in, checked_out)
- Sort by date or price
- Create new bookings
- Edit booking details
- Track booking status

### 👥 Guest Management

- Browse all guests
- View guest booking history
- Create guest profiles
- Update guest information
- Delete guests

### ✈️ Check-in/Check-out

- Quick check-in form
- Breakfast cost calculation
- Payment status tracking
- Check-out confirmation

### ⚙️ Settings

- User profile management
- Avatar upload
- Change password
- Hotel settings (booking rules, breakfast price)

### 🌓 Dark Mode

- System preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth transitions

## Architecture

### Component Structure

**Feature-Based Organization**:

- Each feature (bookings, cabins, etc.) is self-contained
- Contains pages, components, and logic related to that feature
- Easier to scale and maintain

**Custom Hooks**:

- `useDarkMode`: Dark/light theme management
- `useLocalStorageState`: Persist state to localStorage
- `useMoveBack`: Navigation back functionality
- `useOutsideClick`: Close dropdowns/modals on outside click

**Styled Components**:

- CSS-in-JS for component-scoped styling
- Dynamic styling based on props and theme
- No CSS conflicts

### State Management

**React Query (TanStack Query)**:

- Server state management
- Automatic caching and synchronization
- Background refetching
- Optimistic updates
- Query invalidation

**Component State**:

- Local state with `useState`
- Form state with `React Hook Form`

**Persistent State**:

- localStorage for user preferences (theme, preferences)
- Custom `useLocalStorageState` hook

## Custom Hooks

### useDarkMode

Manages dark/light theme:

```javascript
const { isDark, toggleDark } = useDarkMode();
```

### useLocalStorageState

Persists state to localStorage:

```javascript
const [value, setValue] = useLocalStorageState(initialValue, 'storage-key');
```

### useMoveBack

Navigate back with fallback:

```javascript
const moveBack = useMoveBack();
// Navigates back or to fallback route
```

### useOutsideClick

Close element when clicking outside:

```javascript
const { ref } = useOutsideClick(() => {
  setIsOpen(false);
});

return <div ref={ref}>Content</div>;
```

## API Integration

### API Client Setup

```javascript
// services/apiClient.js
const API_URL = import.meta.env.VITE_API_URL;

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};
```

### Using React Query

```javascript
// services/apiBookings.js
import { useQuery, useMutation } from '@tanstack/react-query';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => apiCall('/bookings'),
  });
};

export const useCreateBooking = () => {
  return useMutation({
    mutationFn: (data) =>
      apiCall('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// In component
const { data: bookings, isLoading } = useBookings();
const { mutate: createBooking } = useCreateBooking();
```

## Testing

### Running Tests

```bash
# All tests
yarn test

# Watch mode (rerun on changes)
yarn test:watch

# Coverage report
yarn test:coverage
```

### Test Structure

```javascript
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from '../../hooks/useDarkMode';

describe('useDarkMode Hook', () => {
  it('should toggle dark mode', () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);

    act(() => {
      result.current.toggleDark();
    });

    expect(result.current.isDark).toBe(true);
  });
});
```

### Component Testing

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('should submit login form', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## Performance & Optimization

### Code Splitting

Vite automatically code-splits route components:

```javascript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>;
```

### Image Optimization

```javascript
// Serve appropriately sized images
<img
  src='cabin.jpg?w=400&h=300&fit=cover'
  srcSet='cabin.jpg?w=800&h=600 2x'
  alt='Cabin'
/>
```

### Query Caching

React Query automatically caches data:

```javascript
// Cache will be reused for 5 minutes by default
const { data } = useQuery({
  queryKey: ['bookings'],
  queryFn: fetchBookings,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Lazy Loading

```javascript
// Load charts only when needed
const Charts = lazy(() => import('./components/Charts'));
```

## Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.js
# or kill existing process (macOS/Linux)
lsof -i :5173
kill -9 <PID>
```

### API Connection Issues

- Verify backend is running (`http://localhost:3000`)
- Check `VITE_API_URL` in `.env`
- Check CORS settings in API
- Open DevTools Network tab to see errors

### Tests Failing

```bash
# Clear Jest cache
yarn test --clearCache

# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Dark Mode Not Working

- Ensure localStorage is enabled
- Check browser DevTools > Application > localStorage
- Verify `useDarkMode` hook is properly initialized

## Deployment

### Build for Production

```bash
yarn build

# Output in dist/ directory
```

### Deployment Options

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Using Docker Compose

```bash
# Build and start UI with API
docker compose up --build

# View logs
docker compose logs -f ui

# Stop services
docker compose down
```

### Environment for Production

```env
VITE_API_ORIGIN=https://api.yourdomain.com
VITE_API_URL=https://api.yourdomain.com/api/v1
```

### Performance Checklist

- [ ] All images optimized (compressed, correct sizes)
- [ ] Code splitting enabled
- [ ] Cache headers configured
- [ ] GZIP compression enabled
- [ ] Minified builds (Vite does this automatically)
- [ ] Service Worker for offline support (optional)
- [ ] Analytics configured
- [ ] Security headers set (CSP, etc.)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: Modern browsers

## Development Workflow

### Adding a New Feature

```bash
# 1. Create feature directory
mkdir src/features/myfeature

# 2. Create pages and components
src/features/myfeature/
├── MyFeaturePage.jsx
├── components/
└── hooks.js

# 3. Add routes in App.jsx
# 4. Create API service if needed
# 5. Write tests
# 6. Test in development

yarn dev
```

### Git Workflow

```bash
git checkout -b feature/my-feature
# Make changes
yarn test
yarn lint:fix
git commit -m "Add my feature"
git push origin feature/my-feature
# Create Pull Request
```

## VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native Snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Thunder Client** (or Postman)
- **Styled Components Syntax**
- **React Developer Tools** (Browser)

## Key Files to Know

| File             | Purpose                    |
| ---------------- | -------------------------- |
| `src/App.jsx`    | Main app router and layout |
| `src/main.jsx`   | App entry point            |
| `vite.config.js` | Vite configuration         |
| `jest.config.js` | Jest testing config        |
| `jest.setup.js`  | Jest setup and mocks       |
| `.env.example`   | Environment template       |

## Performance Tips

1. **Use React Query** for server state instead of useEffect
2. **Lazy load** route components
3. **Memoize** expensive computations with `useMemo`
4. **Prevent re-renders** with `useCallback`
5. **Virtual scrolling** for large lists
6. **Image optimization** with appropriate sizes
7. **Monitor** bundle size with `npm run build --report`

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "Add feature"`
3. Push branch: `git push origin feature/name`
4. Open pull request

## Support

For issues or questions:

- Check existing issues on GitHub
- Read feature documentation
- Review test files for examples
- Check browser console for errors

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Node Version**: 18+  
**React Version**: 18.3+
