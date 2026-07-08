export default function Footer() {
  return (
    <footer className="w-full py-section-padding px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-gutter bg-surface-container border-t border-outline-variant/30 justify-items-center text-center">
      <div className="col-span-1 space-y-6 mt-8 md:m-10 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <img
            alt="Dayma Logo"
            className="h-8 w-auto opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB7XiPdETy2aWevGbbwB-iCIovm_HxYeKT8PCKcrbagaqpb2Ua36cs19dYnMNZY6H2SVKHJCfHnHNr3GUy7i-a-bsz2quon9ycqmgEiuXLq_3bzXupDeseEVlzhdnbTRQwbtV4r78ROBs2DA0jgX_QR65gJ2naFBOZg8oF06QxJO1DIwvdPGOfp8BLalYAFyOjUDemPuNeMP_tKglcHTwJG1aNthrKAIgzGJ1JFR99N-AZGhk3YSa"
          />
          <span className="font-headline-lg text-headline-lg text-primary">
            Dayma
          </span>
        </div>
        <p className="font-body-md text-on-surface-variant max-w-xs">
          &copy; 2026 Dayma Moda Infantil <br /> Creado por Leyre Rodríguez.
        </p>
      </div>

      <div className="space-y-6 mt-8 md:m-10 flex flex-col items-center">
        <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest">
          Social
        </h4>
        <div className="flex gap-4">
          <a
            className="w-11 h-11 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all"
            href="https://www.facebook.com/p/Dayma-Moda-Infantil-100063076939831/?locale=es_ES"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook de Dayma Moda Infantil"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.878h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="space-y-6 mt-8 md:m-10 flex flex-col items-center">
        <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest">
          Contacto
        </h4>
        <p className="font-body-md text-on-surface-variant max-w-xs">
          ¿Alguna incidencia? Escríbenos a
        </p>
        <a
          className="font-body-md text-primary underline underline-offset-4 hover:opacity-70 transition-opacity"
          href="mailto:leyrerod@gmail.com"
        >
          leyrerod@gmail.com
        </a>
      </div>
    </footer>
  );
}
