import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ScanLine } from 'lucide-react';
import { scanArticle } from '../services/api';
import toast from 'react-hot-toast';

export default function ScanPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await scanArticle(code.trim());
      setResult(res.data);
    } catch {
      toast.error('Article non trouvé avec ce code');
      setResult(null);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/articles')} className="btn-secondary py-1.5 px-3"><ArrowLeft size={16} /></button>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Scanner Code-barres</h1>
          <p className="text-gray-500 text-sm">Recherche rapide par code article</p>
        </div>
      </div>

      <div className="card text-center">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ScanLine size={30} className="text-green-700" />
        </div>
        <h2 className="font-display font-bold text-gray-800 mb-1">Scannez un code-barres</h2>
        <p className="text-gray-500 text-sm mb-6">Placez votre scanner sur le code-barres du produit</p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1">
            <label className="label text-left">Code-barres :</label>
            <input ref={inputRef} value={code} onChange={e => setCode(e.target.value)}
              placeholder="PROD-20250429-XXXXX" className="input-field" autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="btn-primary h-10">
              <Search size={16} /> {loading ? '...' : 'Rechercher'}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="card">
          <h3 className="font-display font-bold text-gray-800 mb-4">Résultat</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Nom', result.name], ['Catégorie', result.category_name],
              ['Quantité', result.quantity], ['Seuil Min.', result.min_quantity],
              ['Statut', result.status], ['Marque', result.brand],
              ['Nature', result.nature], ['Code OCP', result.ocp_code],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-xs text-gray-400">{l}</p>
                <p className="font-semibold text-gray-800">{v || '—'}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5 pt-4 border-t">
            <button onClick={() => navigate(`/articles/${result.id}`)} className="btn-primary flex-1 justify-center">Voir les détails</button>
            <button onClick={() => navigate(`/articles/${result.id}/transfer`)} className="btn-secondary flex-1 justify-center">Transférer</button>
          </div>
        </div>
      )}
    </div>
  );
}
