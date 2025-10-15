import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MenuProvider } from './context/MenuContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import MobileTabBar from './components/layout/MobileTabBar';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Product from './pages/Product';
import Arena from './pages/Arena';
import Sponsors from './pages/Sponsors';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Code from './pages/Code';
import Profile from './pages/Profile';
import EditProfile from './pages/Profile/EditProfile';
import Payment from './pages/Payment';
import Favorites from './pages/Favorites';
import Language from './pages/Language';
import Location from './pages/Location';
import Theme from './pages/Theme';
import ClearData from './pages/ClearData';
import Store from './components/store/store';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import ProductManagement from './pages/Admin/ProductManagement';
import OrderManagement from './pages/Admin/OrderManagement';
import ReportsAndAnalysis from './pages/Admin/ReportsAndAnalysis';
import Configuration from './pages/Admin/Configuration';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <MenuProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                  <MobileTabBar />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navbar />
                  <About />
                  <MobileTabBar />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <Contact />
                  <MobileTabBar />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Navbar />
                  <Login />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Navbar />
                  <Register />
                </>
              } />
              <Route path="/forgot-password" element={
                <>
                  <Navbar />
                  <ForgotPassword />
                </>
              } />
              <Route path="/reset-password" element={
                <>
                  <Navbar />
                  <ResetPassword />
                </>
              } />
              <Route path="/code" element={
                <>
                  <Navbar />
                  <Code />
                </>
              } />

              {/* Protected User Routes */}
              <Route path="/store" element={
                <ProtectedRoute>
                  <Navbar />
                  <Store />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/arena" element={
                <ProtectedRoute>
                  <Navbar />
                  <Arena />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/product" element={
                <ProtectedRoute>
                  <Navbar />
                  <Product />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Navbar />
                  <Cart />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/sponsors" element={
                <ProtectedRoute>
                  <Navbar />
                  <Sponsors />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Navbar />
                  <Profile />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <Navbar />
                  <EditProfile />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute>
                  <Navbar />
                  <Payment />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/profile/favorites" element={
                <ProtectedRoute>
                  <Navbar />
                  <Favorites />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/profile/language" element={
                <ProtectedRoute>
                  <Navbar />
                  <Language />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/profile/location" element={
                <ProtectedRoute>
                  <Navbar />
                  <Location />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/profile/theme" element={
                <ProtectedRoute>
                  <Navbar />
                  <Theme />
                  <MobileTabBar />
                </ProtectedRoute>
              } />
              <Route path="/profile/clear-data" element={
                <ProtectedRoute>
                  <Navbar />
                  <ClearData />
                  <MobileTabBar />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="reports" element={<ReportsAndAnalysis />} />
                <Route path="settings" element={<Configuration />} />
              </Route>
            </Routes>
          </MenuProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;