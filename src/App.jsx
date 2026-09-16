import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import CostEstimatorModal from './components/CostEstimatorModal';
import QuoteDrawer from './components/QuoteDrawer';
import BrandStory from './components/BrandStory';
import Footer from './components/Footer';
import VisualizerModal from './components/RoomVisualizer/VisualizerModal';
import { PRODUCTS } from './data/products';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Modal States
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [visualizerProduct, setVisualizerProduct] = useState(PRODUCTS[0]);

  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [estimatorProduct, setEstimatorProduct] = useState(PRODUCTS[0]);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);

  const [isQuoteDrawerOpen, setIsQuoteDrawerOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Show Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // 1-Click "Try in Room" Action
  const handleTryInRoom = (product) => {
    setVisualizerProduct(product);
    setIsVisualizerOpen(true);
  };

  // Launch Customer Upload directly
  const handleOpenCustomUpload = () => {
    setIsVisualizerOpen(true);
  };

  // Open Cost Estimator Modal
  const handleOpenEstimator = (product) => {
    setEstimatorProduct(product || PRODUCTS[0]);
    setIsEstimatorOpen(true);
  };

  // Open Product Detail Modal
  const handleViewDetails = (product) => {
    setDetailProduct(product);
    setIsDetailOpen(true);
  };

  // Add Item to Quotation List
  const handleAddToQuote = (product, estimate = null) => {
    setQuoteItems((prev) => {
      const existsIndex = prev.findIndex((item) => item.id === product.id);
      if (existsIndex >= 0) {
        // If already exists and now has estimate, update it
        if (estimate) {
          const updated = [...prev];
          updated[existsIndex] = { ...updated[existsIndex], estimate };
          return updated;
        }
        return prev;
      }
      return [...prev, { ...product, estimate }];
    });
    showToast(`Added "${product.name}" to your quotation list!`);
  };

  // Remove Item from Quotation List
  const handleRemoveFromQuote = (index) => {
    setQuoteItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearQuote = () => {
    setQuoteItems([]);
  };

  const quotedProductIds = quoteItems.map((item) => item.id);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--gold-gradient)',
            color: '#07090e',
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.9rem',
            zIndex: 9999,
            boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.4)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenVisualizer={() => setIsVisualizerOpen(true)}
        onOpenEstimator={() => handleOpenEstimator(PRODUCTS[0])}
        onOpenQuoteDrawer={() => setIsQuoteDrawerOpen(true)}
        quoteCount={quoteItems.length}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Hero Section */}
      <main style={{ flex: 1 }}>
        <Hero
          onOpenVisualizer={() => setIsVisualizerOpen(true)}
          onOpenCustomUpload={handleOpenCustomUpload}
        />

        {/* Product Catalog Section */}
        <ProductCatalog
          products={PRODUCTS}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onTryInRoom={handleTryInRoom}
          onEstimateCost={handleOpenEstimator}
          onAddToQuote={handleAddToQuote}
          quotedProductIds={quotedProductIds}
          onViewDetails={handleViewDetails}
        />

        {/* Brand Story & Architectural Heritage */}
        <BrandStory />
      </main>

      {/* Footer */}
      <Footer onOpenVisualizer={() => setIsVisualizerOpen(true)} />

      {/* Full-Screen 3D Room Visualizer Modal */}
      <VisualizerModal
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        initialProduct={visualizerProduct}
        allProducts={PRODUCTS}
        onAddToQuote={handleAddToQuote}
        onOpenEstimator={handleOpenEstimator}
      />

      {/* Area & Material Cost Estimator Modal */}
      <CostEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        product={estimatorProduct}
        allProducts={PRODUCTS}
        onAddToQuote={handleAddToQuote}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onTryInRoom={handleTryInRoom}
        onEstimateCost={handleOpenEstimator}
        onAddToQuote={handleAddToQuote}
        isQuoted={detailProduct ? quotedProductIds.includes(detailProduct.id) : false}
      />

      {/* Quotation / Wishlist Drawer */}
      <QuoteDrawer
        isOpen={isQuoteDrawerOpen}
        onClose={() => setIsQuoteDrawerOpen(false)}
        items={quoteItems}
        onRemoveItem={handleRemoveFromQuote}
        onClearQuote={handleClearQuote}
        onTryInRoom={handleTryInRoom}
      />
    </div>
  );
}
