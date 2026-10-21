import React, { useState } from 'react';
import { X, Plus, Trash2, Tags, AlertCircle } from 'lucide-react';
import type { Category } from '../types';
import { createCategory, deleteCategory } from '../services/api';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onChanged: () => Promise<void> | void;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({ isOpen, onClose, categories, onChanged }) => {
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createCategory(label.trim());
      setLabel('');
      await onChanged();
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    setError(null);
    if ((cat.count ?? 0) > 0) {
      setError(`"${cat.label}" contient ${cat.count} parfum(s). Déplacez-les d'abord vers une autre catégorie.`);
      return;
    }
    if (!confirm(`Supprimer la catégorie "${cat.label}" ?`)) return;
    setBusy(true);
    try {
      await deleteCategory(cat.id);
      await onChanged();
    } catch (err: any) {
      setError(err.message || 'Erreur');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121216] border border-[#26262e] rounded-2xl shadow-2xl p-6 text-[#faf7f2]">
        <div className="flex items-center justify-between pb-4 border-b border-[#23232a] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A34D]/10 border border-[#C8A34D]/30 flex items-center justify-center text-[#C8A34D]">
              <Tags className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-white">Catégories</h2>
              <p className="text-xs text-[#9c9a95]">Types de parfums affichés sur le site</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9c9a95] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-[#18181f] border border-[#2b2b36]"
            >
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">{cat.label}</div>
                <div className="text-[10px] text-[#7a7a84] font-mono">
                  {cat.id} • {cat.count ?? 0} parfum(s)
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat)}
                disabled={busy}
                title={(cat.count ?? 0) > 0 ? 'Catégorie utilisée' : 'Supprimer'}
                className={`p-2 rounded-lg transition-colors ${
                  (cat.count ?? 0) > 0
                    ? 'text-[#555] cursor-not-allowed'
                    : 'bg-red-950/20 text-red-400 hover:bg-red-900/40'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-[#9c9a95] text-center py-4">Aucune catégorie.</p>
          )}
        </div>

        <form onSubmit={handleAdd} className="mt-5 pt-4 border-t border-[#23232a] space-y-3">
          <label className="block text-xs uppercase tracking-wider text-[#C8A34D] font-medium">
            Nouvelle catégorie
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex : Musc & Blanc"
              className="flex-1 bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
            />
            <button
              type="submit"
              disabled={busy || !label.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#C8A34D] hover:bg-[#d8b55e] text-black text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-400 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
