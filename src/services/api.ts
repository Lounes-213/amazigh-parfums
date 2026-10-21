import { Perfume } from '../types';
import { PERFUMES } from '../data/products';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('amazigh_api_url');
    if (custom) return custom.replace(/\/+$/, '');
  }
  return (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787').replace(/\/+$/, '');
};

export interface CategoryInfo {
  id: string;
  label: string;
  sortOrder?: number;
  count?: number;
}

export async function fetchCategories(): Promise<CategoryInfo[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/categories`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function fetchSettings(): Promise<Record<string, string>> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/settings`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data && typeof json.data === 'object' ? json.data : {};
  } catch {
    return {};
  }
}

export async function fetchLivePerfumes(): Promise<Perfume[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/perfumes`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.warn('API returned non-OK status, falling back to static perfumes');
      return PERFUMES;
    }
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }
    return PERFUMES;
  } catch (err) {
    console.warn('Failed to fetch live perfumes, falling back to default perfumes:', err);
    return PERFUMES;
  }
}
