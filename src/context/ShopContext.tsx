import React, { createContext, useContext, useState, useEffect } from 'react';
import { Perfume, CartItem } from '../types';
import { PERFUMES } from '../data/products';
import { fetchLivePerfumes, fetchCategories, fetchSettings, CategoryInfo } from '../services/api';

interface ShopContextType {
  whatsappNumber: string;
  settings: Record<string, string>;
  categories: CategoryInfo[];
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  updateItemEngravedName: (id: string, name: string) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutDirectItem: CartItem | null;
  setCheckoutDirectItem: (item: CartItem | null) => void;
  selectedPerfumeForModal: Perfume | null;
  setSelectedPerfumeForModal: (p: Perfume | null) => void;
  perfumes: Perfume[];
  loadingPerfumes: boolean;
  refreshPerfumes: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Official WhatsApp number: 0549225794 -> 213549225794 (surchargeable depuis l'admin)
  const [settings, setSettings] = useState<Record<string, string>>({});
  const whatsappNumber = (settings.whatsapp_number || '213549225794').replace(/[^0-9]/g, '') || '213549225794';
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDirectItem, setCheckoutDirectItem] = useState<CartItem | null>(null);
  const [selectedPerfumeForModal, setSelectedPerfumeForModal] = useState<Perfume | null>(null);

  // Live Cloudflare D1 perfumes
  const [perfumes, setPerfumes] = useState<Perfume[]>(PERFUMES);
  const [loadingPerfumes, setLoadingPerfumes] = useState(false);

  const refreshPerfumes = async () => {
    try {
      setLoadingPerfumes(true);
      const data = await fetchLivePerfumes();
      if (data && data.length > 0) {
        setPerfumes(data);
      }
    } finally {
      setLoadingPerfumes(false);
    }
  };

  useEffect(() => {
    refreshPerfumes();
    fetchCategories().then(setCategories);
    fetchSettings().then(setSettings);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('amazigh_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('amazigh_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id 
          ? { 
              ...p, 
              quantity: p.quantity + item.quantity, 
              engravedName: item.engravedName || p.engravedName
            } 
          : p
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id 
      ? { ...item, quantity: qty } 
      : item
    ));
  };

  const updateItemEngravedName = (id: string, name: string) => {
    setCart(prev => prev.map(item => item.id === id 
      ? { ...item, engravedName: name } 
      : item
    ));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        whatsappNumber,
        settings,
        categories,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemEngravedName,
        clearCart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutDirectItem,
        setCheckoutDirectItem,
        selectedPerfumeForModal,
        setSelectedPerfumeForModal,
        perfumes,
        loadingPerfumes,
        refreshPerfumes,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
