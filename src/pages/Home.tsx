import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collectionService } from "../api/services/collectionService";
import { productService } from "../api/services/productService";
import { authService } from "../api/services/authService";
import { useAuth } from "../hooks/useAuth";
import type { Collection } from "../types/collection";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlCNBP26DCb1hI5wIURKEMZAvrgL9zyf5Ky-rMg5C0dbxxr4kyZG9Mp0Lx5pFSCuJq_q2l2bihiBS-vduE8cHZgE4Cy9Qe5pVdyeJUI7Ls8yXrf-QMwySyM4sNFUaIQQGlRv7Gq0c1abGPlLse1zZPi2N1b6goOJ1ddxHHreeNTMeGHsYEhG0l0FSyevM_qAyshJWN0iZe6sWncv3y-KjNuEYJ5sbPLf7EVQzl84eyumXGaSfucwrY";
const STUDIO_IMG =
  "https://res.cloudinary.com/dn10sqrny/image/upload/v1781715821/i264ry78pumpt2waiqd9.webp";

export default function Home() {
  return (
    <main>
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
    <section className="bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container relative min-h-screen flex items-center overflow-hidden bg-surface-container-low pt-24">
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          className="w-full h-full object-cover"
          src={HERO_IMG}
          alt="Bosque encantado al amanecer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="space-y-6 md:space-y-8">
          <div className="inline-block">
            <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary/60 border-b border-primary/20 pb-1">
              TELDE
            </span>
          </div>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-7xl text-primary leading-[1.1] font-bold">
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
          <div className="absolute -bottom-8 -left-8 w-36 sm:w-48 h-36 sm:h-48 bg-secondary-container/20 -z-10" />
          <div className="absolute -top-8 -right-8 w-24 sm:w-32 h-24 sm:h-32 bg-primary-container/10 -z-10" />
        </div>
      </div>
    </section>
  );
}

function InfoBar() {
  return (
    <section className="bg-background parchment-texture selection:bg-secondary-container selection:text-on-secondary-container bg-surface py-16 border-y border-outline-variant/30">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-4"></div>
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
        <div className="flex flex-col md:flex-row items-center gap-4"></div>
      </div>
    </section>
  );
}

function CollectionsSection() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collectionService
      .getAll()
      .then(async (all) => {
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, 3);
        setCollections(picked);

        const imgs = await Promise.all(
          picked.map(async (col) => {
            try {
              const res = await productService.getAll({
                collection: col.code,
                limit: 1,
                archived: false,
              });
              const product = res.content?.[0];
              return product?.imageUrl ?? "";
            } catch {
              return "";
            }
          }),
        );
        setImages(imgs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || collections.length < 3) return null;

  return (
    <section className="py-section-padding px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
      <div className="text-center mb-12 md:mb-20 space-y-4">
        <h2 className="font-display-lg text-3xl md:text-5xl text-primary p-6">
          Colecciones
        </h2>
        <div className="w-16 h-0.5 bg-primary/20 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {collections.slice(0, 2).map((col, i) => (
          <CollectionCard
            key={col.code}
            img={images[i]}
            title={col.name}
            desc={col.description}
            onClick={() => navigate(`/collection?collection=${col.code}`)}
          />
        ))}
        <div
          className="md:col-span-2 group relative overflow-hidden min-h-[250px] md:h-[450px] cursor-pointer mt-gutter"
          onClick={() =>
            navigate(`/collection?collection=${collections[2].code}`)
          }
        >
          <img
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            src={images[2]}
            alt={collections[2].name}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center space-y-4 p-6">
            <h3 className="font-display-lg text-3xl md:text-5xl">
              {collections[2].name}
            </h3>
            <p className="font-body-md opacity-90 max-w-md">
              {collections[2].description}
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
  onClick,
}: {
  img: string;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <div
      className="group relative overflow-hidden min-h-[350px] md:h-[600px] cursor-pointer"
      onClick={onClick}
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
      <div className="absolute bottom-12 left-6 md:left-12 text-white space-y-3">
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
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="w-full md:w-1/2 space-y-8 md:space-y-10">
            <div className="space-y-4">
              <h2 className="font-display-lg text-3xl md:text-5xl text-primary leading-tight">
                La Experiencia <br />
                <span className="italic font-normal">Dayma en Persona</span>
              </h2>
              <p className="font-body-lg text-on-surface-variant leading-relaxed">
                En Dayma nos gusta conocer a nuestros clientes en persona y
                ofrecer una experiencia única para cada cliente, por ello, todos
                los pedidos se recogen personalmente en nuestra tienda.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8">
              <div className="flex gap-6 items-start">
                <span className="material-symbols-outlined text-secondary text-2xl">
                  castle
                </span>
                <div className="gap-2 m-2">
                  <div>
                    <h4 className="font-headline-md text-primary mb-2">
                      Visítanos en Telde
                    </h4>
                    <p className="text-on-surface-variant mb-2">
                      C/ Matías Zurita, nº 11. Local 1., Telde, España
                    </p>
                  </div>
                  <div>
                    <p className="font-label-md text-primary">
                      Horario de Atención
                    </p>
                    <p className="font-body-md text-on-surface-variant">
                      L-S: 10:00 - 13:00 / S: 17:00 - 20:00
                    </p>
                  </div>
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
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const alreadySubscribed = user?.newsletter === true && !subscribed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setSubscribing(true);
    try {
      await authService.subscribe();
      setSubscribed(true);
      setEmail("");
    } catch {
      // error is already handled by httpClient interceptor if 401
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <section className="py-section-padding">
      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div
          className="bg-white p-6 sm:p-10 md:p-16 text-center space-y-8 md:space-y-10 relative overflow-hidden"
          style={{ border: "1px solid rgba(45,66,54,0.15)" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
          <div className="space-y-4">
            <h2 className="font-display-lg text-2xl md:text-4xl text-primary italic">
              &Uacute;nete a la familia
            </h2>
            <p className="font-body-lg text-on-surface-variant max-w-xl mx-auto">
              Recibe notificaciones de lanzamientos exclusivos y nuevas prendas
              directamente en tu buzón.
            </p>
          </div>
          {subscribed ? (
            <p className="font-headline-md text-primary">
              ¡Te has suscrito correctamente!
            </p>
          ) : alreadySubscribed ? (
            <p className="font-headline-md text-primary">
              Ya estás suscrito a la newsletter
            </p>
          ) : (
            <form
              className="flex flex-col md:flex-row gap-3 md:gap-0 max-w-2xl mx-auto overflow-hidden"
              style={{ border: "1px solid rgba(45,66,54,0.15)" }}
              onSubmit={handleSubmit}
            >
              <input
                className="flex-grow px-8 py-5 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline italic"
                placeholder="Tu correo electrónico..."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-primary text-on-primary px-12 py-5 font-label-md uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {subscribing ? "Suscribiendo..." : "Suscribirse"}
              </button>
            </form>
          )}
          <p className="font-caption text-caption text-outline uppercase tracking-widest">
            Respetamos tu paz. No enviamos spam.
          </p>
        </div>
      </div>
    </section>
  );
}
