import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

const SpinnerFullPage = lazy(() => import('./ui/SpinnerFullPage'));
const AppLayout = lazy(() => import('./ui/AppLayout'));
const ProtectedRoute = lazy(() => import('./ui/ProtectedRoute'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Booking = lazy(() => import('./pages/Booking'));
const Checkin = lazy(() => import('./pages/Checkin'));
const Cabins = lazy(() => import('./pages/Cabins'));
const CabinDetail = lazy(() => import('./pages/CabinDetail'));
const Users = lazy(() => import('./pages/Users'));
const Settings = lazy(() => import('./pages/Settings'));
const Account = lazy(() => import('./pages/Account'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — prevents immediate refetch on navigation
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyles />
      <BrowserRouter>
        <Suspense fallback={<SpinnerFullPage />}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to='/dashboard' />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='cabins' element={<Cabins />} />
              <Route path='cabins/:cabinId' element={<CabinDetail />} />

              <Route element={<ProtectedRoute />}>
                <Route path='bookings' element={<Bookings />} />
                <Route path='bookings/:bookingId' element={<Booking />} />
                <Route path='checkin/:bookingId' element={<Checkin />} />
                <Route path='users' element={<Users />} />
                <Route path='settings' element={<Settings />} />
                <Route path='account' element={<Account />} />
              </Route>
            </Route>
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster
        position='top-center'
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: 'var(--color-grey-0)',
            color: 'var(--color-grey-700)',
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;
