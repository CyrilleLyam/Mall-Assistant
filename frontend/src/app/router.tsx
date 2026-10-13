import { Navigate, createBrowserRouter } from 'react-router-dom'
import { LoginPage, ProtectedRoute } from '../features/auth'
import { EventsPage } from '../features/events'
import { StoreDetailPage, StoresPage } from '../features/stores'
import { PublicLayout } from './layouts/PublicLayout'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/stores" replace /> },
      { path: 'stores', element: <StoresPage /> },
      { path: 'stores/:id', element: <StoreDetailPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'admin/login', element: <LoginPage /> },
    ],
  },
  {
    path: 'admin',
    element: <ProtectedRoute />,
    children: [
      {
        lazy: async () => ({ Component: (await import('./layouts/AdminLayout')).AdminLayout }),
        children: [
          { index: true, element: <Navigate to="stores" replace /> },
          {
            path: 'stores',
            lazy: async () => ({ Component: (await import('../features/admin')).AdminStoresPage }),
          },
          {
            path: 'events',
            lazy: async () => ({ Component: (await import('../features/admin')).AdminEventsPage }),
          },
          {
            path: 'analytics',
            lazy: async () => ({ Component: (await import('../features/analytics')).AnalyticsPage }),
          },
        ],
      },
    ],
  },
])
