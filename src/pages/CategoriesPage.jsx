import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import toast from 'react-hot-toast';

const Modal = ({ title, form, setForm, onSave, onClose, loading }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h2 className="font-display font-bold text-gray-900 text-lg mb-5">{title}</h2>
      <div className="space-y-4">
        <div>
          <label className="label">Nom *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Nom de la catégorie" />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field resize-none" placeholder="Description optionnelle..." />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button onClick={onClose} className="btn-secondary">Annuler</button>
        <button onClick={onSave} disabled={loading} className="btn-primary">
          {loading ? 'En cours...' : 'Ajouter catégorie'}
        </button>
      </div>
    </div>
  </div>
);

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  const load = () =>
  getCategories()
    .then(r => {
      const catsData =
        r.data?.data?.data ||
        r.data?.data ||
        r.data ||
        [];

      setCategories(Array.isArray(catsData) ? catsData : []);
    })
    .catch(err => {
      console.error(err);
      setCategories([]);
    });
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm({ name: '', description: '' }); setModal('create'); };
  const openEdit = (cat) => { setEditId(cat.id); setForm({ name: cat.name, description: cat.description || '' }); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Le nom est requis'); return; }
    setLoading(true);
    try {
      if (modal === 'create') { await createCategory(form); toast.success('Catégorie créée !'); }
      else { await updateCategory(editId, form); toast.success('Catégorie mise à jour !'); }
      closeModal(); load();
    } catch { toast.error('Erreur'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try { await deleteCategory(id); toast.success('Catégorie supprimée'); load(); }
    catch { toast.error('Impossible de supprimer (articles associés ?)'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-500 text-sm">Gérez les classifications des articles</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Ajouter catégorie</button>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'Créer une catégorie' : 'Modifier la catégorie'}
          form={form} setForm={setForm} onSave={handleSave} onClose={closeModal} loading={loading} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(categories) && categories.map(cat => (
  <div key={cat.id} className="card hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Tag size={18} className="text-green-700" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.articles_count || 0} articles</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-amber-600 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            {cat.description && <p className="text-sm text-gray-500 mt-3 pt-3 border-t">{cat.description}</p>}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <Tag size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucune catégorie. Créez-en une !</p>
          </div>
        )}
      </div>
    </div>
  );
}
