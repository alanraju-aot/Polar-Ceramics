import React from 'react';
import { X, Trash2, Send, ShoppingBag, Eye, ArrowRight, Sparkles } from 'lucide-react';

export default function QuoteDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onClearQuote,
  onTryInRoom
}) {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => {
    if (item.estimate?.estimatedTotalProjectCost) {
      return sum + item.estimate.estimatedTotalProjectCost;
    }
    return sum + (item.price || 0);
  }, 0);

  // Generate WhatsApp Message Link
  const handleWhatsAppInquiry = () => {
    let text = `*POLAR CERAMICS & SURFACES - PROJECT INQUIRY*\n\nHello, I would like to request an official quotation and sample delivery for the following selected items:\n\n`;

    items.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (SKU: ${item.sku})\n`;
      text += `   • Category: ${item.categoryLabel} | Finish: ${item.finish}\n`;
      text += `   • Rate: ₹${item.price}/${item.unit}\n`;
      if (item.estimate) {
        text += `   • Calculated Area: ${item.estimate.totalAreaWithWastage} sq.ft (${item.estimate.boxesNeeded} Boxes)\n`;
        text += `   • Estimated Material Budget: ₹${item.estimate.totalMaterialCost.toLocaleString('en-IN')}\n`;
      }
      text += `\n`;
    });

    text += `*Total Estimated Budget: ₹${totalAmount.toLocaleString('en-IN')}*\n\nPlease confirm availability, shipping schedule, and showroom appointment. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/919876543210?text=${encoded}`, '_blank');
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="quote-drawer" id="quote-drawer">
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-darkest)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="var(--gold-primary)" />
            <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>
              Project Quotation ({items.length})
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-glass btn-icon"
            onClick={onClose}
            id="close-quote-drawer-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 14,
                  display: 'flex',
                  gap: 14,
                  position: 'relative'
                }}
              >
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', marginBottom: 6 }}>
                    ₹{item.price}/{item.unit} • {item.finish}
                  </div>

                  {item.estimate && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: 4, marginBottom: 8 }}>
                      Area: {item.estimate.totalAreaWithWastage} sq.ft ({item.estimate.boxesNeeded} Boxes)
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      className="btn-glass btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                      onClick={() => {
                        onTryInRoom(item);
                        onClose();
                      }}
                    >
                      <Eye size={12} /> View in Room
                    </button>

                    <button
                      type="button"
                      className="btn-glass btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.7rem', color: '#f43f5e' }}
                      onClick={() => onRemoveItem(idx)}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: 14 }} />
              <p style={{ fontSize: '1rem', color: '#fff', marginBottom: 6 }}>Your project quote list is empty.</p>
              <p style={{ fontSize: '0.8rem' }}>
                Browse our collection and click &quot;Quote&quot; or &quot;Calculate&quot; to add materials.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Total and WhatsApp Action */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-darkest)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated Total:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-gold"
              style={{ width: '100%', marginBottom: 10 }}
              onClick={handleWhatsAppInquiry}
              id="whatsapp-quote-btn"
            >
              <Send size={16} /> Inquire via WhatsApp
            </button>

            <button
              type="button"
              className="btn-glass btn-sm"
              style={{ width: '100%', fontSize: '0.75rem', opacity: 0.7 }}
              onClick={onClearQuote}
            >
              Clear Quote List
            </button>
          </div>
        )}
      </div>
    </>
  );
}
