import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ArrowLeftRight, Users, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logout as apiLogout } from '../../services/api';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/articles', icon: Package, label: 'Tous les Articles' },
  { to: '/categories', icon: Tag, label: 'Catégories' },
  { to: '/transfers', icon: ArrowLeftRight, label: 'Historique des Transferts' },
  { to: '/users', icon: Users, label: 'Gestion des Utilisateurs', adminOnly: true },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await apiLogout(); } catch {}
    logout();
    navigate('/login');
    toast.success('Déconnecté avec succès');
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-green-800 to-green-900 flex flex-col fixed left-0 top-0 z-40 shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-green-800 font-display font-bold text-sm">OCP</span>
          </div>
          <div>
            <p className="text-white font-display font-bold text-sm leading-tight">Gestion du Stock</p>
            <p className="text-green-300 text-xs">OCP Benguérir</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label, adminOnly }) => {
          if (adminOnly && !isAdmin()) return null;
          return (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Account */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <p className="text-green-400 text-xs font-semibold uppercase tracking-widest px-4 mb-2">Compte</p>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>Profil</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/10">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-green-300 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
