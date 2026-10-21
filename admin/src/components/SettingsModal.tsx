import React, { useEffect, useRef, useState } from 'react';
import { X, Settings2, Upload, Loader2, CheckCircle2, AlertTriangle, Trash2, Video, Image as ImageIcon, Phone, Camera, Users, Music2 } from 'lucide-react';
import { fetchSettings, saveSettings, uploadMedia, deleteMedia } from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReload: () => void;
}

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onReload }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setStatus('idle');
    setMessage('');
    setLoading(true);
    fetchSettings()
      .then((data) => setValues(data))
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Impossible de charger les paramètres');
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (kind: 'video' | 'logo', file: File | undefined) => {
    if (!file) return;
    const limit = kind === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > limit) {
      setStatus('error');
      setMessage(kind === 'video' ? 'Vidéo trop volumineuse (50 Mo maximum)' : 'Image trop volumineuse (10 Mo maximum)');
      return;
    }
    setUploading(kind);
    setStatus('idle');
    const key = kind === 'video' ? 'bg_video_url' : 'logo_url';
    const previous = values[key] || '';
    try {
      const url = await uploadMedia(file);
      set(key, url);
      if (previous && previous !== url) {
        await deleteMedia(previous);
      }
      setMessage(kind === 'video' ? 'Vidéo remplacée (ancienne supprimée). Cliquez sur Enregistrer.' : 'Logo remplacé (ancien supprimé). Cliquez sur Enregistrer.');
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Échec du téléversement');
    } finally {
      setUploading(null);
      if (videoInputRef.current) videoInputRef.current.value = '';
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleRemove = async (key: 'bg_video_url' | 'logo_url') => {
    const previous = values[key] || '';
    set(key, '');
    setStatus('success');
    setMessage(key === 'bg_video_url' ? 'Vidéo retirée. Cliquez sur Enregistrer.' : 'Logo retiré. Cliquez sur Enregistrer.');
    if (previous) await deleteMedia(previous);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('idle');
    try {
      const payload: Record<string, string> = {
        logo_url: values.logo_url || '',
        bg_video_url: values.bg_video_url || '',
        phone: values.phone || '',
        whatsapp_number: (values.whatsapp_number || values.phone || '').replace(/[^0-9]/g, ''),
        instagram: values.instagram || '',
        facebook: values.facebook || '',
        tiktok: values.tiktok || '',
        site_name: values.site_name || '',
      };
      await saveSettings(payload);
      setStatus('success');
      setMessage('Paramètres enregistrés.');
      onReload();
      setTimeout(() => onClose(), 700);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#121216] border border-[#26262e] rounded-2xl shadow-2xl p-6 text-[#faf7f2]">
        <div className="flex items-center justify-between pb-4 border-b border-[#23232a] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8A34D]/10 border border-[#C8A34D]/30 flex items-center justify-center text-[#C8A34D]">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-medium text-white">Paramètres du site</h2>
              <p className="text-xs text-[#9c9a95]">Médias, contact et réseaux sociaux</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#9c9a95] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-[#9c9a95] text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
          </div>
        ) : (
          <div className="space-y-5">
            {/* Vidéo d'arrière-plan */}
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">
                <Video className="w-3.5 h-3.5" /> Vidéo d'arrière-plan
              </label>
              {values.bg_video_url && (
                <video
                  key={values.bg_video_url}
                  src={values.bg_video_url}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-32 object-cover rounded-xl border border-[#2b2b36] bg-black mb-2"
                />
              )}
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 bg-[#18181f] border border-[#2b2b36] rounded-xl px-3 py-2.5 text-[11px] text-[#9c9a95] truncate">
                  {values.bg_video_url ? values.bg_video_url.split('/').pop() : 'Aucune vidéo personnalisée'}
                </div>
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploading !== null}
                  className="px-3 py-2.5 bg-[#202029] hover:bg-[#2b2b38] text-xs font-medium rounded-xl flex items-center gap-1.5 text-white"
                >
                  {uploading === 'video' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Choisir
                </button>
                {values.bg_video_url && (
                  <button
                    type="button"
                    onClick={() => handleRemove('bg_video_url')}
                    className="p-2.5 rounded-xl bg-red-950/20 text-red-400 hover:bg-red-900/40"
                    title="Retirer la vidéo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-[10px] text-[#7a7a84]">MP4 ou WebM • 50 Mo maximum • la vidéo par défaut revient si vide</p>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={(e) => handleUpload('video', e.target.files?.[0])}
              />
            </div>

            {/* Logo */}
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">
                <ImageIcon className="w-3.5 h-3.5" /> Logo
              </label>
              {values.logo_url && (
                <div className="w-full h-24 rounded-xl border border-[#2b2b36] bg-[#0c0c0e] flex items-center justify-center mb-2 overflow-hidden">
                  <img src={values.logo_url} alt="Logo" className="max-h-20 max-w-[80%] object-contain" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 bg-[#18181f] border border-[#2b2b36] rounded-xl px-3 py-2.5 text-[11px] text-[#9c9a95] truncate">
                  {values.logo_url ? values.logo_url.split('/').pop() : 'Logo par défaut'}
                </div>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploading !== null}
                  className="px-3 py-2.5 bg-[#202029] hover:bg-[#2b2b38] text-xs font-medium rounded-xl flex items-center gap-1.5 text-white"
                >
                  {uploading === 'logo' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Choisir
                </button>
                {values.logo_url && (
                  <button
                    type="button"
                    onClick={() => handleRemove('logo_url')}
                    className="p-2.5 rounded-xl bg-red-950/20 text-red-400 hover:bg-red-900/40"
                    title="Retirer le logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => handleUpload('logo', e.target.files?.[0])}
              />
            </div>

            <div className="h-px bg-[#23232a]" />

            {/* Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5" /> Téléphone
                </label>
                <input
                  type="tel"
                  value={values.phone || ''}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="0549 22 57 94"
                  className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">
                  WhatsApp (indicatif + numéro)
                </label>
                <input
                  type="tel"
                  value={values.whatsapp_number || ''}
                  onChange={(e) => set('whatsapp_number', e.target.value)}
                  placeholder="213549225794"
                  className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
                />
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">
                  <Camera className="w-3.5 h-3.5" /> Instagram
                </label>
                <input
                  type="url"
                  value={values.instagram || ''}
                  onChange={(e) => set('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">
                  <Users className="w-3.5 h-3.5" /> Facebook
                </label>
                <input
                  type="url"
                  value={values.facebook || ''}
                  onChange={(e) => set('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C8A34D] mb-1.5 font-medium">
                  <Music2 className="w-3.5 h-3.5" /> TikTok
                </label>
                <input
                  type="url"
                  value={values.tiktok || ''}
                  onChange={(e) => set('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="w-full bg-[#18181f] border border-[#2b2b36] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8A34D]"
                />
              </div>
            </div>

            {status !== 'idle' && message && (
              <p className={`text-xs flex items-center gap-1.5 ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {message}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#23232a]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-[#9c9a95] hover:text-white hover:bg-[#1c1c24]"
          >
            Fermer
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading || uploading !== null}
            className="px-5 py-2 rounded-xl text-xs font-medium bg-[#C8A34D] hover:bg-[#d8b55e] text-black shadow-gold disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};
