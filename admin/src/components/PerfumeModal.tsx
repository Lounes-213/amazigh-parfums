// src/components/PerfumeModal.tsx
// Modal dialog for creating / editing a perfume entry.
// It uses the API client (src/services/api.ts) for uploads and persistence.
// The component collects a subset of fields required for the demo – name, subtitle,
// volume, category and an optional image upload. Additional fields can be added
// later following the same pattern.

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { X, CheckCircle2, AlertCircle, Upload, Eye, EyeOff } from 'lucide-react';
import { uploadFile } from '../services/api';
import type { Perfume, Category } from '../types';

interface PerfumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Perfume>) => void; // Parent will handle create / update and refresh
  initialData?: Perfume | null;
  categories?: Category[];
}

export const PerfumeModal: React.FC<PerfumeModalProps> = ({ isOpen, onClose, onSave, initialData, categories = [] }) => {
  // Basic fields – more can be added as needed.
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [volume, setVolume] = useState('100 ML');
  const [category, setCategory] = useState('oriental');
  const [rating, setRating] = useState('4.9');
  const [reviewsCount, setReviewsCount] = useState('50');
  const [price, setPrice] = useState('');
  const [priceVisible, setPriceVisible] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate fields when editing an existing perfume.
  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? '');
      setSubtitle(initialData.subtitle ?? '');
      setVolume(initialData.volume ?? '100 ML');
      setCategory(initialData.category ?? 'oriental');
      setRating(initialData.rating !== undefined ? String(initialData.rating) : '4.9');
      setReviewsCount(initialData.reviewsCount !== undefined ? String(initialData.reviewsCount) : '0');
      setPrice(initialData.price ? String(initialData.price) : '');
      setPriceVisible(initialData.priceVisible ?? true);
      setPreview(initialData.image ?? '');
    } else {
      // Reset on new creation.
      setName('');
      setSubtitle('');
      setVolume('100 ML');
      setCategory('oriental');
      setRating('4.9');
      setReviewsCount('50');
      setPrice('');
      setPriceVisible(true);
      setPreview('');
      setImageFile(null);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    let imageUrl: string | undefined;

    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadFile(imageFile);
      } catch (err: any) {
        setError(err.message ?? 'Erreur lors du téléversement de l\'image');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Build a minimal perfume payload. The backend accepts many optional fields.
    const payload: Partial<Perfume> = {
      name,
      subtitle,
      volume,
      category: category as Perfume['category'],
      image: imageUrl,
      rating: rating === '' ? 4.9 : Number(rating),
      reviewsCount: reviewsCount === '' ? 0 : Number(reviewsCount),
      price: price === '' ? 0 : Number(price),
      priceVisible,
    };

    // If we are editing, preserve the existing id.
    if (initialData?.id) {
      (payload as any).id = initialData.id;
    }

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#121216] border border-[#26262e] rounded-2xl shadow-2xl p-6 text-[#faf7f2]">
        <div className="flex items-center justify-between pb-4 border-b border-[#23232a] mb-5">
          <h2 className="text-lg font-serif font-medium text-white"> {initialData ? 'Modifier le parfum' : 'Nouveau parfum'} </h2>
          <button onClick={onClose} className="p-2 text-[#9c9a95] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Nom</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Sous‑titre</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Volume</label>
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
              >
                {categories.length === 0 && <option value="oriental">Oriental</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
                {categories.length > 0 && !categories.some((c) => c.id === category) && (
                  <option value={category}>{category}</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Note (étoiles)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-semibold text-[#C8A34D]">★ /5</span>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Nombre d'avis</label>
              <input
                type="number"
                min="0"
                step="1"
                value={reviewsCount}
                onChange={(e) => setReviewsCount(e.target.value)}
                className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Prix (DA)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-semibold text-[#9c9a95]">DA</span>
              </div>
              <p className="text-[10px] text-[#7a7a84] mt-1">0 = aucun prix</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Affichage du prix</label>
              <button
                type="button"
                onClick={() => setPriceVisible((v) => !v)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium border transition-colors ${
                  priceVisible
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-[#18181f] border-[#2b2b36] text-[#9c9a95]'
                }`}
              >
                {priceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {priceVisible ? 'Visible sur le site' : 'Masqué sur le site'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">Image (optionnelle)</label>
            {preview && (
              <div className="mb-3 flex items-center gap-3">
                <img
                  src={preview}
                  alt="Aperçu"
                  className="w-20 h-20 rounded-xl object-cover border border-[#2b2b36] bg-[#0c0c0e]"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
                />
                <span className="text-[10px] text-[#7a7a84]">Image actuelle — choisissez un fichier pour la remplacer</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#C8A34D] file:text-black hover:file:bg-[#d8b55e]" />
              {uploading && <span className="text-xs text-[#C8A34D]">Téléversement…</span>}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#23232a] mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-[#9c9a95] hover:text-white hover:bg-[#1c1c24]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 rounded-xl text-xs font-medium bg-[#C8A34D] hover:bg-[#d8b55e] text-black shadow-gold flex items-center gap-1"
            >
              {uploading ? <CheckCircle2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {initialData ? 'Enregistrer les changements' : 'Créer le parfum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
