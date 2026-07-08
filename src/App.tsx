import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ConfigProvider, App as AntApp } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { FavouritesProvider } from "./contexts/FavouritesContext";
import AppLayout from "./components/layout/AppLayout";
import CartDrawer from "./components/common/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Account from "./pages/Account";
import RegistrationScreen from "./pages/RegistrationScreen";
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import Orders from "./pages/admin/Orders";
import Collections from "./pages/admin/Collections";
import InStorePurchase from "./pages/admin/InStorePurchase";
import AdminRoute from "./components/common/AdminRoute";

const theme = {
  token: {
    colorPrimary: "#2d4236",
    borderRadius: 8,
  },
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <div className="parchment-texture">
          <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
              <FavouritesProvider>
                <CartProvider>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/auth" element={<RegistrationScreen />} />
                      <Route path="/collection" element={<Shop />} />
                      <Route path="/product/:code" element={<ProductDetail />} />
                      <Route path="/account" element={<Account />} />
                    </Route>
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="inventory" element={<Inventory />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="collections" element={<Collections />} />
                      <Route path="in-store" element={<InStorePurchase />} />
                      <Route path="analytics" element={<div className="text-on-surface-variant text-center py-20">Próximamente</div>} />
                      <Route path="settings" element={<div className="text-on-surface-variant text-center py-20">Próximamente</div>} />
                      <Route path="support" element={<div className="text-on-surface-variant text-center py-20">Próximamente</div>} />
                    </Route>
                  </Routes>
                  <CartDrawer />
                </CartProvider>
              </FavouritesProvider>
            </AuthProvider>
          </BrowserRouter>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}
