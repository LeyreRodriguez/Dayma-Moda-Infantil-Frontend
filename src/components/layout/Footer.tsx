export default function Footer() {
  return (
    <footer className="w-full py-section-padding px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-gutter bg-surface-container border-t border-outline-variant/30">
      <div className="col-span-1 space-y-6 mt-8 md:m-10">
        <div className="flex items-center gap-2">
          <img
            alt="Dayma Logo"
            className="h-8 w-auto opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB7XiPdETy2aWevGbbwB-iCIovm_HxYeKT8PCKcrbagaqpb2Ua36cs19dYnMNZY6H2SVKHJCfHnHNr3GUy7i-a-bsz2quon9ycqmgEiuXLq_3bzXupDeseEVlzhdnbTRQwbtV4r78ROBs2DA0jgX_QR65gJ2naFBOZg8oF06QxJO1DIwvdPGOfp8BLalYAFyOjUDemPuNeMP_tKglcHTwJG1aNthrKAIgzGJ1JFR99N-AZGhk3YSa"
          />
          <span className="font-headline-lg text-headline-lg text-primary">Dayma</span>
        </div>
        <p className="font-body-md text-on-surface-variant max-w-xs">
          &copy; 2026 Dayma Moda Infantil <br /> Creado por Leyre Rodríguez.
        </p>
      </div>

      <div className="space-y-4 mt-8 md:m-10">
        <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest">Explorar</h4>
        <ul className="space-y-2">
          <li><a className="text-on-surface-variant hover:text-primary font-body-md transition-colors" href="#">Shipping &amp; Returns</a></li>
          <li><a className="text-on-surface-variant hover:text-primary font-body-md transition-colors" href="#">Sustainability</a></li>
          <li><a className="text-on-surface-variant hover:text-primary font-body-md transition-colors" href="#">Our Story</a></li>
        </ul>
      </div>

      <div className="space-y-4 mt-8 md:m-10">
        <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest">Información</h4>
        <ul className="space-y-2">
          <li><a className="text-on-surface-variant hover:text-primary font-body-md transition-colors" href="#">Privacy Policy</a></li>
          <li><a className="text-on-surface-variant hover:text-primary font-body-md transition-colors" href="#">Contact Us</a></li>
          <li><a className="text-on-surface-variant hover:text-primary font-body-md transition-colors" href="#">Wholesale</a></li>
        </ul>
      </div>

      <div className="space-y-6 mt-8 md:m-10">
        <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest">Social</h4>
        <div className="flex gap-4">
          <a className="w-11 h-11 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
            <span className="material-symbols-outlined text-lg">share</span>
          </a>
          <a className="w-11 h-11 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" href="#">
            <span className="material-symbols-outlined text-lg">local_florist</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
