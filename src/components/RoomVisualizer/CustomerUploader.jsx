import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Check, HelpCircle } from 'lucide-react';

export default function CustomerUploader({ onImageLoaded, onSelectSampleDemo }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        onImageLoaded(dataUrl, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        if (dataUrl) {
          onImageLoaded(dataUrl, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--border-gold)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 20px',
          textAlign: 'center',
          background: 'rgba(212, 175, 55, 0.04)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)'
        }}
        id="customer-photo-dropzone"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            color: 'var(--gold-light)'
          }}
        >
          <Upload size={24} />
        </div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
          Click or Drag & Drop Room Photo
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Upload a clear photo of your living hall, bathroom, kitchen, or bedroom.
        </p>
        <span className="btn btn-gold btn-sm">
          Browse Image File
        </span>
      </div>

      {/* Demo sample fallback */}
      <div
        style={{
          background: 'var(--bg-surface-elevated)',
          padding: '14px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
            No room photo right now?
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Load our pre-built customer room demo to test instant floor mapping.
          </div>
        </div>
        <button
          type="button"
          className="btn-glass btn-sm"
          onClick={onSelectSampleDemo}
          id="btn-load-demo-room"
        >
          <Sparkles size={14} /> Load Demo
        </button>
      </div>

      {/* Quick instructions */}
      <div
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          background: 'rgba(255,255,255,0.02)',
          padding: 12,
          borderRadius: 'var(--radius-sm)'
        }}
      >
        <div style={{ fontWeight: 600, color: 'var(--gold-light)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <HelpCircle size={13} /> How Customer Photo Mapping Works:
        </div>
        1. Once uploaded, 4 gold corner pins appear on the floor.<br />
        2. Drag each pin to align with the 4 corners of your room&apos;s floor.<br />
        3. Click any tile or marble below to see it seamlessly rendered in 3D perspective!
      </div>
    </div>
  );
}
