import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
