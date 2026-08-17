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
import CommandePage from "./pages/CommandePage.jsx";
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';
import AdminReviewsPage from './pages/AdminReviewsPage.jsx';
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
            <Route path="/commande" element={<CommandePage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/admin" element={<AdminRoute> <AdminDashboardPage /> </AdminRoute> } />
            <Route path="/admin/produits" element={<AdminRoute> <AdminProductsPage /> </AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute> <AdminCategoriesPage /> </AdminRoute>} />
            <Route path="/admin/commandes" element={<AdminRoute> <AdminOrdersPage /> </AdminRoute>} />
            <Route path="/admin/avis" element={<AdminRoute> <AdminReviewsPage /> </AdminRoute>} />

        </Routes>
      </BrowserRouter>
  )
}

export default App