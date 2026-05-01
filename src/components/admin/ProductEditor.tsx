'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { Save, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface ProductEditorProps {
  product: Product;
  onSave: (slug: string, updates: Partial<Product>) => Promise<void>;
  onClose: () => void;
}

export function ProductEditor({ product, onSave, onClose }: ProductEditorProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: product.title,
    description: product.description,
    category: product.category,
    price: { ...product.price },
    images: [...product.images],
    badge: product.badge,
    status: product.status || 'draft',
    inStock: product.inStock,
  });

  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFormData(prev => ({
      ...prev,
      price: { ...prev.price!, eur: isNaN(val) ? 0 : val }
    }));
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()]
    }));
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(product.slug, formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Błąd podczas zapisywaia');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-card shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-main">Edycja produktu</h2>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-main hover:bg-surface rounded-btn transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="product-editor-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kolumna lewa - Podstawy */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Tytuł produktu</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required
                    className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1">Cena (€)</label>
                    <input type="number" step="0.01" name="priceEur" value={formData.price?.eur} onChange={handlePriceChange} required
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-1">Koszt Ali (€)</label>
                    <input type="text" value={product.price.aliexpressEur} disabled
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm bg-surface text-text-secondary" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none">
                      <option value="active">Opublikowany (Active)</option>
                      <option value="draft">Szkic (Draft)</option>
                      <option value="trash">Kosz (Trash)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1">Zapas</label>
                    <select name="inStock" value={formData.inStock ? 'yes' : 'no'} 
                      onChange={(e) => setFormData(prev => ({...prev, inStock: e.target.value === 'yes'}))}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none">
                      <option value="yes">W magazynie</option>
                      <option value="no">Brak (Out of stock)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1">Kategoria</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-main mb-1">Badge (etykieta)</label>
                    <input type="text" name="badge" value={formData.badge || ''} onChange={handleChange} placeholder="np. NOWOŚĆ, -50%"
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Kolumna prawa - Opis i Zdjęcia */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1">Opis produktu</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={5}
                    placeholder="Wprowadź przyjazny opis sprzedażowy (może zawierać kod HTML)..."
                    className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none resize-y" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-main mb-2">Galeria Zdjęć</label>
                  
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)}
                      placeholder="Wklej URL nowego zdjęcia (np. z wygenerowanego Midjourney)..."
                      className="flex-1 border border-border rounded-btn px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                    <button type="button" onClick={addImage} className="btn-secondary px-3 py-2 flex items-center gap-1 text-sm">
                      <Plus className="w-4 h-4" /> Dodaj
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {formData.images?.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-btn overflow-hidden border border-border bg-surface flex items-center justify-center">
                        <img src={url} alt={`Podgląd ${idx}`} className="w-full h-full object-contain" />
                        <button type="button" onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(!formData.images || formData.images.length === 0) && (
                      <div className="aspect-square rounded-btn border border-dashed border-border flex items-center justify-center text-text-secondary">
                        <ImageIcon className="w-6 h-6 opacity-50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-surface/50">
          <button type="button" onClick={onClose} disabled={saving} className="btn-secondary px-4 py-2 text-sm">
            Anuluj
          </button>
          <button type="submit" form="product-editor-form" disabled={saving} className="btn-primary px-6 py-2 text-sm flex items-center gap-2">
            {saving ? 'Zapisuję...' : <><Save className="w-4 h-4" /> Zapisz zmiany</>}
          </button>
        </div>

      </div>
    </div>
  );
}
