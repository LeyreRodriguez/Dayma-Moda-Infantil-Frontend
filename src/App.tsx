import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Account from "./pages/Account";
import RegistrationScreen from "./pages/RegistrationScreen";

const theme = {
  token: {
    colorPrimary: "#2d4236",
    borderRadius: 8,
  },
};

export default function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<RegistrationScreen />} />
                <Route path="/collection" element={<Shop />} />
                <Route path="/product/:code" element={<ProductDetail />} />
                <Route path="/account" element={<Account />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
