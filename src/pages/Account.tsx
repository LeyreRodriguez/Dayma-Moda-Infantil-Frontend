import { useAuth } from "../hooks/useAuth";

export default function Account() {
  const { user, logout } = useAuth();
  const userName = user?.name ?? user?.email ?? "Usuario";

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface pt-32">
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <section className="mb-16">
          <h1 className="font-display-lg text-display-lg text-primary mb-2">
            Bienvenida de nuevo, {userName}
          </h1>
          <p className="font-body-lg text-on-surface-variant italic">
            Tu refugio personal de tesoros artesanales y esencia botánica.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            <nav className="flex flex-wrap gap-4">
              <a className="flex items-center gap-3 bg-surface-container-low px-6 py-4 rounded-xl hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined text-primary">person</span>
                <span className="font-label-md text-label-md text-primary">Personal Data</span>
              </a>
              <a className="flex items-center gap-3 bg-surface-container-low px-6 py-4 rounded-xl hover:bg-surface-container-high transition-colors" href="#favorites">
                <span className="material-symbols-outlined text-primary">favorite</span>
                <span className="font-label-md text-label-md text-primary">Mis Favoritos</span>
              </a>
              <button
                onClick={logout}
                className="flex items-center gap-3 bg-surface-container-low px-6 py-4 rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-primary">logout</span>
                <span className="font-label-md text-label-md text-primary">Cerrar sesión</span>
              </button>
            </nav>

            <section>
              <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
                <h2 className="font-headline-lg text-headline-lg text-primary">Recent Orders</h2>
                <a className="font-label-md text-label-md text-secondary uppercase tracking-widest hover:underline" href="#">
                  Ver todo el historial
                </a>
              </div>
              <div className="space-y-6">
                <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface-variant">Pedido #DM-2940</span>
                    <span className="font-body-md text-body-md">12 de Octubre, 2024</span>
                  </div>
                  <div className="flex flex-col gap-1 text-center md:text-left">
                    <span className="font-headline-md text-headline-md text-primary">124.50€</span>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-label-md text-label-md text-primary">En preparación</span>
                    </div>
                  </div>
                  <button className="px-8 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity">
                    View Details
                  </button>
                </div>
                <div className="bg-surface-container-lowest p-8 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 opacity-80">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface-variant">Pedido #DM-2811</span>
                    <span className="font-body-md text-body-md">05 de Septiembre, 2024</span>
                  </div>
                  <div className="flex flex-col gap-1 text-center md:text-left">
                    <span className="font-headline-md text-headline-md text-primary">89.00€</span>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="w-2 h-2 rounded-full bg-outline" />
                      <span className="font-label-md text-label-md text-on-surface-variant">Entregado</span>
                    </div>
                  </div>
                  <button className="px-8 py-3 border border-primary text-primary font-label-md text-label-md rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </section>

            <section id="favorites">
              <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
                <h2 className="font-headline-lg text-headline-lg text-primary">Mis Favoritos</h2>
                <a className="font-label-md text-label-md text-secondary uppercase tracking-widest hover:underline" href="#">
                  Ver todos
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl flex gap-4 group cursor-pointer">
                  <div className="w-24 h-24 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB092Bucs9QKUxnLnRluz-kKGlNauCIfb3xj21dJvLY0v00dH9Hu3120Owub1CvY3TMWZZZIBJcK5VKMMW9YcoymHBrV-0lc9fJizR_AMUx5FhnuB92JAlUe5z7C1GUiHXXAWDwQhAZYCfGtfKrYexSgac8vPQEwjCoN-YMaJpiMVTaq3XBthrk1cWobRqGBdwkdsmCozcTcr2i639VbQRwoQlebNyX7lIcmTubcpg-t1Q6jdNInzHZKa-zG9nF6nIkJWNRJse6xv0"
                      alt="Vela"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-primary">Bruma de Lavanda Silvestre</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">Esencia Botánica</span>
                    <span className="font-label-md text-label-md text-secondary mt-1">28.00€</span>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl flex gap-4 group cursor-pointer">
                  <div className="w-24 h-24 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF-vBpRH6wUYu3CIuYfgEWUi-Hd6D_q8cITMRhmx9L3rYW9vmE1MP7XkfkctxXW63UJ0IU_Y3DKoA33T9XEYLN-alVoicTX8fEE6kdclhOrABYAN-_9SOI7ZTcE0K3nl5GI1t5kt_luR_dZRXXLiLB5F74QpmeYN6_MCHq6vknTml5Xhu-1s1CsYbfRxj0UNiY2-PtfQXh74lsF6i0z0GKdl088irNVdmjbGTWsSDAZM7ptFAR78zqbuCaxWNUJbSNiRUp2NhMa2w"
                      alt="Jabón"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-primary">Jabón de Avena y Miel</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">Cuidado Artesanal</span>
                    <span className="font-label-md text-label-md text-secondary mt-1">12.50€</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-surface-container-high/40 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="font-headline-md text-headline-md text-primary mb-8 flex items-center gap-3">
                Shopping Cart
                <span className="bg-secondary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">2</span>
              </h3>
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB092Bucs9QKUxnLnRluz-kKGlNauCIfb3xj21dJvLY0v00dH9Hu3120Owub1CvY3TMWZZZIBJcK5VKMMW9YcoymHBrV-0lc9fJizR_AMUx5FhnuB92JAlUe5z7C1GUiHXXAWDwQhAZYCfGtfKrYexSgac8vPQEwjCoN-YMaJpiMVTaq3XBthrk1cWobRqGBdwkdsmCozcTcr2i639VbQRwoQlebNyX7lIcmTubcpg-t1Q6jdNInzHZKa-zG9nF6nIkJWNRJse6xv0"
                      alt="Vela"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-primary">Esencia de Enebro y Roble</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">Vela Orgánica</span>
                    <span className="font-label-md text-label-md text-secondary mt-1">34.50€</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF-vBpRH6wUYu3CIuYfgEWUi-Hd6D_q8cITMRhmx9L3rYW9vmE1MP7XkfkctxXW63UJ0IU_Y3DKoA33T9XEYLN-alVoicTX8fEE6kdclhOrABYAN-_9SOI7ZTcE0K3nl5GI1t5kt_luR_dZRXXLiLB5F74QpmeYN6_MCHq6vknTml5Xhu-1s1CsYbfRxj0UNiY2-PtfQXh74lsF6i0z0GKdl088irNVdmjbGTWsSDAZM7ptFAR78zqbuCaxWNUJbSNiRUp2NhMa2w"
                      alt="Bufanda"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-label-md text-label-md text-primary">Bufanda de Lino Artesano</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">Rosa Empolvado</span>
                    <span className="font-label-md text-label-md text-secondary mt-1">90.00€</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-outline-variant pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md">Subtotal</span>
                  <span className="font-headline-md text-headline-md text-primary">124.50€</span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant italic">Envío calculado en el siguiente paso.</p>
                <button className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:shadow-lg transition-all active:scale-95">
                  Finalizar Compra
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
