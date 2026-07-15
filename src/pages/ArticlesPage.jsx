import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, ScanLine, Printer, QrCode, RotateCcw, Eye, Pencil, ArrowLeftRight, Trash2 } from 'lucide-react';
import { getArticles, getCategories, deleteArticle } from '../services/api';
import toast from 'react-hot-toast';

const ArticleCard = ({ article, onDelete }) => {
  const isAlert = article.quantity <= article.min_quantity;
  return (
    <div className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 ${isAlert ? 'border-red-200' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-bold text-gray-900">{article.name}</h3>
          <p className="text-xs text-gray-500">{article.category_name}</p>
        </div>
        <span className={article.status === 'Nouveau' ? 'badge-new' : 'badge-old'}>{article.status}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
        <div>
          <p className="text-xs text-gray-400">Quantité</p>
          <p className={`font-bold text-base ${isAlert ? 'text-red-600' : 'text-gray-900'}`}>{article.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Seuil Min.</p>
          <p className={`font-bold text-base ${isAlert ? 'text-red-500' : 'text-gray-700'}`}>{article.min_quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Date</p>
          <p className="text-gray-600">{article.date_added}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Code article</p>
          <p className="text-gray-600 text-xs truncate">{article.article_code}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Marque</p>
          <p className="text-gray-600 capitalize">{article.brand}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Nature</p>
          <p className="text-gray-600">{article.nature}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
        <Link to={`/articles/${article.id}`} className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
          <Eye size={13} /> Voir
        </Link>
        <Link to={`/articles/${article.id}/edit`} className="text-xs text-amber-600 hover:underline font-medium flex items-center gap-1">
          <Pencil size={13} /> Modifier
        </Link>
        <Link to={`/articles/${article.id}/transfer`} className="text-xs text-green-700 hover:underline font-medium flex items-center gap-1">
          <ArrowLeftRight size={13} /> Transférer
        </Link>
        <Link to={`/articles/print-qr?id=${article.id}`} className="text-xs text-purple-600 hover:underline font-medium flex items-center gap-1">
          <QrCode size={13} /> QR & barre
        </Link>
        <button onClick={() => onDelete(article.id)} className="text-xs text-red-500 hover:underline font-medium flex items-center gap-1 ml-auto">
          <Trash2 size={13} /> Supprimer
        </button>
      </div>
    </div>
  );
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', category_id: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

const load = async () => {
  setLoading(true);
  try {
    const [ar, cats] = await Promise.all([
      getArticles(filters),
      getCategories()
    ]);

    // ✅ Articles
    setArticles(Array.isArray(ar.data?.data) ? ar.data.data : []);

    // ✅ Categories (حل نهائي)
    const catsData =
      cats.data?.data?.data || // إذا كان success + resource
      cats.data?.data ||       // resource فقط
      cats.data ||             // array مباشرة
      [];

    setCategories(Array.isArray(catsData) ? catsData : []);

  } catch (err) {
    console.error(err);
    setCategories([]);
    setArticles([]);
  }
  setLoading(false);
};
  useEffect(() => { load(); }, [filters]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    try {
      await deleteArticle(id);
      toast.success('Article déplacé vers la corbeille');
      load();
    } catch { toast.error('Erreur'); }
  };

  const reset = () => setFilters({ search: '', status: '', category_id: '' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Tous les Articles</h1>
          <p className="text-gray-500 text-sm">Gestion complète de l'inventaire</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Filtres et recherche</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Rechercher</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Nom, marque, nature..." value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value})}
                className="input-field pl-9" />
            </div>
          </div>
          <div>
            <label className="label">État</label>
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="input-field">
              <option value="">Tous les états</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Ancien">Ancien</option>
            </select>
          </div>
          <div>
            <label className="label">Catégorie</label>
            <select value={filters.category_id} onChange={e => setFilters({...filters, category_id: e.target.value})} className="input-field">
              <option value="">Toutes les catégories</option>
              {Array.isArray(categories) && categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={reset} className="btn-secondary gap-1.5">
            <RotateCcw size={15} /> Réinitialiser
          </button>
        </div>
      </div>

      {/* Actions + List */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-display font-bold text-gray-800">Liste des articles <span className="text-green-600">({articles.length})</span></h2>
          <div className="flex gap-2 flex-wrap">
            <Link to="/articles/add" className="btn-primary"><Plus size={16} /> Ajouter un article</Link>
            <Link to="/articles/scan" className="btn-secondary"><ScanLine size={16} /> Scanner</Link>
            <Link to="/articles/print" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
              <Printer size={16} /> Imprimer articles
            </Link>
            <Link to="/articles/print-qr" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
              <QrCode size={16} /> Imprimer QR & Codes-barres
            </Link>
            <Link to="/articles/trashed" className="btn-secondary text-red-500"><Trash2 size={16} /> Corbeille</Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p>Aucun article trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {articles.map(a => <ArticleCard key={a.id} article={a} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </div>
  );
}
