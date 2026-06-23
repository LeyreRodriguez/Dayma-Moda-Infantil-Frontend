import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useFavourites } from "../../hooks/useFavourites";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const isFav = isFavourite(product.code);

  const handleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavourite(product.code);
  };

  return (
    <div
      className="group relative space-y-4 cursor-pointer"
      onClick={() => navigate(`/product/${product.code}`)}
    >
      <div className="aspect-[3/4] overflow-hidden bg-surface-container-low rounded-lg relative">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          src={product.imageUrl}
          alt={product.name}
        />
        <div className="absolute inset-0 bg-primary/5 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center md:translate-y-8 md:group-hover:translate-y-0 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
          <button className="bg-surface-bright text-primary px-6 py-3 rounded-full font-label-md text-label-md shadow-lg hover:bg-primary hover:text-on-primary transition-colors">
            Vista Rápida
          </button>
          {isAuthenticated ? (
            <button
              className="bg-surface-bright p-3 rounded-full shadow-lg text-secondary hover:text-on-secondary-container transition-colors"
              onClick={handleFavourite}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        <p className="font-label-md text-label-md text-on-surface-variant italic">
          {product.material}
        </p>
        <p className="font-body-lg text-body-lg text-tertiary font-semibold">
          {product.price.toFixed(2).replace(".", ",")} €
        </p>
      </div>
    </div>
  );
}
