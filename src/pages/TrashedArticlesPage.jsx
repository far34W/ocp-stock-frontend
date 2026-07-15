import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { getTrashedArticles, restoreArticle, forceDeleteArticle } from '../services/api';
import toast from 'react-hot-toast';

export default function TrashedArticlesPage() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  const normalize = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;
    return [];
  };

  const load = async () => {
    try {
      const res = await getTrashedArticles();
      setArticles(normalize(res));
    } catch (e) {
      console.log(e);
      setArticles([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRestore = async (id) => {
    try {
      await restoreArticle(id);
      toast.success('Article restauré !');
      load();
    } catch (e) {
      console.log(e);
      toast.error('Erreur');
    }
  };

  const handleForceDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement cet article ?')) return;

    try {
      await forceDeleteArticle(id);
      toast.success('Article supprimé définitivement');
      load();
    } catch (e) {
      console.log(e);
      toast.error('Erreur');
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/articles')}
          className="btn-secondary py-1.5 px-3"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            Articles Supprimés
          </h1>

          <p className="text-gray-500 text-sm">
            Corbeille — {articles.length} article(s)
          </p>
        </div>
      </div>

      <div className="card">

        {articles.length === 0 ? (

          <div className="text-center py-12 text-gray-400">
            <Trash2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun article dans la corbeille</p>
          </div>

        ) : (

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b text-xs text-gray-400 uppercase tracking-wide">
                <th className="pb-3 text-left">Nom</th>
                <th className="pb-3 text-left">Catégorie</th>
                <th className="pb-3 text-left">Date de suppression</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">

              {Array.isArray(articles) &&
                articles.map((a) => (
                  <tr key={a.id}>

                    <td className="py-3 font-semibold text-gray-800">
                      {a.name}
                    </td>

                    <td className="py-3 text-gray-500">
                      {a.category_name}
                    </td>

                    <td className="py-3 text-gray-400 text-xs">
                      {a.deleted_at}
                    </td>

                    <td className="py-3 text-right flex items-center justify-end gap-3">

                      <button
                        onClick={() => handleRestore(a.id)}
                        className="text-green-600 hover:underline text-xs font-semibold flex items-center gap-1"
                      >
                        <RotateCcw size={13} />
                        Restaurer
                      </button>

                      <button
                        onClick={() => handleForceDelete(a.id)}
                        className="text-red-500 hover:underline text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        Supprimer définitivement
                      </button>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}