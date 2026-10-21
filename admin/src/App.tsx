import React, { useState, useEffect } from 'react';
import { Perfume, Category } from './types';
import { fetchPerfumes, createPerfume, updatePerfume, deletePerfume, checkApiHealth, fetchCategories, adminLogin } from './services/api';
import { PerfumeModal } from './components/PerfumeModal';
import { SettingsModal } from './components/SettingsModal';
import { CategoriesModal } from './components/CategoriesModal';
import { 
  Sparkles, Plus, Search, Edit3, Trash2, ExternalLink, 
  Settings, RefreshCw, Star, Tags, 
  Lock, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff,
  ArrowUp, ArrowDown
} from 'lucide-react';

export function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('amazigh_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Perfumes data state
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Perfume | null>(null);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadCategories = async () => {
    try {
      setCategories(await fetchCategories());
    } catch (err) {
      // les catégories restent inchangées si l'appel échoue
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const isHealthy = await checkApiHealth();
      setApiOnline(isHealthy);
      const data = await fetchPerfumes();
      setPerfumes(data);
      await loadCategories();
    } catch (err: any) {
      setError(err.message || 'Impossible de contacter le serveur');
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const ok = await adminLogin(passwordInput);
      if (ok) {
        localStorage.setItem('amazigh_admin_auth', 'true');
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError('Mot de passe incorrect.');
      }
    } catch {
      setAuthError('Impossible de contacter le serveur. Réessayez.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('amazigh_admin_auth');
    setIsAuthenticated(false);
  };

  const handleSavePerfume = async (perfumeData: Partial<Perfume>) => {
    if (editingPerfume) {
      const updated = await updatePerfume(editingPerfume.id, perfumeData);
      setPerfumes(prev => prev.map(p => p.id === updated.id ? updated : p));
      showToast(`Parfum "${updated.name}" mis à jour avec succès !`);
    } else {
      const created = await createPerfume(perfumeData);
      setPerfumes(prev => [created, ...prev]);
      showToast(`Nouveau parfum "${created.name}" enregistré !`);
      loadCategories();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deletePerfume(deleteTarget.id);
      setPerfumes(prev => prev.filter(p => p.id !== deleteTarget.id));
      showToast(`Parfum "${deleteTarget.name}" supprimé.`);
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const toggleBestseller = async (p: Perfume, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await updatePerfume(p.id, { isBestseller: !p.isBestseller });
      setPerfumes(prev => prev.map(item => item.id === p.id ? updated : item));
      showToast(`Statut Bestseller modifié pour ${p.name}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleNew = async (p: Perfume, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await updatePerfume(p.id, { isNew: !p.isNew });
      setPerfumes(prev => prev.map(item => item.id === p.id ? updated : item));
      showToast(`Statut Nouveauté modifié pour ${p.name}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const togglePriceVisible = async (p: Perfume, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await updatePerfume(p.id, { priceVisible: !(p.priceVisible ?? true) });
      setPerfumes(prev => prev.map(item => item.id === p.id ? updated : item));
      showToast(`Prix ${!(p.priceVisible ?? true) ? 'affiché' : 'masqué'} pour ${p.name}`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const movePerfume = async (p: Perfume, dir: -1 | 1, e: React.MouseEvent) => {
    e.stopPropagation();
    const ordered = [...perfumes].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = ordered.findIndex(x => x.id === p.id);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= ordered.length) return;

    const swapped = [...ordered];
    [swapped[idx], swapped[target]] = [swapped[target], swapped[idx]];
    const withOrder = swapped.map((item, i) => ({ ...item, sortOrder: i }));
    setPerfumes(withOrder);

    try {
      await Promise.all(
        withOrder.map((item, i) =>
          (ordered.find(o => o.id === item.id)?.sortOrder ?? 0) !== i
            ? updatePerfume(item.id, { sortOrder: i })
            : Promise.resolve(item)
        )
      );
      showToast('Ordre d\'affichage mis à jour');
    } catch (err: any) {
      alert(err.message || 'Erreur lors du réordonnancement');
      loadData();
    }
  };

  // Filtered perfumes
  const filteredPerfumes = perfumes.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If not logged in, display the login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090c] flex flex-col justify-center items-center p-4 relative overflow-hidden text-[#faf7f2]">
        {/* Ambient gold glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8A34D]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#131318] border border-[#2b2b36] rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C8A34D]/10 border border-[#C8A34D]/30 text-[#C8A34D] mb-4 shadow-gold">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif font-light tracking-wide text-white">AMAZIGH PARFUMS</h1>
            <p className="text-xs uppercase tracking-widest text-[#C8A34D] mt-1 font-medium">Panneau d'Administration</p>
            <p className="text-xs text-[#8e8d94] mt-2">Gestion du catalogue et du contenu du site</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#9c9a95] mb-2 font-medium">
                Mot de Passe Administrateur
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1b1b24] border border-[#31313f] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C8A34D] transition-colors pr-10"
                />
                <Lock className="w-4 h-4 text-[#888] absolute right-3.5 top-3.5" />
              </div>
              {authError && <p className="text-xs text-red-400 mt-2">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C8A34D] hover:bg-[#d8b55e] text-black font-medium text-sm shadow-gold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Accéder au Panneau</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-[#23232c] text-center text-[11px] text-[#777]">
            Espace administrateur sécurisé
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#faf7f2] flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#1a1a24] border border-[#C8A34D]/50 text-white text-sm shadow-gold-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#C8A34D]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0e0e13]/90 backdrop-blur-md border-b border-[#21212b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C8A34D]/10 border border-[#C8A34D]/30 flex items-center justify-center text-[#C8A34D] shadow-gold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wider text-white font-medium">AMAZIGH</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C8A34D]/15 text-[#C8A34D] border border-[#C8A34D]/30 uppercase tracking-widest">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-[#8e8d94]">Gestionnaire Catalogue Parfums</p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16161f] border border-[#262633] text-xs">
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[#a09e98] text-[11px]">
                {apiOnline ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>

            {/* Visit Public Site */}
            <a
              href="https://amazigh-parfums.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-[#a09e98] hover:text-white bg-[#15151c] hover:bg-[#1d1d28] border border-[#262633] transition-colors"
            >
              <span>Voir le Site Client</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Settings button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Paramètres du site"
              className="p-2.5 rounded-xl text-[#a09e98] hover:text-white bg-[#15151c] hover:bg-[#1d1d28] border border-[#262633] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl text-xs text-red-400/90 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI / Statistics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#242430]">
            <div className="text-xs uppercase tracking-wider text-[#9c9a95] font-medium mb-1">Total Parfums</div>
            <div className="text-3xl font-serif text-white font-light">{perfumes.length}</div>
            <div className="text-[11px] text-[#C8A34D] mt-1">Références au catalogue</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121217] border border-[#242430]">
            <div className="text-xs uppercase tracking-wider text-[#9c9a95] font-medium mb-1">Best-Sellers</div>
            <div className="text-3xl font-serif text-[#C8A34D] font-light">
              {perfumes.filter(p => p.isBestseller).length}
            </div>
            <div className="text-[11px] text-[#9c9a95] mt-1">Mis en avant</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121217] border border-[#242430]">
            <div className="text-xs uppercase tracking-wider text-[#9c9a95] font-medium mb-1">Nouveautés</div>
            <div className="text-3xl font-serif text-emerald-400 font-light">
              {perfumes.filter(p => p.isNew).length}
            </div>
            <div className="text-[11px] text-[#9c9a95] mt-1">Badges récents</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121217] border border-[#242430] flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#9c9a95] font-medium mb-1">Catégories</div>
              <div className="flex items-center gap-2 text-sm text-white font-medium mt-1">
                <Tags className="w-4 h-4 text-[#C8A34D]" /> {categories.length} catégories
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#9c9a95] mt-2">
              <Star className="w-3.5 h-3.5 text-[#C8A34D]" /> Note moyenne {perfumes.length ? (perfumes.reduce((s, p) => s + (p.rating || 0), 0) / perfumes.length).toFixed(1) : '—'}
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters, Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#131319] border border-[#242430]">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#888] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, note ou ingrédient..."
              className="w-full bg-[#1a1a24] border border-[#2e2e3d] rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#C8A34D] transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[{ id: 'all', label: 'Tous', count: perfumes.length }, ...categories].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-[#C8A34D] text-black shadow-gold'
                    : 'text-[#9c9a95] hover:text-white bg-[#191922] hover:bg-[#20202c]'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-[10px] ${selectedCategory === tab.id ? 'text-black/60' : 'text-[#6f6f78]'}`}>
                  {tab.count ?? 0}
                </span>
              </button>
            ))}
            <button
              onClick={() => setIsCategoriesOpen(true)}
              title="Gérer les catégories"
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#C8A34D] bg-[#C8A34D]/10 hover:bg-[#C8A34D]/20 border border-[#C8A34D]/25 transition-colors flex items-center gap-1"
            >
              <Tags className="w-3.5 h-3.5" /> Gérer
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              title="Rafraîchir les données"
              className="p-2.5 rounded-xl text-[#9c9a95] hover:text-white bg-[#1a1a24] hover:bg-[#242433] border border-[#2e2e3d] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#C8A34D]' : ''}`} />
            </button>

            <button
              onClick={() => {
                setEditingPerfume(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8A34D] hover:bg-[#d8b55e] text-black text-xs font-semibold tracking-wider uppercase shadow-gold transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Parfum</span>
            </button>
          </div>
        </div>

        {/* Perfumes Grid / Cards */}
        {loading && perfumes.length === 0 ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A34D] mx-auto mb-3" />
            <p className="text-sm text-[#9c9a95]">Chargement du catalogue...</p>
          </div>
        ) : error && perfumes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-red-950/20 border border-red-800/40 text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-white mb-1">Connexion au serveur requise</h3>
            <p className="text-xs text-red-300/80 mb-4">{error}</p>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#C8A34D] text-black text-xs font-medium"
            >
              Vérifier l'URL de l'API
            </button>
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#2b2b38] rounded-2xl bg-[#121217]">
            <p className="text-sm text-[#9c9a95]">Aucun parfum ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="group relative bg-[#131319] hover:bg-[#161620] border border-[#23232f] hover:border-[#C8A34D]/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg flex flex-col"
              >
                {/* Image and Badges Header */}
                <div className="relative aspect-[4/3] w-full bg-[#0c0c0e] overflow-hidden">
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/perfume-1.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131319] via-transparent to-black/30" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <button
                      onClick={(e) => toggleBestseller(perfume, e)}
                      title="Cliquez pour changer le statut Best-Seller"
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-colors ${
                        perfume.isBestseller
                          ? 'bg-[#C8A34D] text-black shadow-gold'
                          : 'bg-black/60 backdrop-blur-sm text-[#888] hover:text-white'
                      }`}
                    >
                      ★ Bestseller
                    </button>

                    <button
                      onClick={(e) => toggleNew(perfume, e)}
                      title="Cliquez pour changer le statut Nouveauté"
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider transition-colors ${
                        perfume.isNew
                          ? 'bg-emerald-500 text-black'
                          : 'bg-black/60 backdrop-blur-sm text-[#888] hover:text-white'
                      }`}
                    >
                      Nouveau
                    </button>
                  </div>

                  {/* Volume tag */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-mono text-white/90">
                    {perfume.volume}
                  </div>

                  {/* Rating pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-xs text-[#C8A34D]">
                    <Star className="w-3.5 h-3.5 fill-[#C8A34D]" />
                    <span className="font-semibold text-white">{perfume.rating}</span>
                    <span className="text-[#888] text-[10px]">({perfume.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#C8A34D] font-medium mb-1">
                      <span>{categories.find(c => c.id === perfume.category)?.label ?? perfume.category}</span>
                      <span className="text-[#888]">{perfume.gender}</span>
                    </div>

                    <h3 className="text-xl font-serif font-medium text-white group-hover:text-[#C8A34D] transition-colors">
                      {perfume.name}
                    </h3>
                    
                    <p className="text-xs text-[#a09e98] line-clamp-1 mt-0.5">
                      {perfume.subtitle}
                    </p>

                    <p className="text-xs text-[#8e8d94] line-clamp-2 mt-2 leading-relaxed">
                      {perfume.description}
                    </p>

                    {/* Notes preview */}
                    <div className="mt-3 pt-3 border-t border-[#22222d] text-[11px] text-[#9c9a95] space-y-1">
                      <div>
                        <span className="text-[#C8A34D]">Tête :</span> {perfume.notes?.top?.slice(0, 2).join(', ')}
                      </div>
                      <div>
                        <span className="text-[#C8A34D]">Cœur :</span> {perfume.notes?.heart?.slice(0, 2).join(', ')}
                      </div>
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#22222d]">
                        <span className="text-[#9c9a95]">Prix</span>
                        <span className="font-semibold text-white">
                          {perfume.price && perfume.price > 0
                            ? `${perfume.price.toLocaleString('fr-DZ')} DA`
                            : <span className="text-[#777]">—</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-[#22222d] flex items-center justify-between">
                    <div className="text-[11px] font-mono text-[#888]">
                      ID: <span className="text-white/70">{perfume.id}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => movePerfume(perfume, -1, e)}
                        disabled={perfumes.length < 2}
                        className="p-2 rounded-lg bg-[#1f1f2a] hover:bg-[#2b2b3a] text-white/70 hover:text-[#C8A34D] transition-colors disabled:opacity-30"
                        title="Monter dans l'ordre d'affichage"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => movePerfume(perfume, 1, e)}
                        disabled={perfumes.length < 2}
                        className="p-2 rounded-lg bg-[#1f1f2a] hover:bg-[#2b2b3a] text-white/70 hover:text-[#C8A34D] transition-colors disabled:opacity-30"
                        title="Descendre dans l'ordre d'affichage"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => togglePriceVisible(perfume, e)}
                        className={`p-2 rounded-lg transition-colors ${
                          (perfume.priceVisible ?? true)
                            ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                            : 'bg-[#1f1f2a] text-[#888] hover:text-white'
                        }`}
                        title={(perfume.priceVisible ?? true) ? 'Masquer le prix sur le site' : 'Afficher le prix sur le site'}
                      >
                        {(perfume.priceVisible ?? true) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          setEditingPerfume(perfume);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-[#1f1f2a] hover:bg-[#2b2b3a] text-white/90 hover:text-[#C8A34D] transition-colors"
                        title="Modifier le parfum"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(perfume)}
                        className="p-2 rounded-lg bg-red-950/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 transition-colors"
                        title="Supprimer le parfum"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#14141a] border border-[#2d2d3b] rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Supprimer le parfum ?</h3>
            <p className="text-xs text-[#9c9a95] mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement "{deleteTarget.name}" ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-xs text-[#9c9a95] hover:bg-[#1f1f28]"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-red-600 hover:bg-red-500 text-white"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      <PerfumeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPerfume(null);
        }}
        onSave={handleSavePerfume}
        initialData={editingPerfume}
        categories={categories}
      />

      {/* Categories Modal */}
      <CategoriesModal
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        categories={categories}
        onChanged={async () => {
          await loadCategories();
          const data = await fetchPerfumes();
          setPerfumes(data);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onReload={loadData}
      />
    </div>
  );
}

export default App;
