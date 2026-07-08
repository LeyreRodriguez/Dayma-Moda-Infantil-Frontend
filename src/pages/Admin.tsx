import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Modal } from "antd";
import Header from "../components/layout/Header";

const navItems = [
  { icon: "dashboard", label: "Dashboard", path: "/admin" },
  { icon: "inventory_2", label: "Inventario", path: "/admin/inventory" },
  {
    icon: "collections_bookmark",
    label: "Colecciones",
    path: "/admin/collections",
  },
  { icon: "shopping_basket", label: "Pedidos", path: "/admin/orders" },
  { icon: "storefront", label: "Venta en tienda", path: "/admin/in-store" },
];

const bottomNavItems = [
  { icon: "help", label: "Soporte", path: "/admin/support" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const NavContent = () => (
    <>
      <div className="flex flex-col items-center mb-6 px-2">
        <img
          alt="Dayma Logo"
          className="w-20 h-20 md:w-32 md:h-32 object-contain mb-2"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB7XiPdETy2aWevGbbwB-iCIovm_HxYeKT8PCKcrbagaqpb2Ua36cs19dYnMNZY6H2SVKHJCfHnHNr3GUy7i-a-bsz2quon9ycqmgEiuXLq_3bzXupDeseEVlzhdnbTRQwbtV4r78ROBs2DA0jgX_QR65gJ2naFBOZg8oF06QxJO1DIwvdPGOfp8BLalYAFyOjUDemPuNeMP_tKglcHTwJG1aNthrKAIgzGJ1JFR99N-AZGhk3YSa"
        />
        <h1 className="font-headline-md text-primary tracking-tight">
          Dayma Admin
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl transition-all active:scale-[0.98] ${
              isActive(item.path)
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-md">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-outline-variant/30">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                if (item.path === "/admin/support") {
                  setSupportOpen(true);
                } else {
                  navigate(item.path);
                }
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-4 rounded-xl transition-colors ${
                isActive(item.path)
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen flex flex-col bg-background text-on-background">
      <Header fixed={false} />
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 fixed md:static z-40 inset-y-0 left-0 w-72 bg-surface-container-low p-4 flex flex-col gap-4 shadow-sm overflow-y-auto shrink-0`}
        >
          <NavContent />
        </aside>

        <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-y-auto hide-scrollbar min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden flex items-center gap-2 text-primary mb-4 font-label-md"
          >
            <span className="material-symbols-outlined">menu</span>
            Menú
          </button>
          <Outlet />
        </main>
      </div>

      <Modal
        open={supportOpen}
        onCancel={() => setSupportOpen(false)}
        footer={null}
        centered
        width={400}
        title={
          <span className="font-headline-md text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">help</span>
            Soporte
          </span>
        }
      >
        <div className="py-4 text-center space-y-4">
          <p className="font-body-md text-on-surface-variant">
            Si tienes cualquier problema o duda, escríbenos a:
          </p>
          <a
            href="mailto:leyrerod@gmail.com"
            className="font-headline-md text-primary hover:text-secondary transition-colors block"
          >
            leyrerod@gmail.com
          </a>
        </div>
      </Modal>
    </div>
  );
}
