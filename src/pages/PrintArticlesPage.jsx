import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { getArticles } from '../services/api';

export default function PrintArticlesPage() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const load = async () => {
    try {
      const res = await getArticles();

      const articlesData =
        res?.data?.data?.data || // pagination Laravel
        res?.data?.data ||       // resource
        res?.data ||             // direct array
        [];

      setArticles(Array.isArray(articlesData) ? articlesData : []);
    } catch (err) {
      console.error(err);
      setArticles([]);
    }
  };

  load();
}, []);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/articles')} className="btn-secondary py-1.5 px-3"><ArrowLeft size={16} /></button>
          <h1 className="font-display text-xl font-bold text-gray-900">Imprimer Articles</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="btn-primary"><Printer size={16} /> Imprimer</button>
          <button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Download size={16} /> Télécharger PDF
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Imprimer Articles</h2>
          <p className="text-sm text-gray-500">Total: {articles.length} articles</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                {['Nom','Catégorie','Quantité','Seuil Min.','État','Date','Série','Marque','Nature','Référence','Fournisseur','Code OCP'].map(h => (
                  <th key={h} className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(articles) && articles.map(a => (
                
                <tr key={a.id} className={a.quantity <= a.min_quantity ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="p-3 font-semibold text-gray-800">{a.name}</td>
                  <td className="p-3 text-gray-600">{a.category_name}</td>
                  <td className="p-3 font-bold">{a.quantity} {a.unit}</td>
                  <td className="p-3 text-gray-600">{a.min_quantity}</td>
                  <td className="p-3"><span className={a.status === 'Nouveau' ? 'badge-new' : 'badge-old'}>{a.status}</span></td>
                  <td className="p-3 text-gray-500">{a.date_added}</td>
                  <td className="p-3 text-xs text-gray-400">{a.article_code}</td>
                  <td className="p-3 text-gray-600">{a.brand}</td>
                  <td className="p-3 text-gray-600">{a.nature}</td>
                  <td className="p-3 text-gray-500">{a.reference}</td>
                  <td className="p-3 text-gray-500">{a.supplier}</td>
                  <td className="p-3 text-gray-500">{a.ocp_code}</td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
