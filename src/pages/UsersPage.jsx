import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import toast from 'react-hot-toast';

const ROLES = ['admin', 'semi-admin'];

const UserModal = ({ title, form, setForm, onSave, onClose, loading, isEdit }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h2 className="font-display font-bold text-gray-900 text-lg mb-5">{title}</h2>
      <div className="space-y-4">
        <div>
          <label className="label">Nom *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Nom complet" />
        </div>
        <div>
          <label className="label">Email *</label>
          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
        </div>
        {!isEdit && (
          <div>
            <label className="label">Mot de passe *</label>
            <input type="password" required value={form.password || ''} onChange={e => setForm({...form, password: e.target.value})} className="input-field" />
          </div>
        )}
        <div>
          <label className="label">Rôle</label>
          <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field">
            {ROLES.map(r => <option key={r} value={r}>{r === 'admin' ? 'Administrateur' : 'Semi-administrateur'}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button onClick={onClose} className="btn-secondary">Annuler</button>
        <button onClick={onSave} disabled={loading} className="btn-primary">{loading ? 'En cours...' : (isEdit ? 'Mettre à jour' : 'Ajouter utilisateur')}</button>
      </div>
    </div>
  </div>
);

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'semi-admin', password: '' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
  try {
    const res = await getUsers(); // تأكد من اسم API

    const usersData =
      res.data?.data?.data || // success + resource
      res.data?.data ||       // resource فقط
      res.data ||             // array مباشرة
      [];

    setUsers(Array.isArray(usersData) ? usersData : []);

  } catch (err) {
    console.error(err);
    setUsers([]);
  }
};
  useEffect(() => {
  load();
}, []);

  const openCreate = () => { setForm({ name: '', email: '', role: 'semi-admin', password: '' }); setModal('create'); };
  const openEdit = (u) => { setEditId(u.id); setForm({ name: u.name, email: u.email, role: u.role }); setModal('edit'); };
  const closeModal = () => { setModal(null); setEditId(null); };

  const handleSave = async () => {
    if (!form.name || !form.email) { toast.error('Nom et email requis'); return; }
    setLoading(true);
    try {
      if (modal === 'create') { await createUser(form); toast.success('Utilisateur créé !'); }
      else { await updateUser(editId, form); toast.success('Utilisateur mis à jour !'); }
      closeModal(); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try { await deleteUser(id); toast.success('Utilisateur supprimé'); load(); }
    catch { toast.error('Erreur'); }
  };

  const roleColor = (role) => role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
  const roleLabel = (role) => role === 'admin' ? 'Administrateur' : 'Semi-administrateur';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-500 text-sm">{users.length} utilisateur(s) enregistré(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Ajouter un utilisateur</button>
      </div>

      {modal && <UserModal title={modal === 'create' ? 'Ajouter un utilisateur' : 'Modifier utilisateur'}
        form={form} setForm={setForm} onSave={handleSave} onClose={closeModal} loading={loading} isEdit={modal === 'edit'} />}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
            {['Nom','Email','Rôle','Date de création','Actions'].map(h => <th key={h} className="pb-3 text-left pr-6">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-gray-50">
            {Array.isArray(users) && users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-3 pr-6 font-semibold text-gray-800">{u.name}</td>
                <td className="py-3 pr-6 text-gray-600">{u.email}</td>
                <td className="py-3 pr-6">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleColor(u.role)}`}>{roleLabel(u.role)}</span>
                </td>
                <td className="py-3 pr-6 text-gray-400 text-xs">{u.created_at}</td>
                <td className="py-3 flex items-center gap-1">
                  <button onClick={() => openEdit(u)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-amber-600">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-gray-400">Aucun utilisateur</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
