import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { ReactElement, ReactNode } from 'react';

// Context Providers
import { MenuProvider } from '@/context/MenuContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Layout Components
import Navbar from '@/components/layout/Navbar';
import MobileTabBar from '@/components/layout/MobileTabBar';
import AdminLayout from '@/components/layout/AdminLayout';

// Route Guards
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';

// Public Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Code from '@/pages/Code';

// Protected User Pages
import Product from '@/pages/Product';
import Arena from '@/pages/Arena';
import Sponsors from '@/pages/Sponsors';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/Profile/EditProfile';
import Payment from '@/pages/Payment';
import Favorites from '@/pages/Favorites';
import Language from '@/pages/Language';
import Location from '@/pages/Location';
import Theme from '@/pages/Theme';
import ClearData from '@/pages/ClearData';
import Store from '@/components/store/store';
import Cart from '@/pages/Cart';

// Admin Pages
import Dashboard from '@/pages/Admin/Dashboard';
import UserManagement from '@/pages/Admin/UserManagement';
import ProductManagement from '@/pages/Admin/ProductManagement';
import OrderManagement from '@/pages/Admin/OrderManagement';
import ReportsAndAnalysis from '@/pages/Admin/ReportsAndAnalysis';
import Configuration from '@/pages/Admin/Configuration';

/**
 * Layout configuration options
 */
interface LayoutOptions {
  readonly showNavbar: boolean;
  readonly showMobileTabBar: boolean;
}

/**
 * Route definition structure
 */
interface RouteDefinition {
  readonly path: string;
  readonly Component: React.ComponentType;
  readonly layout: LayoutOptions;
}

/**
 * Admin route definition structure
 */
interface AdminRouteDefinition {
  readonly path: string;
  readonly Component: React.ComponentType;
  readonly isIndex?: boolean;
}

/**
 * Predefined layout configurations
 */
const LAYOUT_CONFIGS = {
  FULL: { showNavbar: true, showMobileTabBar: true } as const,
  NAVBAR_ONLY: { showNavbar: true, showMobileTabBar: false } as const,
  NONE: { showNavbar: false, showMobileTabBar: false } as const,
} as const;

/**
 * Public route definitions accessible to all users
 */
const PUBLIC_ROUTES: ReadonlyArray<RouteDefinition> = [
  { path: '/', Component: Home, layout: LAYOUT_CONFIGS.FULL },
  { path: '/about', Component: About, layout: LAYOUT_CONFIGS.FULL },
  { path: '/contact', Component: Contact, layout: LAYOUT_CONFIGS.FULL },
  { path: '/login', Component: Login, layout: LAYOUT_CONFIGS.NAVBAR_ONLY },
  { path: '/register', Component: Register, layout: LAYOUT_CONFIGS.NAVBAR_ONLY },
  { path: '/forgot-password', Component: ForgotPassword, layout: LAYOUT_CONFIGS.NAVBAR_ONLY },
  { path: '/reset-password', Component: ResetPassword, layout: LAYOUT_CONFIGS.NAVBAR_ONLY },
  { path: '/code', Component: Code, layout: LAYOUT_CONFIGS.NAVBAR_ONLY },
];

/**
 * Protected route definitions requiring authentication
 */
const PROTECTED_ROUTES: ReadonlyArray<RouteDefinition> = [
  { path: '/store', Component: Store, layout: LAYOUT_CONFIGS.FULL },
  { path: '/arena', Component: Arena, layout: LAYOUT_CONFIGS.FULL },
  { path: '/product', Component: Product, layout: LAYOUT_CONFIGS.FULL },
  { path: '/cart', Component: Cart, layout: LAYOUT_CONFIGS.FULL },
  { path: '/sponsors', Component: Sponsors, layout: LAYOUT_CONFIGS.FULL },
  { path: '/profile', Component: Profile, layout: LAYOUT_CONFIGS.FULL },
  { path: '/profile/edit', Component: EditProfile, layout: LAYOUT_CONFIGS.FULL },
  { path: '/payment', Component: Payment, layout: LAYOUT_CONFIGS.FULL },
  { path: '/profile/favorites', Component: Favorites, layout: LAYOUT_CONFIGS.FULL },
  { path: '/profile/language', Component: Language, layout: LAYOUT_CONFIGS.FULL },
  { path: '/profile/location', Component: Location, layout: LAYOUT_CONFIGS.FULL },
  { path: '/profile/theme', Component: Theme, layout: LAYOUT_CONFIGS.FULL },
  { path: '/profile/clear-data', Component: ClearData, layout: LAYOUT_CONFIGS.FULL },
];

/**
 * Admin route definitions requiring admin privileges
 */
const ADMIN_ROUTES: ReadonlyArray<AdminRouteDefinition> = [
  { path: '', Component: Dashboard, isIndex: true },
  { path: 'users', Component: UserManagement },
  { path: 'products', Component: ProductManagement },
  { path: 'orders', Component: OrderManagement },
  { path: 'reports', Component: ReportsAndAnalysis },
  { path: 'settings', Component: Configuration },
];

/**
 * Higher-order component that wraps a page with layout components
 */
const withLayout = (
  Component: React.ComponentType,
  options: LayoutOptions
): ReactElement => {
  const { showNavbar, showMobileTabBar } = options;

  return (
    <>
      {showNavbar && <Navbar />}
      <Component />
      {showMobileTabBar && <MobileTabBar />}
    </>
  );
};

/**
 * Renders public routes accessible to all users
 */
const PublicRoutes = (): ReactNode => (
  <>
    {PUBLIC_ROUTES.map(({ path, Component, layout }) => (
      <Route key={path} path={path} element={withLayout(Component, layout)} />
    ))}
  </>
);

/**
 * Renders protected routes wrapped with authentication guard
 */
const ProtectedRoutes = (): ReactNode => (
  <>
    {PROTECTED_ROUTES.map(({ path, Component, layout }) => (
      <Route
        key={path}
        path={path}
        element={
          <ProtectedRoute>
            {withLayout(Component, layout)}
          </ProtectedRoute>
        }
      />
    ))}
  </>
);

/**
 * Renders admin routes wrapped with admin guard and layout
 */
const AdminRoutes = (): ReactNode => (
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    {ADMIN_ROUTES.map(({ path, Component, isIndex }) => (
      <Route
        key={path || 'admin-index'}
        path={path}
        element={<Component />}
        index={isIndex}
      />
    ))}
  </Route>
);

/**
 * Root application component with provider hierarchy and routing
 */
const App = (): ReactElement => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <MenuProvider>
            <Routes>
              {PublicRoutes()}
              {ProtectedRoutes()}
              {AdminRoutes()}
            </Routes>
          </MenuProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;