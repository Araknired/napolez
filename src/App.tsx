import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MenuProvider } from './contexts/MenuContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Product from './pages/Product';
import Arena from './pages/Arena';
import Sponsors from './pages/Sponsors';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </MenuProvider>
    </BrowserRouter>
  );
}

export default App;