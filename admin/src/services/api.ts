import { Perfume, Category } from '../types';

export const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('amazigh_api_url');
    if (custom) return custom.replace(/\/+$/, '');
  }
  return (import.meta.env.VITE_API_URL || 'https://amazigh-api.amazigh-backend.workers.dev').replace(/\/+$/, '');
};

export const setApiUrl = (url: string) => {
  localStorage.setItem('amazigh_api_url', url.replace(/\/+$/, ''));
};

export async function fetchPerfumes(): Promise<Perfume[]> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/perfumes`);
  if (!res.ok) {
    throw new Error(`Erreur lors du chargement des parfums (${res.status})`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function createPerfume(perfume: Partial<Perfume>): Promise<Perfume> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/perfumes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(perfume),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Erreur lors de la création du parfum');
  }
  const json = await res.json();
  return json.data;
}

export async function updatePerfume(id: string, perfume: Partial<Perfume>): Promise<Perfume> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/perfumes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(perfume),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Erreur lors de la mise à jour');
  }
  const json = await res.json();
  return json.data;
}

export async function deletePerfume(id: string): Promise<boolean> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/perfumes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression');
  }
  const json = await res.json();
  return json.success;
}

export async function adminLogin(password: string): Promise<boolean> {  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.status === 401) return false;
  if (!res.ok) throw new Error('Serveur indisponible');
  const json = await res.json();
  return Boolean(json.success);
}

export async function uploadFile(file: File): Promise<string> {
  const baseUrl = getApiUrl();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${baseUrl}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Échec du téléversement');
  }

  const json = await res.json();
  return json.url;
}

// Upload générique (image ou vidéo, 50 Mo max)
export async function uploadMedia(file: File): Promise<string> {
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('Fichier trop volumineux (50 Mo maximum)');
  }
  return uploadFile(file);
}

// Supprime un média du stockage à partir de son URL publique
export async function deleteMedia(url: string): Promise<void> {
  if (!url) return;
  const baseUrl = getApiUrl();
  try {
    await fetch(`${baseUrl}/api/r2/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch {
    // suppression best-effort : on n'empêche pas l'enregistrement
  }
}

export async function fetchCategories(): Promise<Category[]> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/categories`);
  if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
  const json = await res.json();
  return json.data || [];
}

export async function createCategory(label: string): Promise<Category> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Erreur lors de la création de la catégorie');
  }
  const json = await res.json();
  return json.data;
}

export async function renameCategory(id: string, label: string): Promise<Category> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Erreur lors de la modification');
  }
  const json = await res.json();
  return json.data;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/categories/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Erreur lors de la suppression');
  }
  const json = await res.json();
  return json.success;
}

export async function fetchSettings(): Promise<Record<string, string>> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/settings`);
  if (!res.ok) throw new Error('Erreur lors du chargement des paramètres');
  const json = await res.json();
  return json.data || {};
}

export async function saveSettings(values: Record<string, string>): Promise<void> {
  const baseUrl = getApiUrl();
  const res = await fetch(`${baseUrl}/api/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Erreur lors de l\'enregistrement');
  }
}

export async function checkApiHealth(): Promise<boolean> {
  try {
    const baseUrl = getApiUrl();
    const res = await fetch(`${baseUrl}/api`, { signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}
