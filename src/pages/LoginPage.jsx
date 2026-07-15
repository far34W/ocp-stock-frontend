
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiLogin(form);

      login(res.data.token, res.data.user, remember);

      toast.success('Bienvenue !');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-black">

        <div className="absolute w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>

        <div className="relative z-10 backdrop-blur-2xl bg-white/10 border border-green-400/30 rounded-3xl p-10 shadow-[0_0_80px_rgba(34,197,94,0.25)] text-center">

          <div className="w-28 h-28 mx-auto bg-white/20 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_30px_rgba(34,197,94,0.5)]">
            OCP
          </div>

          <h1 className="text-3xl font-bold text-white mt-6">
            Gestion du Stock
          </h1>

          <p className="text-green-100 mt-3 text-sm">
            Plateforme intelligente pour gérer vos équipements électriques en temps réel
          </p>

          <div className="flex gap-4 justify-center mt-6">
            {['Articles', 'Transferts', 'Alertes'].map((item, i) => (
              <div
                key={i}
                className="px-6 py-2.5 rounded-xl text-sm text-white bg-white/10 border border-green-400/30 shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all duration-300"
              >
                {item}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full lg:w-1/2 items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-black">

        <div className="absolute w-[500px] h-[500px] bg-green-500/20 rounded-full blur-3xl"></div>

        <form 
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md p-8 space-y-6 backdrop-blur-2xl bg-white/10 border border-green-400/30 rounded-3xl shadow-[0_0_60px_rgba(34,197,94,0.25)]"
        >

          <div>
            <h2 className="text-2xl font-bold text-white">Bienvenue 👋</h2>
            <p className="text-green-100 text-sm">Connectez-vous à votre compte</p>
          </div>

          {/* EMAIL */}
          <input 
            type="email"
            placeholder="admin@ocp.ma"
            value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-green-200 border border-green-400/30 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* PASSWORD */}
          <input 
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e)=>setForm({...form, password:e.target.value})}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-green-200 border border-green-400/30 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-green-100 cursor-pointer">
              <input 
                type="checkbox"
                checked={remember}
                onChange={()=>setRemember(!remember)}
                className="accent-green-500"
              />
              Se souvenir de moi
            </label>

            <button 
              type="button"
              onClick={()=>alert('Page reset password bientôt 😉')}
              className="text-green-300 hover:text-green-400 hover:underline transition"
            >
              Mot de passe oublié ?
            </button>

          </div>

          {/* BUTTON */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>

        </form>

      </div>

    </div>
  );
}
