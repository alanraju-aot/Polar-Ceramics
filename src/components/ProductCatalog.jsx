import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import { CATEGORIES, ROOM_PRESETS } from '../data/products';

export default function ProductCatalog({
  products,
  activeCategory,
  onSelectCategory,
  onTryInRoom,
  onEstimateCost,
  onAddToQuote,
  quotedProductIds = [],
  onViewDetails
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('all-rooms');
  const [selectedFinish, setSelectedFinish] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceLimit, setPriceLimit] = useState(50000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available Finishes
  const finishes = useMemo(() => {
    const list = new Set();
    products.forEach((p) => {
      if (p.finish) {
        if (p.finish.toLowerCase().includes('polish')) list.add('Polished');
        else if (p.finish.toLowerCase().includes('matte')) list.add('Matte / Anti-Slip');
        else if (p.finish.toLowerCase().includes('gloss')) list.add('Glossy');
        else if (p.finish.toLowerCase().includes('satin')) list.add('Satin');
        else list.add('Special Finish');
      }
    });
    return ['all', ...Array.from(list)];
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Filter
        if (activeCategory !== 'all' && product.category !== activeCategory) {
          return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchSku = product.sku.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchOrigin = product.origin?.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchDesc && !matchOrigin) return false;
        }

        // Room Preset Filter
        if (selectedRoom !== 'all-rooms') {
          if (!product.recommendedRooms || !product.recommendedRooms.includes(selectedRoom)) {
            return false;
          }
        }

        // Finish Filter
        if (selectedFinish !== 'all') {
          if (!product.finish.toLowerCase().includes(selectedFinish.toLowerCase().split(' ')[0])) {
            return false;
          }
        }

        // Price Filter
        if (product.price > priceLimit) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, activeCategory, searchQuery, selectedRoom, selectedFinish, sortBy, priceLimit]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRoom('all-rooms');
    setSelectedFinish('all');
    setPriceLimit(50000);
    setSortBy('featured');
  };

  return (
    <section className="catalog-section" id="catalog">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="badge-gold" style={{ marginBottom: 12 }}>
            Master Collection
          </span>
          <h2 className="section-title">
            Explore Surfaces & <span className="text-gold-gradient">Designer Sanity</span>
          </h2>
          <p className="section-subtitle">
            Every product is precision-calibrated for our 3D Room Visualizer. Pick any design and click &quot;Try in Room&quot; to preview instantly on floors and walls.
          </p>
        </div>

        {/* Category Pills Navigation */}
        <div className="category-filter-nav">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              id={`cat-pill-${cat.id}`}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  opacity: 0.7,
                  background: 'rgba(0,0,0,0.2)',
                  padding: '2px 6px',
                  borderRadius: 10
                }}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Toolbar with Search, Room Select, Sort */}
        <div className="catalog-toolbar">
          <div className="search-box">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by marble name, SKU, origin, or finish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="catalog-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="toolbar-controls">
            {/* Filter by Room */}
            <select
              className="select-custom"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              id="filter-room-select"
            >
              {ROOM_PRESETS.map((room) => (
                <option key={room.id} value={room.id} style={{ background: '#121824', color: '#fff' }}>
                  {room.label}
                </option>
              ))}
            </select>

            {/* Filter by Finish */}
            <select
              className="select-custom"
              value={selectedFinish}
              onChange={(e) => setSelectedFinish(e.target.value)}
              id="filter-finish-select"
            >
              <option value="all" style={{ background: '#121824', color: '#fff' }}>All Finishes</option>
              {finishes.filter(f => f !== 'all').map((finish) => (
                <option key={finish} value={finish} style={{ background: '#121824', color: '#fff' }}>
                  {finish}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              className="select-custom"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="filter-sort-select"
            >
              <option value="featured" style={{ background: '#121824', color: '#fff' }}>Sort: Featured</option>
              <option value="price-low" style={{ background: '#121824', color: '#fff' }}>Price: Low to High</option>
              <option value="price-high" style={{ background: '#121824', color: '#fff' }}>Price: High to Low</option>
              <option value="rating" style={{ background: '#121824', color: '#fff' }}>Top Rated</option>
            </select>

            {(searchQuery || selectedRoom !== 'all-rooms' || selectedFinish !== 'all' || sortBy !== 'featured') && (
              <button
                type="button"
                className="btn-glass btn-sm"
                onClick={resetFilters}
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <span>Showing <strong>{filteredProducts.length}</strong> available designs</span>
          <span>Click <strong>&quot;Try in Room&quot;</strong> for instant 3D perspective visualization</span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onTryInRoom={onTryInRoom}
                onEstimateCost={onEstimateCost}
                onAddToQuote={onAddToQuote}
                isQuoted={quotedProductIds.includes(product.id)}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              No products found matching your search criteria.
            </p>
            <button type="button" className="btn btn-gold btn-sm" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
