import { Navigate, createBrowserRouter } from 'react-router-dom'
import { LoginPage, ProtectedRoute } from '../features/auth'
import { EventsPage } from '../features/events'
import { StoreDetailPage, StoresPage } from '../features/stores'
import { PublicLayout } from './layouts/PublicLayout'

const adminPage = (name: 'AdminStoresPage' | 'AdminStoreFormPage' | 'AdminEventsPage' | 'AdminEventFormPage') =>
  async () => ({ Component: (await import('../features/admin'))[name] })

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
          { path: 'stores', lazy: adminPage('AdminStoresPage') },
          { path: 'stores/new', lazy: adminPage('AdminStoreFormPage') },
          { path: 'stores/:id/edit', lazy: adminPage('AdminStoreFormPage') },
          { path: 'events', lazy: adminPage('AdminEventsPage') },
          { path: 'events/new', lazy: adminPage('AdminEventFormPage') },
          { path: 'events/:id/edit', lazy: adminPage('AdminEventFormPage') },
          {
            path: 'analytics',
            lazy: async () => ({ Component: (await import('../features/analytics')).AnalyticsPage }),
          },
        ],
      },
    ],
  },
])
