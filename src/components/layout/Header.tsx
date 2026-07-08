import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  fixed?: boolean;
}

export default function Header({ fixed = true }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCart, itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hasToken, setHasToken] = useState(
    !!localStorage.getItem("auth_token"),
  );
  const auth = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(72);

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onResize = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    const onAuth = () => setHasToken(!!localStorage.getItem("auth_token"));
    window.addEventListener("auth-change", onAuth);
    onResize();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("auth-change", onAuth);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${fixed ? "fixed top-0 left-0" : ""} w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop transition-all duration-500 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 ${
        scrolled ? "py-2 shadow-sm bg-surface/95" : "py-4"
      }`}
    >
      <div className="flex items-center gap-6 ml-4 md:ml-10">
        <button
          onClick={() => {
            navigate("/");
            closeMenu();
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            alt="Dayma Logo"
            className="h-8 w-auto md:h-10"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB7XiPdETy2aWevGbbwB-iCIovm_HxYeKT8PCKcrbagaqpb2Ua36cs19dYnMNZY6H2SVKHJCfHnHNr3GUy7i-a-bsz2quon9ycqmgEiuXLq_3bzXupDeseEVlzhdnbTRQwbtV4r78ROBs2DA0jgX_QR65gJ2naFBOZg8oF06QxJO1DIwvdPGOfp8BLalYAFyOjUDemPuNeMP_tKglcHTwJG1aNthrKAIgzGJ1JFR99N-AZGhk3YSa"
          />
          <span className="font-display-lg text-headline-md md:text-headline-lg text-primary italic">
            Dayma
          </span>
        </button>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-12">
        <button
          onClick={() => navigate("/")}
          className={`font-label-md text-label-md cursor-pointer transition-colors ${
            isActive("/")
              ? "text-primary font-bold border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Inicio
        </button>
        <button
          onClick={() => navigate("/collection")}
          className={`font-label-md text-label-md cursor-pointer transition-colors ${
            isActive("/collection")
              ? "text-primary font-bold border-b-2 border-primary"
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          Colecciones
        </button>
        {auth.user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin")}
            className={`font-label-md text-label-md cursor-pointer transition-colors ${
              isActive("/admin")
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Admin
          </button>
        )}
      </nav>

      <div className="flex items-center gap-3 md:gap-5 mr-4 md:mr-10">
        {hasToken ? (
          <button
            onClick={() => {
              navigate("/account");
              closeMenu();
            }}
            className="flex items-center gap-1 text-primary border-b-2 border-tertiary font-bold pb-1 cursor-pointer"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="font-label-md text-label-md ml-1 hidden sm:inline">
              Cuenta
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              navigate("/auth");
              closeMenu();
            }}
            className="material-symbols-outlined text-primary hover:opacity-70 transition-opacity cursor-pointer"
          >
            person
          </button>
        )}
        <button
          onClick={openCart}
          className="relative material-symbols-outlined text-primary hover:opacity-70 transition-opacity cursor-pointer"
        >
          shopping_bag
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {itemCount}
            </span>
          )}
        </button>
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex md:hidden material-symbols-outlined text-primary"
        >
          {menuOpen ? "close" : "menu"}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-xl flex flex-col items-center gap-8 py-12 md:hidden"
          style={{ top: headerHeight }}
        >
          <button
            onClick={() => {
              navigate("/");
              closeMenu();
            }}
            className={`font-headline-md text-headline-md cursor-pointer py-3 ${
              isActive("/")
                ? "text-primary font-bold"
                : "text-on-surface-variant"
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => {
              navigate("/collection");
              closeMenu();
            }}
            className={`font-headline-md text-headline-md cursor-pointer py-3 ${
              isActive("/collection")
                ? "text-primary font-bold"
                : "text-on-surface-variant"
            }`}
          >
            Colecciones
          </button>
          {hasToken ? (
            <button
              onClick={() => {
                navigate("/account");
                closeMenu();
              }}
              className="font-headline-md text-headline-md text-primary cursor-pointer py-3"
            >
              Cuenta
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/auth");
                closeMenu();
              }}
              className="font-headline-md text-headline-md text-primary cursor-pointer py-3"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}
