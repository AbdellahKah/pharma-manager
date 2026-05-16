import { useState } from 'react';
import { useVentes } from '../hooks/useVentes';
import { useMedicaments } from '../hooks/useMedicaments';
import { createVente, annulerVente } from '../api/ventesApi';
import './Ventes.css';

/**
 * Page de gestion des ventes et historique.
 */
const Ventes = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statutFilter, setStatutFilter] = useState('');
    const [page, setPage] = useState(1);
    
    const { ventes, pagination, loading, error, refresh } = useVentes({
        date_vente__gte: startDate,
        date_vente__lte: endDate,
        statut: statutFilter,
        page
    });
    
    const { medicaments } = useMedicaments();
    const [isCreating, setIsCreating] = useState(false);
    const [formLignes, setFormLignes] = useState([{ medicament: '', quantite: 1 }]);
    const [submitting, setSubmitting] = useState(false);

    // -- Logique du formulaire --
    
    const handleAddLigne = () => {
        setFormLignes([...formLignes, { medicament: '', quantite: 1 }]);
    };

    const handleRemoveLigne = (index) => {
        setFormLignes(formLignes.filter((_, i) => i !== index));
    };

    const handleLigneChange = (index, field, value) => {
        const newLignes = [...formLignes];
        newLignes[index][field] = value;
        setFormLignes(newLignes);
    };

    const calculateTotal = () => {
        return formLignes.reduce((acc, ligne) => {
            const med = medicaments.find(m => m.id === parseInt(ligne.medicament));
            return acc + (med ? med.prix_vente * ligne.quantite : 0);
        }, 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createVente({ lignes: formLignes });
            setIsCreating(false);
            setFormLignes([{ medicament: '', quantite: 1 }]);
            refresh();
        } catch (err) {
            alert(err.response?.data?.stock || 'Erreur lors de la validation de la vente.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAnnuler = async (id) => {
        if (window.confirm("Voulez-vous vraiment annuler cette vente ? Le stock sera réintégré.")) {
            try {
                await annulerVente(id);
                refresh();
            } catch (err) {
                alert("Erreur lors de l'annulation.");
            }
        }
    };

    return (
        <div className="ventes-page">
            <header className="page-header">
                <div className="header-text">
                    <h1>Gestion des Ventes</h1>
                    <p className="subtitle">{ventes.length} transactions enregistrées</p>
                </div>
                <button 
                    className={`btn-primary-lg ${isCreating ? 'btn-cancel' : ''}`}
                    onClick={() => setIsCreating(!isCreating)}
                >
                    {isCreating ? 'Annuler' : '+ Nouvelle Vente'}
                </button>
            </header>
            
            <section className="filter-section card">
                <div className="filter-group">
                    <label>Du :</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="filter-group">
                    <label>Au :</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="select-box">
                    <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)}>
                        <option value="">Tous les statuts</option>
                        <option value="Complétée">Complétées</option>
                        <option value="Annulée">Annulées</option>
                    </select>
                </div>
            </section>

            {isCreating && (
                <section className="sale-form-section card animate-slide-down">
                    <h2>Nouvelle Vente</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="lignes-container">
                            {formLignes.map((ligne, index) => (
                                <div key={index} className="ligne-row">
                                    <div className="form-group flex-2">
                                        <label>Médicament</label>
                                        <select 
                                            value={ligne.medicament}
                                            onChange={(e) => handleLigneChange(index, 'medicament', e.target.value)}
                                            required
                                        >
                                            <option value="">Choisir un article...</option>
                                            {medicaments.map(m => (
                                                <option key={m.id} value={m.id} disabled={!m.est_actif}>
                                                    {m.nom} ({m.stock_actuel} en stock — {m.prix_vente}€)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group flex-1">
                                        <label>Quantité</label>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            value={ligne.quantite}
                                            onChange={(e) => handleLigneChange(index, 'quantite', parseInt(e.target.value))}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        className="btn-remove"
                                        onClick={() => handleRemoveLigne(index)}
                                        disabled={formLignes.length === 1}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="form-footer">
                            <button type="button" className="btn-secondary" onClick={handleAddLigne}>
                                + Ajouter un article
                            </button>
                            <div className="total-display">
                                Total à payer : <span className="total-amount">{calculateTotal()} €</span>
                            </div>
                            <button type="submit" className="btn-submit" disabled={submitting}>
                                {submitting ? 'Enregistrement...' : 'Confirmer la Vente'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="history-section card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Référence</th>
                            <th>Date</th>
                            <th>Articles</th>
                            <th>Total TTC</th>
                            <th>Statut</th>
                            <th className="text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventes.map(vente => (
                            <tr key={vente.id}>
                                <td className="ref-cell">{vente.reference}</td>
                                <td>{new Date(vente.date_vente).toLocaleString()}</td>
                                <td>
                                    <div className="mini-lignes">
                                        {vente.lignes.map((l, i) => (
                                            <span key={i} className="mini-tag">
                                                {l.medicament_nom} (x{l.quantite})
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="price-cell">{vente.total_ttc} €</td>
                                <td>
                                    <span className={`status-pill ${vente.statut.toLowerCase().replace(' ', '-')}`}>
                                        {vente.statut}
                                    </span>
                                </td>
                                <td className="text-right">
                                    {vente.statut === 'Complétée' && (
                                        <button 
                                            className="btn-annuler" 
                                            onClick={() => handleAnnuler(vente.id)}
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="loader">Chargement de l'historique...</div>}

                <footer className="table-footer">
                    <div className="pagination-info">
                        Page <strong>{pagination.currentPage}</strong> sur <strong>{pagination.totalPages}</strong> ({pagination.count} ventes)
                    </div>
                    <div className="pagination-controls">
                        <button 
                            className="btn-page" 
                            disabled={pagination.currentPage <= 1}
                            onClick={() => setPage(page - 1)}
                        >
                            ← Précédent
                        </button>
                        <button 
                            className="btn-page" 
                            disabled={pagination.currentPage >= pagination.totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Suivant →
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    );
};

export default Ventes;
