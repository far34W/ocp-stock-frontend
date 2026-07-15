import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Layers, AlertTriangle, ChevronRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';
import {
  getDashboardStats, getTransferChart, getCategoryDistribution,
  getRecentArticles, getRecentMovements, getTopTransferred, getStockAlerts
} from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{label}</p>
      <p className="text-white text-3xl font-display font-bold">{value ?? '—'}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [topTransferred, setTopTransferred] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
const buildChartFromMovements = (movements) => {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const counts = [0,0,0,0,0,0,0];

  movements.forEach(m => {
    const rawDate = m.created_at; // 🔥 الحل هنا

    if (!rawDate) return;

    const date = new Date(rawDate);

    if (isNaN(date)) return;

    const day = date.getDay();
    const index = day === 0 ? 6 : day - 1;

    counts[index] += m.quantity || 1;
  });

  return {
    labels: days,
    datasets: [{
      label: 'Transferts',
      data: counts,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.2)',
      fill: true,
      tension: 0.5,
borderWidth: 3,
pointRadius: 5,
pointHoverRadius: 7,
    }]
  };
};

  useEffect(() => {
    const load = async () => {
      try {
        const [s, cats, ra, rm, top, al] = await Promise.all([
  getDashboardStats(),
  getCategoryDistribution(),
  getRecentArticles(),
  getRecentMovements(),
  getTopTransferred(),
  getStockAlerts()
]);

setStats(s.data);
console.log("MOVEMENTS FULL:", rm.data);
rm.data.forEach(m => console.log("OBJECT:", m));
setCategories(cats.data);
setRecentArticles(ra.data);
setRecentMovements(rm.data);
setTopTransferred(top.data);
setAlerts(al.data);

// 🔥 هنا السحر
setChartData(buildChartFromMovements(rm.data));
        setCategories(cats.data);
        setRecentArticles(ra.data);
        setRecentMovements(rm.data);
        setTopTransferred(top.data);
        setAlerts(al.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble du stock OCP Benguérir</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total des articles" value={stats.total_articles} icon={Package} color="bg-gradient-to-r from-blue-500 to-blue-600" />
        <StatCard label="Total catégories" value={stats.total_categories} icon={Tag} color="bg-gradient-to-r from-purple-500 to-purple-600" />
        <StatCard label="Stock total" value={stats.total_stock} icon={Layers} color="bg-gradient-to-r from-green-600 to-green-700" />
      </div>

      {/* Alerts + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" /> Alertes de stock
            </h2>
            <Link to="/articles" className="text-green-600 text-xs font-semibold flex items-center gap-1 hover:underline">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          {alerts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">Aucune alerte de stock</p>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-500">{a.category_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold text-lg">{a.quantity}</p>
                    <p className="text-xs text-gray-400">Min: {a.min_quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-gray-800 mb-4">Transferts (7 derniers jours)</h2>
          {chartData ? (
           <Line 
  data={chartData} 
  options={{
    responsive: true,
    plugins: { legend: { display: false } },
   scales: {
  y: {
    beginAtZero: true,
    ticks: { stepSize: 1 },
    grid: { color: '#f1f5f9' }
  },
  x: {
    grid: { display: false }
  }
}
  }} 
/>
          ) : <p className="text-gray-400 text-sm text-center py-10">Chargement...</p>}
        </div>
      </div>

      {/* Category distribution + Recent articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-display font-bold text-gray-800 mb-4">Répartition par catégorie</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="pb-2 text-left">Catégorie</th>
              <th className="pb-2 text-center">Articles</th>
              <th className="pb-2 text-right">Stock</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((c, i) => (
                <tr key={i} className="py-2">
                  <td className="py-2.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    {c.name}
                  </td>
                  <td className="text-center text-gray-600">{c.articles_count}</td>
                  <td className="text-right font-semibold text-gray-800">{c.total_stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-800">Articles récents</h2>
            <Link to="/articles" className="text-green-600 text-xs font-semibold flex items-center gap-1 hover:underline">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="pb-2 text-left">Article</th>
              <th className="pb-2 text-center">Catégorie</th>
              <th className="pb-2 text-right">Stock</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {recentArticles.map(a => (
                <tr key={a.id}>
                  <td className="py-2.5">
                    <p className="font-semibold text-gray-800">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.article_code}</p>
                  </td>
                  <td className="text-center text-gray-500 text-xs">{a.category_name}</td>
                  <td className="text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${a.quantity <= a.min_quantity ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {a.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent movements + Top transferred */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-800">Mouvements récents</h2>
            <Link to="/transfers" className="text-green-600 text-xs font-semibold flex items-center gap-1 hover:underline">
              Voir tout <ChevronRight size={14} />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="pb-2 text-left">Produit</th>
              <th className="pb-2 text-center">Type</th>
              <th className="pb-2 text-center">Qté</th>
              <th className="pb-2 text-right">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {recentMovements.map((m, i) => (
                <tr key={i}>
                  <td className="py-2.5">
                    <p className="font-semibold">{m.product_name}</p>
                    <p className="text-xs text-gray-400">{m.category}</p>
                  </td>
                  <td className="text-center">
                    <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">Transfert</span>
                  </td>
                  <td className="text-center font-semibold">{m.quantity}</td>
                  <td className="text-right text-xs text-gray-400">{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-gray-800 mb-4">Produits les plus transférés</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 uppercase tracking-wide border-b">
              <th className="pb-2 text-left">Produit</th>
              <th className="pb-2 text-center">Catégorie</th>
              <th className="pb-2 text-right">Transferts</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {topTransferred.map((t, i) => (
                <tr key={i}>
                  <td className="py-2.5">
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.article_code}</p>
                  </td>
                  <td className="text-center text-xs text-gray-500">{t.category}</td>
                  <td className="text-right font-bold text-green-700">{t.total_transfers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
