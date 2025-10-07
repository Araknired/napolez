import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MenuProvider } from './context/MenuContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Product from './pages/Product';
import Arena from './pages/Arena';
import Sponsors from './pages/Sponsors';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Code from './pages/Code';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Favorites from './pages/Favorites';
import Language from './pages/Language';
import Location from './pages/Location';
import Theme from './pages/Theme';
import ClearData from './pages/ClearData';
import Store from './components/store/store';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <MenuProvider>
            <div className="min-h-screen">
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/code" element={<Code />} />

                {/* Protected routes */}
                <Route
                  path="/store"
                  element={
                    <ProtectedRoute>
                      <Store />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/arena"
                  element={
                    <ProtectedRoute>
                      <Arena />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product"
                  element={
                    <ProtectedRoute>
                      <Product />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sponsors"
                  element={
                    <ProtectedRoute>
                      <Sponsors />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/edit"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/language"
                  element={
                    <ProtectedRoute>
                      <Language />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/location"
                  element={
                    <ProtectedRoute>
                      <Location />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/theme"
                  element={
                    <ProtectedRoute>
                      <Theme />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/clear-data"
                  element={
                    <ProtectedRoute>
                      <ClearData />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </MenuProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;