import { useNavigate } from "react-router-dom";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlCNBP26DCb1hI5wIURKEMZAvrgL9zyf5Ky-rMg5C0dbxxr4kyZG9Mp0Lx5pFSCuJq_q2l2bihiBS-vduE8cHZgE4Cy9Qe5pVdyeJUI7Ls8yXrf-QMwySyM4sNFUaIQQGlRv7Gq0c1abGPlLse1zZPi2N1b6goOJ1ddxHHreeNTMeGHsYEhG0l0FSyevM_qAyshJWN0iZe6sWncv3y-KjNuEYJ5sbPLf7EVQzl84eyumXGaSfucwrY";
const STUDIO_IMG =
  "https://res.cloudinary.com/dn10sqrny/image/upload/v1781715821/i264ry78pumpt2waiqd9.webp";
const HADAS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAknZjgyoHO3iep2bqE9D6iAzFqSOz9kcAvL_XxZZuKdZdWrsGe_cniRMIqisVHnPSEq5dfXUKNYdaWgxmtl_AJJI4CJu0AiaNcoRSD7mq1JR0HJHqqeTfLgIJXXrAZAwfxYoK3WRDKYn_nIDnXHDuf_TCRqVg7k5dElSHG5WsFuNNgefMjuc3ZClXgUWtBqTCf7TeZwW_h7I4Q2_bGcep-cyZQKE3sLneU2GqQbGQmeHYyDtQWQILK";
const DUENDES_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWTERy5nLfrK6X0xf2Nkisg5pwwHv0B_vpBat1Rv5Ir_CHj5Ch9SEtqWEF_Kht5baGIpcRuX3V6V9oEqPPdvGt__xdL9ah_q2kHeFKal90esFofzBSvuB-DF2tzXt2Bnh1TElsxiUfsXRNFADI1-6MZJQ6AU7RZrfvRIXSh-qnJ03iQNm7g_-nPPGkoLo1sGP7NvQoOHw87WcvQQOu59bMSqdvIjIkKU8bVtkGWQwgxEUe7TUMOfgb";
const ACC_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWi8qL6Eavj5HUrkQlbXweTl2GYBZ78ocEoagMMRZEBVpwEiG-PvS9HCS0HhGcT05jYPbSEezs5bb6k9kMS3C3x6t4l8EL_XrLr7HB2rVGYeeifzcks8kNIizS1v1L_mrYstSlAQPmX5h13zeTU0kQfib3LvHkrR0H8NqNH2C7Fc-IMFRpWimhF9cD9K9L1QzRuxMbQMTUxyXy4epJieBh_QsxxT44S2gs4QLMrEDGhJADvUSNd03T";

export default function Home() {
  return (
    <main className="pt-24">
      <HeroSection />
      <InfoBar />
      <CollectionsSection />
      <PickupSection />
      <NewsletterSection />
    </main>
  );
}

function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className=" bg-background text-on-background parchment-texture min-h-screen selection:bg-secondary-container selection:text-on-secondary-container relative min-h-[90vh] flex items-center overflow-hidden bg-surface-container-low">
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          className="w-full h-full object-cover"
          src={HERO_IMG}
          alt="Bosque encantado al amanecer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-margin-desktop relative z-10 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-block">
            <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary/60 border-b border-primary/20 pb-1">
              TELDE
            </span>
          </div>
          <h1 className="font-display-lg text-6xl md:text-7xl text-primary leading-[1.1] font-bold">
            Moda y complementos <br />{" "}
            <span className="italic font-normal text-secondary/80">
              para los mas peques
            </span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
            Especialistas en moda de bautizo, arras y comunión.
          </p>
          <div className="flex flex-wrap gap-6 pt-4">
            <button
              className="bg-primary text-on-primary px-10 py-4 font-label-md text-label-md hover:bg-primary/90 transition-all"
              style={{ boxShadow: "0 4px 20px -4px rgba(45,66,54,0.08)" }}
              onClick={() => navigate("/collection")}
            >
              Explorar Colecciones
            </button>
            <button className="border border-primary/30 text-primary px-10 py-4 font-label-md text-label-md hover:bg-primary/5 transition-all">
              Nuestra Historia
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            className="relative z-10 p-4 bg-white/30 backdrop-blur-sm"
            style={{ border: "1px solid rgba(45,66,54,0.15)" }}
          >
            <img
              className="w-full aspect-[4/5] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              src={STUDIO_IMG}
              alt="Retrato infantil en lino"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-secondary-container/20 -z-10" />
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-container/10 -z-10" />
        </div>
      </div>
    </section>
  );
}

