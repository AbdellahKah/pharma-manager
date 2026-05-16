import { useState, useEffect } from 'react';
import { createMedicament, updateMedicament } from '../api/medicamentsApi';
import './MedicamentModal.css';

const MedicamentModal = ({ isOpen, onClose, categories, onRefresh, medicamentToEdit }) => {
    const initialState = {
        nom: '',
        dci: '',
        categorie: '',
        forme: 'Comprimé',
        dosage: '',
        prix_achat: '',
        prix_vente: '',
        stock_actuel: '',
        stock_minimum: '',
        date_expiration: '',
        ordonnance_requise: false
    };

    const [formData, setFormData] = useState(initialState);
    const [submitting, setSubmitting] = useState(false);

    // Pré-remplir le formulaire en mode édition
    useEffect(() => {
        if (medicamentToEdit) {
            setFormData({
                ...medicamentToEdit,
                categorie: medicamentToEdit.categorie // L'ID de la catégorie
            });
        } else {
            setFormData(initialState);
        }
    }, [medicamentToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (medicamentToEdit) {
                await updateMedicament(medicamentToEdit.id, formData);
            } else {
                await createMedicament(formData);
            }
            onRefresh();
            onClose();
            setFormData(initialState);
        } catch (err) {
            alert('Erreur lors de l\'enregistrement : ' + JSON.stringify(err.response?.data || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content card animate-pop">
                <div className="modal-header">
                    <h2>{medicamentToEdit ? 'Modifier le Médicament' : 'Ajouter un Médicament'}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nom Commercial</label>
                            <input type="text" required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>DCI (Molécule)</label>
                            <input type="text" required value={formData.dci} onChange={e => setFormData({...formData, dci: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Catégorie</label>
                            <select required value={formData.categorie} onChange={e => setFormData({...formData, categorie: e.target.value})}>
                                <option value="">Choisir...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Dosage</label>
                            <input type="text" placeholder="ex: 500mg" required value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Prix Achat (€)</label>
                            <input type="number" step="0.01" required value={formData.prix_achat} onChange={e => setFormData({...formData, prix_achat: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Prix Vente (€)</label>
                            <input type="number" step="0.01" required value={formData.prix_vente} onChange={e => setFormData({...formData, prix_vente: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Stock Actuel</label>
                            <input type="number" required value={formData.stock_actuel} onChange={e => setFormData({...formData, stock_actuel: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Stock Minimum</label>
                            <input type="number" required value={formData.stock_minimum} onChange={e => setFormData({...formData, stock_minimum: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Date Expiration</label>
                            <input type="date" required value={formData.date_expiration} onChange={e => setFormData({...formData, date_expiration: e.target.value})} />
                        </div>
                        <div className="form-group checkbox">
                            <label>
                                <input type="checkbox" checked={formData.ordonnance_requise} onChange={e => setFormData({...formData, ordonnance_requise: e.target.checked})} />
                                Ordonnance requise ?
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn-submit" disabled={submitting}>
                            {submitting ? 'Enregistrement...' : (medicamentToEdit ? 'Enregistrer les modifications' : 'Ajouter au catalogue')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MedicamentModal;
