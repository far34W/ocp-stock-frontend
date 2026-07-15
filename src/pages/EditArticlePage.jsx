import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticle, updateArticle, getCategories } from '../services/api';
import toast from 'react-hot-toast';

const NATURES = ['Conditionelle', 'Systématique', 'Critique'];
const UNITS = ['pièce', 'kg', 'm', 'm²', 'm³', 'litre', 'boîte', 'rouleau'];

export default function EditArticlePage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 useEffect(() => {
  Promise.all([getArticle(id), getCategories()])
    .then(([ar, cats]) => {
      const a =
        ar.data?.data || // إلا كان resource
        ar.data;         // إلا كان direct

      setForm({
        name: a.name,
        category_id: a.category_id,
        quantity: a.quantity,
        unit: a.unit,
        date_added: a.date_added,
        status: a.status,
        min_quantity: a.min_quantity,
        brand: a.brand || '',
        nature: a.nature || '',
        reference: a.reference || '',
        supplier: a.supplier || '',
        ocp_code: a.ocp_code || '',
        description: a.description || ''
      });

      // ✅ fix categories
     const catsData =
  cats.data?.data?.data ||
  cats.data?.data ||
  cats.data ||
  [];

setCategories(Array.isArray(catsData) ? catsData : []);
    })
    .catch(() => toast.error('Article non trouvé'));
}, [id]);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateArticle(id, form);
      toast.success('Article mis à jour !');
      navigate('/articles');
    } catch { toast.error('Erreur lors de la mise à jour'); }
    finally { setLoading(false); }
  };

  if (!form) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Modifier l'article</h1>
        <p className="text-gray-500 text-sm">Mettez à jour les informations de l'article</p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ['Nom *', 'name', 'text', null, 'Nom de l\'article'],
            ['Quantité *', 'quantity', 'number', null, ''],
            ['Date d\'ajout', 'date_added', 'date', null, ''],
            ['Seuil Minimal', 'min_quantity', 'number', null, ''],
            ['Marque', 'brand', 'text', null, 'Ex: Schneider'],
            ['Référence', 'reference', 'text', null, ''],
            ['Fournisseur', 'supplier', 'text', null, ''],
            ['Code Article OCP', 'ocp_code', 'text', null, ''],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                className="input-field" required={label.includes('*')} min={type === 'number' ? 0 : undefined} />
            </div>
          ))}
          <div>
            <label className="label">Catégorie *</label>
            <select required value={form.category_id} onChange={e => set('category_id', e.target.value)} className="input-field">
              <option value="">Sélectionner une catégorie</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Unité</label>
            <select value={form.unit} onChange={e => set('unit', e.target.value)} className="input-field">
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Statut</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="input-field">
              <option value="Nouveau">Nouveau</option>
              <option value="Ancien">Ancien</option>
            </select>
          </div>
          <div>
            <label className="label">Nature d'article</label>
            <select value={form.nature} onChange={e => set('nature', e.target.value)} className="input-field">
              <option value="">Sélectionner nature</option>
              {NATURES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/articles')} className="btn-secondary">Annuler</button>
          <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Mise à jour...' : 'Mettre à jour'}</button>
        </div>
      </form>
    </div>
  );
}
