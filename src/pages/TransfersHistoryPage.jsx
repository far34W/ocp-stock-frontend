import React, { useEffect, useState } from 'react';
import { Search, RotateCcw, Printer, FileText, Trash2 } from 'lucide-react';
import { getTransfers, getTransfer, deleteTransfer } from '../services/api';

const PrintBon = ({ transfer, onClose }) => {
  if (!transfer) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-xl font-bold mb-4 text-center">Bon de Décharge</h2>

        <div className="space-y-2 text-sm">
          <p><b>Produit:</b> {transfer.article?.name}</p>
          <p><b>Catégorie:</b> {transfer.article?.category?.name}</p>
          <p><b>Quantité:</b> {transfer.quantity}</p>
          <p><b>Destination:</b> {transfer.to_location}</p>
          <p><b>Personne:</b> {transfer.person_name}</p>
          <p><b>Effectué par:</b> {transfer.transferred_by?.name}</p>
          <p><b>Date:</b> {transfer.created_at}</p>
          <p><b>Notes:</b> {transfer.notes}</p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary">Fermer</button>
          <button onClick={() => window.print()} className="btn-primary">
            <Printer size={16} /> Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TransfersHistoryPage() {
  const [transfers, setTransfers] = useState([]);
  const [filters, setFilters] = useState({ search: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await getTransfers();

        const data =
          res?.data?.data?.data ||
          res?.data?.data ||
          res?.data ||
          [];

        if (mounted) {
          setTransfers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  const openBon = async (id) => {
    try {
      const res = await getTransfer(id);
      const data = res?.data?.data || res?.data;
      setSelectedTransfer(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce transfert ?")) return;

    try {
      await deleteTransfer(id);
      setTransfers(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const reset = () => setFilters({ search: '', date: '' });

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Historique des Transferts</h1>

        <button onClick={() => window.print()} className="bg-amber-500 text-white px-4 py-2 rounded-xl flex gap-2">
          <Printer size={16} /> Imprimer
        </button>
      </div>

      {selectedTransfer && (
        <PrintBon
          transfer={selectedTransfer}
          onClose={() => setSelectedTransfer(null)}
        />
      )}

      {/* TABLE */}
      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th>Produit</th>
                <th>Description</th>
                <th>Quantité</th>
                <th>Destination</th>
                <th>Personne</th>
                <th>Effectué par</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">

                  <td>
                    {t.article?.name}
                    <div className="text-xs text-gray-400">
                      {t.article?.category?.name}
                    </div>
                  </td>

                  <td>{t.article?.description || '-'}</td>
                  <td className="text-green-600 font-bold">{t.quantity}</td>
                  <td>{t.to_location}</td>
                  <td>{t.person_name}</td>
                  <td>{t.transferred_by?.name}</td>
                  <td>{t.notes}</td>

                  <td className="flex gap-2">

                    <button onClick={() => openBon(t.id)}
                      className="p-2 rounded hover:bg-green-100 text-green-600">
                      <FileText size={16} />
                    </button>

                    <button onClick={() => handleDelete(t.id)}
                      className="p-2 rounded hover:bg-red-100 text-red-600">
                      <Trash2 size={16} />
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