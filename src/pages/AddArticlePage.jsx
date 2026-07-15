import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle, getCategories } from '../services/api';
import toast from 'react-hot-toast';

const NATURES = ['Conditionelle', 'Systématique', 'Critique'];
const UNITS = ['pièce', 'kg', 'm', 'm²', 'm³', 'litre', 'boîte', 'rouleau'];

export default function AddArticlePage() {
  const [form, setForm] = useState({
    name: '', category_id: '', quantity: 0, unit: 'pièce',
    date_added: new Date().toISOString().split('T')[0], status: 'Nouveau',
    min_quantity: 0, brand: '', nature: '', reference: '',
    supplier: '', ocp_code: '', description: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  loadCategories();
}, []);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createArticle(form);
      toast.success('Article ajouté avec succès !');
      navigate('/articles');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Ajouter nouveau article</h1>
        <p className="text-gray-500 text-sm">Remplissez tous les champs requis</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label">Nom *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="Nom de l'article" />
          </div>
          <div>
            <label className="label">Catégorie *</label>
            <select required value={form.category_id} onChange={e => set('quantity', Number(e.target.value))} className="input-field">
              <option value="">Sélectionner une catégorie</option>
              {Array.isArray(categories) && categories.map(c => (
  <option key={c.id} value={c.id}>{c.name}</option>
))}
            </select>
          </div>
          <div>
            <label className="label">Quantité *</label>
            <input type="number" min="0" required value={form.quantity} onChange={e => set('quantity', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Unité</label>
            <select value={form.unit} onChange={e => set('unit', e.target.value)} className="input-field">
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date d'ajout</label>
            <input type="date" value={form.date_added} onChange={e => set('date_added', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Statut</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="input-field">
              <option value="Nouveau">Nouveau</option>
              <option value="Ancien">Ancien</option>
            </select>
          </div>
          <div>
            <label className="label">Seuil Minimal</label>
            <input type="number" min="0" value={form.min_quantity}onChange={e => set('min_quantity', Number(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="label">Marque</label>
            <input value={form.brand} onChange={e => set('brand', e.target.value)} className="input-field" placeholder="Ex: Schneider" />
          </div>
          <div>
            <label className="label">Nature d'article</label>
            <select value={form.nature} onChange={e => set('nature', e.target.value)} className="input-field">
              <option value="">Sélectionner nature</option>
              {NATURES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Référence</label>
            <input value={form.reference} onChange={e => set('reference', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Fournisseur</label>
            <input value={form.supplier} onChange={e => set('supplier', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label">Code Article OCP</label>
            <input value={form.ocp_code} onChange={e => set('ocp_code', e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" placeholder="Description optionnelle..." />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => navigate('/articles')} className="btn-secondary">Annuler</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Ajout en cours...' : '+ Ajouter article'}
          </button>
        </div>
      </form>
    </div>
  );
}
