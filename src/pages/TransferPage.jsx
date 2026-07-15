import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getArticle, transferArticle } from '../services/api';
import toast from 'react-hot-toast';

export default function TransferPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [form, setForm] = useState({
  quantity: 1,
  to_location: '', // 👈 بدل destination
  person_name: '',
  notes: ''
});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { getArticle(id).then(r => setArticle(r.data)).catch(() => navigate('/articles')); }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.quantity > article.quantity) {
      toast.error('Quantité supérieure au stock disponible !');
      return;
    }
    setLoading(true);
    try {
      await transferArticle(id, form);
      toast.success('Transfert effectué avec succès !');
      navigate('/articles');
    } catch (err) {
       console.log(err.response.data); // 👈 زيد هادي
      toast.error(err.response?.data?.message || 'Erreur lors du transfert');
    } finally { setLoading(false); }
  };

  if (!article) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary py-1.5 px-3"><ArrowLeft size={16} /></button>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Transfert de Produit</h1>
          <p className="text-gray-500 text-sm">{article.name}</p>
        </div>
      </div>

      <div className="card">
        {/* Article info */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
          <div>
            <p className="text-xs text-gray-500">Nom du produit</p>
            <p className="font-bold text-gray-800">{article.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Catégorie</p>
            <p className="font-bold text-gray-800">{article.category_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Quantité disponible</p>
            <p className="font-bold text-green-700 text-xl">{article.quantity}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">Quantité à transférer *</label>
              <input type="number" min="1" max={article.quantity} required
                value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})}
                className="input-field" />
            </div>
            <div>
              <label className="label">Destination *</label>
              <input
  required
  placeholder="Département, service, lieu..."
  value={form.to_location}
  onChange={e => setForm({...form, to_location: e.target.value})}
  className="input-field"
/>
            </div>
            <div className="md:col-span-2">
              <label className="label">Nom de la personne</label>
              <input placeholder="Nom de la personne" value={form.person_name}
                onChange={e => setForm({...form, person_name: e.target.value})} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">Notes (optionnel)</label>
            <textarea rows={3} placeholder="Notes additionnelles..." value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              className="input-field resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Transfert...' : 'Effectuer le transfert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
