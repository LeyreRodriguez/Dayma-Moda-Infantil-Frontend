import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hasToken, setHasToken] = useState(
    !!localStorage.getItem("auth_token"),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    const onAuth = () => setHasToken(!!localStorage.getItem("auth_token"));
    window.addEventListener("auth-change", onAuth);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("auth-change", onAuth);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop transition-all duration-500 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 ${
        scrolled ? "py-2 shadow-sm bg-surface/95" : "py-4"
      }`}
    >
      <div className="flex items-center gap-6 ml-10">
        <Link to="/" className="flex items-center gap-2">
          <img
            alt="Dayma Logo"
            className="h-10 w-auto"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB7XiPdETy2aWevGbbwB-iCIovm_HxYeKT8PCKcrbagaqpb2Ua36cs19dYnMNZY6H2SVKHJCfHnHNr3GUy7i-a-bsz2quon9ycqmgEiuXLq_3bzXupDeseEVlzhdnbTRQwbtV4r78ROBs2DA0jgX_QR65gJ2naFBOZg8oF06QxJO1DIwvdPGOfp8BLalYAFyOjUDemPuNeMP_tKglcHTwJG1aNthrKAIgzGJ1JFR99N-AZGhk3YSa"
          />
          <span className="font-display-lg text-headline-lg text-primary italic">
            Dayma
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-12">
        <Link
          to="/"
          className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
        >
          Home
        </Link>
        <Link
          to="/collection"
          className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
        >
          Colecciones
        </Link>
      </nav>

      <div className="flex items-center gap-5 mr-10">
        {hasToken ? (
          <Link
            to="/account"
            className="flex items-center gap-1 text-primary border-b-2 border-tertiary font-bold pb-1"
          >
            <span className="material-symbols-outlined">account_circle</span>
            <span className="font-label-md text-label-md ml-1 hidden sm:inline">
              Cuenta
            </span>
          </Link>
        ) : (
          <Link
            to="/auth"
            className="material-symbols-outlined text-primary hover:opacity-70 transition-opacity"
          >
            person
          </Link>
        )}
        <button className="material-symbols-outlined text-primary hover:opacity-70 transition-opacity">
          shopping_bag
        </button>
      </div>
    </header>
  );
}
