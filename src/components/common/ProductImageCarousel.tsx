import { useState } from "react";
import { getImageUrl } from "../../api/httpClient";

interface Props {
  images: string[];
  name: string;
}

export default function ProductImageCarousel({ images, name }: Props) {
  const [current, setCurrent] = useState(0);

  console.log(images);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/5] bg-surface-container-highest rounded-xl flex items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-outline">
          image
        </span>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-4">
      <div className="relative group overflow-hidden rounded-xl bg-surface-container">
        <img
          className="w-full aspect-[4/5] object-cover transition-opacity duration-300"
          src={getImageUrl(images[current])}
          alt={`${name} - imagen ${current + 1}`}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface/80 backdrop-blur-sm text-on-surface flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-surface shadow-lg"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface/80 backdrop-blur-sm text-on-surface flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-surface shadow-lg"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="flex items-center justify-center p-2 min-w-[44px] min-h-[44px]"
                >
                  <span
                    className={`rounded-full transition-all ${
                      i === current
                        ? "w-8 h-2 bg-primary"
                        : "w-2 h-2 bg-on-surface/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <img
                className="w-full h-full object-cover"
                src={getImageUrl(img)}
                alt={`${name} miniatura ${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
