import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { Root } from './Root';
import { LoginPage } from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { PosPage } from '@/pages/PosPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SuppliersPage } from '@/pages/SuppliersPage';
import { EcommercePage } from '@/pages/EcommercePage';
import { EventsPage } from '@/pages/EventsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SalesHistoryPage } from './pages/SalesHistoryPage';
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "inventory", element: <InventoryPage /> },
      { path: "pos", element: <PosPage /> },
      { path: "sales-history", element: <SalesHistoryPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "suppliers", element: <SuppliersPage /> },
      { path: "ecommerce", element: <EcommercePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
);