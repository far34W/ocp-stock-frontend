import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { getArticles } from '../services/api';
import { QRCodeCanvas } from 'qrcode.react';
import Barcode from 'react-barcode';


const ArticleLabel = ({ article }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 text-center">
      <p className="font-display font-bold text-gray-900 text-sm">
        {article.name}
      </p>

      <p className="text-xs text-gray-500 mb-1">
        {article.category_name}
      </p>

      <p className="text-xs text-gray-400 mb-3">
        {article.article_code}
      </p>

      {/* QR */}
     <p className="text-xs font-semibold text-gray-600 mb-1">QR Code</p>
<div className="flex justify-center">
  <QRCodeCanvas value="TEST123" size={80} />
</div>
      {/* Barcode */}
      <p className="text-xs font-semibold text-gray-600 mt-3 mb-1">
        Code-barres
      </p>
      {article.article_code && (
        <div className="flex justify-center">
          <Barcode value={article.article_code} width={1.5} height={40} />
        </div>
      )}

      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
        <span>Quantité: {article.quantity} {article.unit}</span>
        <span>État: {article.status}</span>
      </div>
    </div>
  );
};


export default function PrintQRPage() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  const load = async () => {
    try {
      const res = await getArticles();

      console.log("FULL RESPONSE:", res);

      const articlesData =
        res?.data?.data?.data || // paginate
        res?.data?.data ||       // resource
        res?.data ||             // direct
        [];

      console.log("ARTICLES:", articlesData);

      setArticles(Array.isArray(articlesData) ? articlesData : []);
    } catch (err) {
      console.error(err);
      setArticles([]);
    }
  };

  load();
}, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/articles')} className="btn-secondary py-1.5 px-3"><ArrowLeft size={16} /></button>
          <h1 className="font-display text-xl font-bold text-gray-900">Imprimer QR Codes & Codes-barres</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Printer size={16} /> Imprimer
          </button>
          <button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Download size={16} /> Télécharger PDF
          </button>
        </div>
      </div>

      <div className="card">
        <p className="text-sm text-gray-500 mb-2">Cette page affiche tous les QR codes et codes-barres des articles pour impression.</p>
        <p className="text-sm font-semibold text-gray-700 mb-6">Total: {articles.length} articles</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.isArray(articles) && articles.map(a =>  <ArticleLabel key={a.id} article={a} />)}
        </div>
      </div>
    </div>
  );
}