function InfoBar() {
  return (
    <section className="bg-background parchment-texture  selection:bg-secondary-container selection:text-on-secondary-container bg-surface py-16 border-y border-outline-variant/30">
      <div className="container mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="material-symbols-outlined text-3xl text-primary font-light">
            shutter_speed
          </span>
          <div>
            <p className="font-headline-md text-headline-md text-primary mb-1">
              Hecho a Mano
            </p>
            <p className="font-body-md text-on-surface-variant">
              Confeccionado con amor y algodón orgánico certificado.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="material-symbols-outlined text-3xl text-primary font-light">
            location_on
          </span>
          <div>
            <p className="font-headline-md text-headline-md text-primary mb-1">
              Recogida en Tienda
            </p>
            <p className="font-body-md text-on-surface-variant">
              Punto exclusivo de entrega en nuestro refugio de Telde.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span className="material-symbols-outlined text-3xl text-primary font-light">
            eco
          </span>
          <div>
            <p className="font-headline-md text-headline-md text-primary mb-1">
              Moda Consciente
            </p>
            <p className="font-body-md text-on-surface-variant">
              Producción ética y materiales sostenibles para el futuro.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionsSection() {
  return (
    <section className="py-section-padding px-margin-desktop max-w-7xl mx-auto">
      <div className="text-center mb-20 space-y-4">
        <h2 className="font-display-lg text-5xl text-primary p-6">
          Colecciones
        </h2>
        <div className="w-16 h-0.5 bg-primary/20 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <CollectionCard
          img={HADAS_IMG}
          title="Verano"
          desc="Vestidos vaporosos y capas mágicas para soñar despierta."
        />
        <CollectionCard
          img={DUENDES_IMG}
          title="Invierno"
          desc="Conjuntos cómodos y resistentes para grandes aventuras."
        />
        <div className="md:col-span-2 group relative overflow-hidden h-[450px] cursor-pointer mt-gutter">
          <img
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            src={ACC_IMG}
            alt="Accesorios artesanales"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center space-y-4">
            <h3 className="font-display-lg text-5xl">Comunión</h3>
            <p className="font-body-md opacity-90 max-w-md">
              Coronas de flores secas, varitas de madera y tesoros únicos.
            </p>
            <button className="mt-6 border-b border-white pb-1 font-label-md uppercase tracking-widest hover:opacity-70 transition-opacity">
              Explorar Tesoros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionCard({
  img,
  title,
  desc,
}: {
  img: string;
  title: string;
  desc: string;
}) {
  const navigate = useNavigate();
  return (
    <div
      className="group relative overflow-hidden h-[600px] cursor-pointer"
      onClick={() => navigate("/collection")}
    >
      <img
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        src={img}
        alt={title}
      />
      <div
        className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity"
        style={{
          background:
            "linear-gradient(to top, rgba(45,66,54,0.8), transparent)",
        }}
      />
      <div className="absolute bottom-12 left-12 text-white space-y-3">
        <h3 className="font-display-lg text-4xl">{title}</h3>
        <p className="font-body-md opacity-90 max-w-xs">{desc}</p>
        <div className="pt-4 overflow-hidden">
          <span className="font-label-md flex items-center gap-2 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            VER COLECCIÓN{" "}
            <span className="material-symbols-outlined">north_east</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function PickupSection() {
  return (
    <section className="py-section-padding bg-surface-container overflow-hidden">
      <div className="container mx-auto px-margin-desktop">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="w-full md:w-1/2 space-y-10">
            <div className="space-y-4">
              <h2 className="font-display-lg text-5xl text-primary leading-tight">
                La Experiencia <br />
                <span className="italic font-normal">Dayma en Persona</span>
              </h2>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                Para mantener la exclusividad de nuestras piezas y ofrecer una
                experiencia verdaderamente mágica, todos los pedidos se recogen
                personalmente en nuestra tienda.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="flex gap-6 items-start">
                <span className="material-symbols-outlined text-secondary text-2xl">
                  castle
                </span>
                <div>
                  <h4 className="font-headline-md text-primary mb-2">
                    Visítanos en Telde
                  </h4>
                  <p className="text-on-surface-variant">
                    C/ Matías Zurita, nº 11. Local 1., Telde, España
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div
              className="aspect-square overflow-hidden p-2"
              style={{ border: "1px solid rgba(45,66,54,0.15)" }}
            >
              <iframe
                src="https://maps.google.com/maps?q=Dayma+Moda+Infantil&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Dayma"
                className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-tertiary-fixed/30 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="py-section-padding">
      <div className="max-w-5xl mx-auto px-margin-desktop">
        <div
          className="bg-white p-16 text-center space-y-10 relative overflow-hidden"
          style={{ border: "1px solid rgba(45,66,54,0.15)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
          <div className="space-y-4">
            <h2 className="font-display-lg text-4xl text-primary italic">
              &Uacute;nete a la familia
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
              Recibe notificaciones de lanzamientos exclusivos y nuevas prendas
              directamente en tu buzón.
            </p>
          </div>
          <form
            className="flex flex-col md:flex-row gap-0 max-w-2xl mx-auto overflow-hidden"
            style={{ border: "1px solid rgba(45,66,54,0.15)" }}
          >
            <input
              className="flex-grow px-8 py-5 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline italic"
              placeholder="Tu correo electrónico..."
              type="email"
            />
            <button className="bg-primary text-on-primary px-12 py-5 font-label-md uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Suscribirse
            </button>
          </form>
          <p className="font-caption text-caption text-outline uppercase tracking-widest">
            Respetamos tu paz. No enviamos spam.
          </p>
        </div>
      </div>
    </section>
  );
}
