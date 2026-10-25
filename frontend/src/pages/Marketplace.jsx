import { useMemo, useState } from 'react'
import MarketplaceLayout from '../components/layout/MarketplaceLayout'
import FeaturedCraftCarousel from '../components/marketplace/FeaturedCraftCarousel'
import MarketplaceProducts from '../components/marketplace/MarketplaceProducts'
import { useCart } from '../hooks/useCart'
import content from '../data/local-storage.json'

const { products, categories } = content.marketplace
const featuredProducts = products.slice(0, 3)

const Marketplace = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All crafts')
  const [sortOrder, setSortOrder] = useState('featured')
  const { addToCart, itemCount } = useCart()

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const matchesCategory =
        activeCategory === 'All crafts' || product.category === activeCategory
      const matchesSearch =
        !query ||
        [product.name, product.category, product.artisan, product.location]
          .join(' ')
          .toLowerCase()
          .includes(query)

      return matchesCategory && matchesSearch
    })

    if (sortOrder === 'price-low') {
      return filtered.sort((first, second) => first.price - second.price)
    }
    if (sortOrder === 'price-high') {
      return filtered.sort((first, second) => second.price - first.price)
    }
    return filtered
  }, [activeCategory, search, sortOrder])

  const resetFilters = () => {
    setSearch('')
    setActiveCategory('All crafts')
  }

  return (
    <MarketplaceLayout
      onSearchChange={setSearch}
      searchValue={search}
      showSearch
    >
      <main>
        {!search.trim() && (
          <FeaturedCraftCarousel
            onSelectCategory={setActiveCategory}
            products={featuredProducts}
          />
        )}
        <MarketplaceProducts
          activeCategory={activeCategory}
          bagCount={itemCount}
          categories={categories}
          onAddToBag={addToCart}
          onCategoryChange={setActiveCategory}
          onResetFilters={resetFilters}
          onSortOrderChange={setSortOrder}
          products={visibleProducts}
          sortOrder={sortOrder}
        />
      </main>
    </MarketplaceLayout>
  )
}

export default Marketplace
