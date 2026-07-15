import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, ArrowLeftRight } from 'lucide-react';
import { getArticle } from '../services/api';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const navigate = useNavigate();
  const qrRef = useRef(null);
  const barcodeRef = useRef(null);

  useEffect(() => {
    getArticle(id).then(r => {
      setArticle(r.data);
    }).catch(() => navigate('/articles'));
  }, [id]);

  useEffect(() => {
    if (article && qrRef.current) {
      QRCode.toCanvas(qrRef.current, article.article_code || `ARTICLE-${article.id}`, { width: 120, margin: 1 });
    }
    if (article && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, article.article_code || `ARTICLE-${article.id}`, { format: 'CODE128', width: 1.5, height: 50, displayValue: true, fontSize: 10 });
      } catch {}
    }
  }, [article]);

  if (!article) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" /></div>;

  const stockPct = Math.min(100, Math.round((article.quantity / Math.max(article.min_quantity * 2, 1)) * 100));
  const stockOk = article.quantity > article.min_quantity;

  const fields = [
    ['Nom', article.name], ['Catégorie', article.category_name],
    ['Date d\'ajout', article.date_added], ['Statut', article.status],
    ['Unité', article.unit], ['Code article', article.article_code],
    ['Marque', article.brand], ['Nature d\'article', article.nature],
    ['Référence', article.reference], ['Fournisseur', article.supplier],
    ['Code Article OCP', article.ocp_code],
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary py-1.5 px-3"><ArrowLeft size={16} /></button>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Détails de l'article</h1>
          <p className="text-gray-500 text-sm">{article.name}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => navigate('/articles')} className="btn-secondary">Retour</button>
          <Link to={`/articles/${id}/edit`} className="btn-primary"><Pencil size={15} /> Mettre à jour</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Info */}
        <div className="card">
          <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b">Informations</h2>
          <div className="grid grid-cols-2 gap-4">
            {fields.map(([label, value]) => value ? (
              <div key={label}>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-gray-800 font-semibold text-sm mt-0.5">
                  {label === 'Statut' ? (
                    <span className={value === 'Nouveau' ? 'badge-new' : 'badge-old'}>{value}</span>
                  ) : value}
                </p>
              </div>
            ) : null)}
          </div>
          {article.description && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-400 font-medium">Description</p>
              <p className="text-gray-700 text-sm mt-1">{article.description}</p>
            </div>
          )}
        </div>

        {/* Stock + QR */}
        <div className="card">
          <h2 className="font-display font-bold text-gray-800 mb-5 pb-3 border-b">Stock Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Quantité actuelle</p>
                <p className={`text-3xl font-display font-bold ${stockOk ? 'text-gray-900' : 'text-red-600'}`}>{article.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Seuil minimal</p>
                <p className="text-3xl font-display font-bold text-gray-600">{article.min_quantity}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-gray-500">Niveau de stock</p>
                <span className={`text-xs font-bold ${stockOk ? 'text-green-600' : 'text-red-500'}`}>
                  {stockOk ? 'Bon' : 'Alerte !'}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${stockOk ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${stockPct}%` }} />
              </div>
            </div>
            <div className="pt-4 border-t space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium">QR Code</p>
                <canvas ref={qrRef} />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium">Code-barres</p>
                <svg ref={barcodeRef} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t">
            <button onClick={() => navigate('/articles')} className="btn-secondary flex-1">Retour à l'accueil</button>
            <Link to={`/articles/${id}/transfer`} className="btn-primary flex-1 justify-center"><ArrowLeftRight size={16} /> Transférer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
