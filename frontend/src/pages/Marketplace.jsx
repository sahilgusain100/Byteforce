import React from 'react'
import ProductCard from '../components/ui/ProductCard'
import Navbar from '../components/layout/Navbar'

const exampleProducts = [
  {
    name: 'Phulkari Embroidered Dupatta',
    category: 'Embroidery · Textile',
    description: 'A bright, hand-embroidered textile inspired by Phulkari work.',
    price: '₹2,400',
    image:
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Colorful patterned textile fabric',
  },
  {
    name: 'Handwoven Everyday Tote',
    category: 'Handcrafted · Accessories',
    description: 'A practical carryall with a woven texture and natural feel.',
    price: '₹1,200',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Handbag displayed against a simple background',
  },
  {
    name: 'Naturally Dyed Fabric',
    category: 'Natural dyes · Textile',
    description: 'Softly colored cloth showing the character of natural dye.',
    price: '₹850',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85',
    imageAlt: 'Folded clothing and fabric in warm colors',
  },
]

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="marketplace" />
      <div
        aria-hidden="true"
        className="section-divider h-12 bg-primary"
        style={{ '--hero-background': 'none' }}
      />
      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold text-secondary">
            A marketplace in the making
          </p>
          <h1 className="font-serif text-3xl font-semibold leading-tight text-text-main sm:text-4xl">
            Handmade work, with a story in every detail.
          </h1>
          <p className="mt-4 leading-7 text-text-secondary">
            These example listings show how artisan-made products could be
            presented. Names, images, and prices are illustrative, not live
            offers.
          </p>
        </header>
        <section
          aria-label="Example handmade products"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          id="products"
        >
          {exampleProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </section>
      </main>
    </div>
  )
}

export default Marketplace