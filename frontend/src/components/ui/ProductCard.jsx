import { useState } from 'react'
import { Heart, ImageOff } from 'lucide-react'

const ProductCard = ({ product }) => {
  const [saved, setSaved] = useState(false)
  const [imageUnavailable, setImageUnavailable] = useState(false)

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {imageUnavailable ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-text-muted">
            <ImageOff aria-hidden="true" className="h-8 w-8" />
            <span className="text-sm">Product image unavailable</span>
          </div>
        ) : (
          <img
            alt={product.imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageUnavailable(true)}
            src={product.image}
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-text-main shadow-card">
          Example listing
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
          {product.category}
        </p>
        <h2 className="mt-2 font-serif text-xl font-semibold text-text-main">
          {product.name}
        </h2>
        <p className="mt-2 min-h-12 text-sm leading-6 text-text-secondary">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-text-muted">Illustrative price</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-primary">
              {product.price}
            </p>
          </div>
          <button
            aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
            aria-pressed={saved}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
              saved
                ? 'border-primary bg-primary text-white hover:bg-primary-hover'
                : 'border-border-strong bg-surface text-primary hover:border-primary hover:bg-background'
            }`}
            onClick={() => setSaved((current) => !current)}
            type="button"
          >
            <Heart aria-hidden="true" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save item'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
