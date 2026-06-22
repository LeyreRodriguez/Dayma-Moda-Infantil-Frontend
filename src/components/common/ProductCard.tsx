import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

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
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center translate-y-8 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
          <button className="bg-surface-bright text-primary px-6 py-2 rounded-full font-label-md text-label-md shadow-lg hover:bg-primary hover:text-on-primary transition-colors">
            Vista Rápida
          </button>
          <button className="bg-surface-bright p-2 rounded-full shadow-lg text-secondary hover:text-on-secondary-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              favorite
            </span>
          </button>
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
