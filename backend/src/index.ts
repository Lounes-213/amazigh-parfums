export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_PASSWORD?: string;
}

interface RawPerfumeRow {
  id: string;
  name: string;
  subtitle: string;
  volume: string;
  category: string;
  gender: 'unisexe' | 'homme' | 'femme';
  image: string;
  description: string;
  notes_top: string;
  notes_heart: string;
  notes_base: string;
  sillage: 'Intense' | 'Modéré' | 'Royal';
  longevity: string;
  accent_color: string;
  rating: number;
  reviews_count: number;
  is_bestseller: number;
  is_new: number;
  price: number;
  price_visible: number;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

function corsHeaders(origin: string = '*'): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data: unknown, status = 200, origin = '*'): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders(origin),
    },
  });
}

function formatPerfume(row: RawPerfumeRow) {
  let notesTop: string[] = [];
  let notesHeart: string[] = [];
  let notesBase: string[] = [];

  try { notesTop = JSON.parse(row.notes_top || '[]'); }
  catch { notesTop = (row.notes_top || '').split(',').map(s => s.trim()).filter(Boolean); }

  try { notesHeart = JSON.parse(row.notes_heart || '[]'); }
  catch { notesHeart = (row.notes_heart || '').split(',').map(s => s.trim()).filter(Boolean); }

  try { notesBase = JSON.parse(row.notes_base || '[]'); }
  catch { notesBase = (row.notes_base || '').split(',').map(s => s.trim()).filter(Boolean); }

  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle,
    volume: row.volume || '100 ML',
    category: row.category,
    gender: row.gender,
    image: row.image,
    description: row.description,
    notes: {
      top: notesTop,
      heart: notesHeart,
      base: notesBase,
    },
    sillage: row.sillage,
    longevity: row.longevity,
    accentColor: row.accent_color,
    rating: Number(row.rating) || 4.9,
    reviewsCount: Number(row.reviews_count) || 0,
    isBestseller: Boolean(row.is_bestseller),
    isNew: Boolean(row.is_new),
    price: Number(row.price) || 0,
    priceVisible: Boolean(row.price_visible),
    sortOrder: Number(row.sort_order) || 0,
  };
}

