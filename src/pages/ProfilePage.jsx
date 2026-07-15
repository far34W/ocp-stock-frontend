import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword } from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passForm, setPassForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSave = async () => {
    setLoadingProfile(true);
    try {
      const res = await updateProfile(profile);
      const token = localStorage.getItem('token');
      login(token, res.data.user);
      toast.success('Profil mis à jour !');
    } catch { toast.error('Erreur lors de la mise à jour'); }
    finally { setLoadingProfile(false); }
  };

  const handlePasswordSave = async () => {
    if (passForm.password !== passForm.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoadingPass(true);
    try {
      await updatePassword(passForm);
      toast.success('Mot de passe mis à jour !');
      setPassForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur'); }
    finally { setLoadingPass(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-500 text-sm">Gérez vos informations personnelles</p>
      </div>

      {/* Profile info */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center text-white text-2xl font-display font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-display font-bold text-gray-900 text-lg">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">{user?.role}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-4 text-sm">Informations du Profil</h3>
          <p className="text-xs text-gray-400 mb-4">Mettez à jour les informations de votre profil et votre adresse e-mail.</p>
          <div className="space-y-4">
            <div>
              <label className="label">Nom</label>
              <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="input-field" />
            </div>
            <button onClick={handleProfileSave} disabled={loadingProfile} className="btn-primary">
              {loadingProfile ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-2">Mettre à jour le mot de passe</h3>
        <p className="text-xs text-gray-400 mb-5">Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé.</p>
        <div className="space-y-4">
          {[
            ['Mot de passe actuel', 'current_password'],
            ['Nouveau mot de passe', 'password'],
            ['Confirmer le mot de passe', 'password_confirmation'],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type="password" value={passForm[key]} onChange={e => setPassForm({...passForm, [key]: e.target.value})} className="input-field" />
            </div>
          ))}
          <button onClick={handlePasswordSave} disabled={loadingPass} className="btn-primary">
            {loadingPass ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
          </button>
        </div>
      </div>
    </div>
  );
}
