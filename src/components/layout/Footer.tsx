export default function Footer() {
  return (
    <footer className="w-full bg-surface-container border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                alt="Dayma Logo"
                className="h-6 w-auto opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB7XiPdETy2aWevGbbwB-iCIovm_HxYeKT8PCKcrbagaqpb2Ua36cs19dYnMNZY6H2SVKHJCfHnHNr3GUy7i-a-bsz2quon9ycqmgEiuXLq_3bzXupDeseEVlzhdnbTRQwbtV4r78ROBs2DA0jgX_QR65gJ2naFBOZg8oF06QxJO1DIwvdPGOfp8BLalYAFyOjUDemPuNeMP_tKglcHTwJG1aNthrKAIgzGJ1JFR99N-AZGhk3YSa"
              />
              <span className="font-headline-md text-headline-md text-primary">
                Dayma
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant text-sm">
              &copy; 2026 Dayma Moda Infantil
              <br />
              Creado por Leyre Rodríguez.
            </p>
          </div>

          <div>
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-3">
              Social
            </h4>
            <div className="flex flex-col gap-2">
              <a
                className="flex items-center gap-2 text-outline hover:text-primary transition-colors"
                href="https://www.facebook.com/p/Dayma-Moda-Infantil-100063076939831/?locale=es_ES"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Dayma Moda Infantil"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M16 8.5h-2.5A2.5 2.5 0 0 0 11 11v9" />
                  <path d="M8 14h6" />
                </svg>
                <span className="font-body-md text-sm">Facebook</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest mb-3">
              Contacto
            </h4>
            <p className="font-body-md text-on-surface-variant text-sm mb-2">
              928 68 16 30
            </p>
            <p className="font-body-md text-on-surface-variant text-sm mb-2">
              ¿Alguna incidencia? Escríbenos a
            </p>
            <a
              className="font-body-md text-primary underline underline-offset-4 hover:opacity-70 transition-opacity text-sm"
              href="mailto:leyrerod@gmail.com"
            >
              leyrerod@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-outline-variant/20 text-center">
          <p className="font-caption text-caption text-outline text-xs tracking-widest">
            Dayma Moda Infantil &middot; Telde, España
          </p>
        </div>
      </div>
    </footer>
  );
}