// Helper: delete an old R2 object by its full URL or key
async function cleanupR2(env: Env, imageUrlOrKey: string | null | undefined) {
  if (!imageUrlOrKey) return;
  // Extract key from URLs like https://worker.dev/api/images/KEY or /api/videos/KEY
  let key = imageUrlOrKey;
  if (key.includes('/api/images/')) {
    key = key.split('/api/images/').pop() || '';
  } else if (key.includes('/api/videos/')) {
    key = key.split('/api/videos/').pop() || '';
  }
  key = key.split('?')[0];
  if (key && !key.startsWith('/') && !key.startsWith('http')) {
    try { await env.BUCKET.delete(key); } catch {}
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';
    const method = request.method;

    // Handle preflight CORS
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    const pathname = url.pathname;

    try {
      // ─── Health check ───
      if (pathname === '/' || pathname === '/api') {
        return jsonResponse({
          status: 'ok',
          service: 'Amazigh Luxury Perfumes API',
          version: '2.0.0',
        }, 200, origin);
      }

      // ─── Authentication ───
      if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await request.json().catch(() => ({})) as { password?: string };
        let adminPass = env.ADMIN_PASSWORD || '';
        try {
          const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_password'")
            .first<{ value: string }>();
          if (row?.value) adminPass = row.value;
        } catch {}
        if (!adminPass) {
          return jsonResponse({ success: false, message: 'Mot de passe administrateur non configuré' }, 500, origin);
        }
        if (body.password === adminPass) {
          return jsonResponse({ success: true, message: 'Authentification réussie' }, 200, origin);
        }
        return jsonResponse({ success: false, message: 'Mot de passe incorrect' }, 401, origin);
      }

      // ─── Settings GET ───
      if (pathname === '/api/settings' && method === 'GET') {
        const rows = await env.DB.prepare('SELECT key, value FROM settings').all();
        const settings: Record<string, string> = {};
        for (const row of (rows.results || [])) {
          settings[(row as any).key] = (row as any).value;
        }
        return jsonResponse({ success: true, data: settings }, 200, origin);
      }

      // ─── Settings PUT ───
      if (pathname === '/api/settings' && method === 'PUT') {
        const body = await request.json() as Record<string, string>;
        const stmt = env.DB.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
        const batch = [];
        for (const [key, value] of Object.entries(body)) {
          batch.push(stmt.bind(key, String(value)));
        }
        if (batch.length > 0) {
          await env.DB.batch(batch);
        }
        return jsonResponse({ success: true, message: 'Paramètres mis à jour' }, 200, origin);
      }

      // ─── Categories: list (public, avec compteur de produits) ───
      if (pathname === '/api/categories' && method === 'GET') {
        const rows = await env.DB.prepare(`
          SELECT c.id, c.label, c.sort_order, COUNT(p.id) AS count
          FROM categories c
          LEFT JOIN perfumes p ON p.category = c.id
          GROUP BY c.id
          ORDER BY c.sort_order ASC, c.label ASC
        `).all();

        const data = (rows.results || []).map((r: any) => ({
          id: r.id,
          label: r.label,
          sortOrder: Number(r.sort_order) || 0,
          count: Number(r.count) || 0,
        }));
        return jsonResponse({ success: true, count: data.length, data }, 200, origin);
      }

      // ─── Categories: create ───
      if (pathname === '/api/categories' && method === 'POST') {
        const body = await request.json() as any;
        const label = String(body.label || '').trim();
        if (!label) return jsonResponse({ error: 'Le nom de la catégorie est obligatoire' }, 400, origin);

        const id = String(body.id || label)
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
          .slice(0, 40) || `cat-${Date.now()}`;

        const exists = await env.DB.prepare('SELECT id FROM categories WHERE id = ?').bind(id).first();
        if (exists) return jsonResponse({ error: 'Cette catégorie existe déjà' }, 409, origin);

        const maxRow = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM categories').first<{ m: number }>();
        const sortOrder = (Number(maxRow?.m) || 0) + 1;

        await env.DB.prepare('INSERT INTO categories (id, label, sort_order) VALUES (?, ?, ?)')
          .bind(id, label, sortOrder).run();

        return jsonResponse({ success: true, data: { id, label, sortOrder, count: 0 } }, 201, origin);
      }

      // ─── Categories: rename / reorder ───
      if (pathname.startsWith('/api/categories/') && method === 'PUT') {
        const id = decodeURIComponent(pathname.replace('/api/categories/', ''));
        const body = await request.json() as any;
        const existing = await env.DB.prepare('SELECT * FROM categories WHERE id = ?').bind(id).first<any>();
        if (!existing) return jsonResponse({ error: 'Catégorie introuvable' }, 404, origin);

        const label = String(body.label ?? existing.label).trim() || existing.label;
        const sortOrder = body.sortOrder !== undefined ? (Number(body.sortOrder) || 0) : existing.sort_order;

        await env.DB.prepare('UPDATE categories SET label = ?, sort_order = ? WHERE id = ?')
          .bind(label, sortOrder, id).run();
        return jsonResponse({ success: true, data: { id, label, sortOrder } }, 200, origin);
      }

      // ─── Categories: delete (refusé si des parfums l'utilisent) ───
      if (pathname.startsWith('/api/categories/') && method === 'DELETE') {
        const id = decodeURIComponent(pathname.replace('/api/categories/', ''));
        const used = await env.DB.prepare('SELECT COUNT(*) AS n FROM perfumes WHERE category = ?')
          .bind(id).first<{ n: number }>();
        const n = Number(used?.n) || 0;
        if (n > 0) {
          return jsonResponse({ error: `Impossible : ${n} parfum(s) utilisent cette catégorie`, count: n }, 409, origin);
        }
        const res = await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, deleted: res.meta.changes > 0 }, 200, origin);
      }

      // ─── Image retrieval from R2 ───
      if (pathname.startsWith('/api/images/')) {
        const key = decodeURIComponent(pathname.replace('/api/images/', ''));
        if (!key) return new Response('Key missing', { status: 400, headers: corsHeaders(origin) });

        const object = await env.BUCKET.get(key);
        if (!object) return new Response('Not found in R2', { status: 404, headers: corsHeaders(origin) });

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        headers.set('Access-Control-Allow-Origin', origin);
        return new Response(object.body, { headers });
      }

      // ─── Video retrieval from R2 ───
      if (pathname.startsWith('/api/videos/')) {
        const key = decodeURIComponent(pathname.replace('/api/videos/', ''));
        if (!key) return new Response('Key missing', { status: 400, headers: corsHeaders(origin) });

        const object = await env.BUCKET.get(key);
        if (!object) return new Response('Not found in R2', { status: 404, headers: corsHeaders(origin) });

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=604800');
        headers.set('Access-Control-Allow-Origin', origin);
        return new Response(object.body, { headers });
      }

      // ─── File Upload to R2 (images & videos) ───
      if (pathname === '/api/upload' && method === 'POST') {
        const contentType = request.headers.get('content-type') || '';
        let fileData: ArrayBuffer | null = null;
        let mimeType = 'image/jpeg';
        let originalName = 'upload.jpg';

        if (contentType.includes('multipart/form-data')) {
          const formData = await request.formData();
          const file = formData.get('file');
          if (!file || !(file instanceof File)) {
            return jsonResponse({ error: 'Fichier manquant ou invalide' }, 400, origin);
          }

          // Check video size limit (50MB)
          if (file.type.startsWith('video/') && file.size > 50 * 1024 * 1024) {
            return jsonResponse({ error: 'Vidéo trop volumineuse (max 50 Mo)' }, 413, origin);
          }

          fileData = await file.arrayBuffer();
          mimeType = file.type || 'image/jpeg';
          originalName = file.name || 'file';
        } else {
          fileData = await request.arrayBuffer();
          mimeType = contentType || 'image/jpeg';
        }

        if (!fileData) {
          return jsonResponse({ error: 'Aucune donnée fournie' }, 400, origin);
        }

        // Determine extension
        let ext = 'jpg';
        if (mimeType.includes('png')) ext = 'png';
        else if (mimeType.includes('webp')) ext = 'webp';
        else if (mimeType.includes('mp4')) ext = 'mp4';
        else if (mimeType.includes('webm')) ext = 'webm';
        else if (mimeType.includes('mov') || mimeType.includes('quicktime')) ext = 'mov';

        const isVideo = mimeType.startsWith('video/');
        const prefix = isVideo ? 'video' : 'img';
        const sanitized = originalName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
        const key = `${prefix}-${Date.now()}-${sanitized.substring(0, 30)}.${ext}`;

        await env.BUCKET.put(key, fileData, {
          httpMetadata: { contentType: mimeType },
        });

        const hostUrl = new URL(request.url).origin;
        const route = isVideo ? 'videos' : 'images';
        const fileUrl = `${hostUrl}/api/${route}/${key}`;

        return jsonResponse({
          success: true,
          key,
          url: fileUrl,
          path: `/api/${route}/${key}`,
          type: isVideo ? 'video' : 'image',
        }, 201, origin);
      }

      // ─── Delete R2 object ───
      if (pathname === '/api/r2/delete' && method === 'POST') {
        const body = await request.json() as { key?: string; url?: string };
        const keyOrUrl = body.key || body.url || '';
        await cleanupR2(env, keyOrUrl);
        return jsonResponse({ success: true, message: 'Objet R2 supprimé' }, 200, origin);
      }

      // ─── GET All Perfumes ───
      if (pathname === '/api/perfumes' && method === 'GET') {
        const query = await env.DB.prepare(
          'SELECT * FROM perfumes ORDER BY sort_order ASC, created_at DESC'
        ).all<RawPerfumeRow>();

        const perfumes = (query.results || []).map(formatPerfume);
        return jsonResponse({ success: true, count: perfumes.length, data: perfumes }, 200, origin);
      }

      // ─── GET Single Perfume ───
      if (pathname.startsWith('/api/perfumes/') && method === 'GET') {
        const id = pathname.replace('/api/perfumes/', '');
        const item = await env.DB.prepare('SELECT * FROM perfumes WHERE id = ?')
          .bind(id).first<RawPerfumeRow>();
        if (!item) return jsonResponse({ error: 'Parfum non trouvé' }, 404, origin);
        return jsonResponse({ success: true, data: formatPerfume(item) }, 200, origin);
      }

      // ─── POST Create Perfume ───
      if (pathname === '/api/perfumes' && method === 'POST') {
        const body = await request.json() as any;
        if (!body.name) {
          return jsonResponse({ error: 'Le champ name est obligatoire' }, 400, origin);
        }

        const id = body.id || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `perfume-${Date.now()}`;
        const subtitle = body.subtitle || 'Extrait de Parfum Haute Concentration';
        const volume = body.volume || '100 ML';
        const category = String(body.category || 'oriental').trim().toLowerCase().slice(0, 40) || 'oriental';
        const gender = ['unisexe', 'homme', 'femme'].includes(body.gender) ? body.gender : 'unisexe';
        const image = body.image || '';
        const description = body.description || '';
        const notesTop = JSON.stringify(Array.isArray(body.notes?.top) ? body.notes.top : []);
        const notesHeart = JSON.stringify(Array.isArray(body.notes?.heart) ? body.notes.heart : []);
        const notesBase = JSON.stringify(Array.isArray(body.notes?.base) ? body.notes.base : []);
        const sillage = ['Intense', 'Modéré', 'Royal'].includes(body.sillage) ? body.sillage : 'Intense';
        const longevity = body.longevity || '+14 Heures';
        const accentColor = body.accentColor || '#C8A34D';
        const rating = Number(body.rating) || 4.9;
        const reviewsCount = Number(body.reviewsCount) || 50;
        const isBestseller = body.isBestseller ? 1 : 0;
        const isNew = body.isNew ? 1 : 0;
        const price = Number(body.price) || 0;
        const priceVisible = body.priceVisible !== undefined ? (body.priceVisible ? 1 : 0) : 1;
        let sortOrder: number;
        if (body.sortOrder !== undefined) {
          sortOrder = Number(body.sortOrder) || 0;
        } else {
          const maxRow = await env.DB.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM perfumes').first<{ m: number }>();
          sortOrder = (Number(maxRow?.m) || 0) + 1;
        }

        await env.DB.prepare(`
          INSERT INTO perfumes (
            id, name, subtitle, volume, category, gender, image, description,
            notes_top, notes_heart, notes_base, sillage, longevity, accent_color,
            rating, reviews_count, is_bestseller, is_new, price, price_visible, sort_order,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
          id, body.name, subtitle, volume, category, gender, image, description,
          notesTop, notesHeart, notesBase, sillage, longevity, accentColor,
          rating, reviewsCount, isBestseller, isNew, price, priceVisible, sortOrder
        ).run();

        const created = await env.DB.prepare('SELECT * FROM perfumes WHERE id = ?').bind(id).first<RawPerfumeRow>();
        return jsonResponse({ success: true, data: created ? formatPerfume(created) : null }, 201, origin);
      }

      // ─── PUT Update Perfume ───
      if (pathname.startsWith('/api/perfumes/') && method === 'PUT') {
        const id = pathname.replace('/api/perfumes/', '');
        const body = await request.json() as any;

        const existing = await env.DB.prepare('SELECT * FROM perfumes WHERE id = ?').bind(id).first<RawPerfumeRow>();
        if (!existing) return jsonResponse({ error: 'Parfum introuvable' }, 404, origin);

        // If image changed, cleanup old one from R2
        if (body.image && body.image !== existing.image) {
          await cleanupR2(env, existing.image);
        }

        const name = body.name ?? existing.name;
        const subtitle = body.subtitle ?? existing.subtitle;
        const volume = body.volume ?? existing.volume;
        const category = body.category !== undefined
          ? (String(body.category).trim().toLowerCase().slice(0, 40) || existing.category)
          : existing.category;
        const gender = body.gender ?? existing.gender;
        const image = body.image ?? existing.image;
        const description = body.description ?? existing.description;
        const notesTop = body.notes?.top ? JSON.stringify(body.notes.top) : existing.notes_top;
        const notesHeart = body.notes?.heart ? JSON.stringify(body.notes.heart) : existing.notes_heart;
        const notesBase = body.notes?.base ? JSON.stringify(body.notes.base) : existing.notes_base;
        const sillage = body.sillage ?? existing.sillage;
        const longevity = body.longevity ?? existing.longevity;
        const accentColor = body.accentColor ?? existing.accent_color;
        const rating = body.rating !== undefined ? Number(body.rating) : existing.rating;
        const reviewsCount = body.reviewsCount !== undefined ? Number(body.reviewsCount) : existing.reviews_count;
        const isBestseller = body.isBestseller !== undefined ? (body.isBestseller ? 1 : 0) : existing.is_bestseller;
        const isNew = body.isNew !== undefined ? (body.isNew ? 1 : 0) : existing.is_new;
        const price = body.price !== undefined ? Number(body.price) : (existing.price || 0);
        const priceVisible = body.priceVisible !== undefined ? (body.priceVisible ? 1 : 0) : (existing.price_visible ?? 1);
        const sortOrder = body.sortOrder !== undefined ? Number(body.sortOrder) || 0 : (existing.sort_order ?? 0);

        await env.DB.prepare(`
          UPDATE perfumes SET
            name = ?, subtitle = ?, volume = ?, category = ?, gender = ?, image = ?, description = ?,
            notes_top = ?, notes_heart = ?, notes_base = ?, sillage = ?, longevity = ?, accent_color = ?,
            rating = ?, reviews_count = ?, is_bestseller = ?, is_new = ?, price = ?, price_visible = ?, sort_order = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(
          name, subtitle, volume, category, gender, image, description,
          notesTop, notesHeart, notesBase, sillage, longevity, accentColor,
          rating, reviewsCount, isBestseller, isNew, price, priceVisible, sortOrder, id
        ).run();

        const updated = await env.DB.prepare('SELECT * FROM perfumes WHERE id = ?').bind(id).first<RawPerfumeRow>();
        return jsonResponse({ success: true, data: updated ? formatPerfume(updated) : null }, 200, origin);
      }

      // ─── DELETE Perfume (cleanup R2 image) ───
      if (pathname.startsWith('/api/perfumes/') && method === 'DELETE') {
        const id = pathname.replace('/api/perfumes/', '');
        // Get the perfume first to cleanup its R2 image
        const existing = await env.DB.prepare('SELECT image FROM perfumes WHERE id = ?').bind(id).first<{ image: string }>();
        if (existing?.image) {
          await cleanupR2(env, existing.image);
        }
        const res = await env.DB.prepare('DELETE FROM perfumes WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true, deleted: res.meta.changes > 0 }, 200, origin);
      }

      // ─── POST Order (save + notify admin) ───
      if (pathname === '/api/orders' && method === 'POST') {
        const body = await request.json() as any;
        if (!body.customer_name || !body.customer_phone || !body.items) {
          return jsonResponse({ error: 'Champs requis: customer_name, customer_phone, items' }, 400, origin);
        }

        await env.DB.prepare(`
          INSERT INTO orders (customer_name, customer_phone, customer_address, items, notes)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          body.customer_name,
          body.customer_phone,
          body.customer_address || '',
          JSON.stringify(body.items),
          body.notes || ''
        ).run();

        // Send Web Push notification if token is set
        const tokenRow = await env.DB.prepare("SELECT value FROM settings WHERE key = 'notification_token'").first<{ value: string }>();
        if (tokenRow?.value) {
          try {
            // Use a lightweight push service (ntfy.sh) for simplicity
            await fetch(`https://ntfy.sh/${tokenRow.value}`, {
              method: 'POST',
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
              body: `🛒 Nouvelle commande AMAZIGH!\n👤 ${body.customer_name}\n📞 ${body.customer_phone}\n📍 ${body.customer_address || 'N/A'}`,
            });
          } catch (e) {
            console.error('Push notification failed:', e);
          }
        }

        return jsonResponse({ success: true, message: 'Commande enregistrée' }, 201, origin);
      }

      // ─── GET Orders (Admin) ───
      if (pathname === '/api/orders' && method === 'GET') {
        const rows = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100').all();
        return jsonResponse({ success: true, data: rows.results || [] }, 200, origin);
      }

      // ─── 404 ───
      return jsonResponse({ error: 'Route introuvable' }, 404, origin);

    } catch (err: any) {
      console.error('API Error:', err);
      return jsonResponse({
        error: 'Erreur interne du serveur',
        details: err?.message || String(err)
      }, 500, origin);
    }
  },
};
