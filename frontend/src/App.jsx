import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from "./pages/HomePage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import BoutiquePage from "./pages/BoutiquePage.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage/>}/>
            <Route path="/cart" element={<CartPage/>}/>
            <Route path="/orders" element={<OrderHistoryPage/>}/>
            <Route path="/boutique" element={<BoutiquePage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App