import { useState } from 'react';
import { useMedicaments } from '../hooks/useMedicaments';
import { useCategories } from '../hooks/useCategories';
import { deleteMedicament } from '../api/medicamentsApi';
import MedicamentModal from '../components/MedicamentModal';
import './Medicaments.css';

/**
 * Page de gestion du catalogue de médicaments.
 */
const Medicaments = () => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medicamentToEdit, setMedicamentToEdit] = useState(null);
    
    // Récupération des données via les hooks personnalisés
    const { medicaments, loading, error, refresh } = useMedicaments({ search, categorie: category });
    const { categories } = useCategories();
    
    // -- Handlers --
    
    const handleEdit = (med) => {
        setMedicamentToEdit(med);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setMedicamentToEdit(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Voulez-vous vraiment archiver ce médicament ?")) {
            try {
                await deleteMedicament(id);
                refresh();
            } catch (err) {
                alert("Erreur lors de l'archivage.");
            }
        }
    };

    return (
        <div className="medicaments-page">
            <header className="page-header">
                <div className="header-text">
                    <h1>Catalogue Médicaments</h1>
                    <p className="subtitle">{medicaments.length} articles trouvés</p>
                </div>
                <button className="btn-primary-lg" onClick={() => setIsModalOpen(true)}>
                    <span>+</span> Ajouter un médicament
                </button>
            </header>

            <MedicamentModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                categories={categories}
                onRefresh={refresh}
                medicamentToEdit={medicamentToEdit}
            />


            <section className="filter-section card">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Rechercher par nom ou DCI..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="select-box">
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                        ))}
                    </select>
                </div>
            </section>

            {error && <div className="error-message card">{error}</div>}

            <section className="table-section card">
                {loading && medicaments.length === 0 ? (
                    <div className="loader">Chargement du catalogue...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Catégorie</th>
                                <th>Prix Vente</th>
                                <th>Stock Actuel</th>
                                <th>Statut</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicaments.map(med => (
                                <tr key={med.id}>
                                    <td>
                                        <div className="product-info">
                                            <span className="product-name">{med.nom}</span>
                                            <span className="product-subtext">{med.dci} — {med.dosage}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-tag">{med.categorie_nom}</span>
                                    </td>
                                    <td className="price-cell">{med.prix_vente} €</td>
                                    <td>
                                        <div className="stock-cell">
                                            <span className={`stock-count ${med.est_en_alerte ? 'low' : 'ok'}`}>
                                                {med.stock_actuel}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        {med.est_en_alerte ? (
                                            <span className="status-label alert">Stock Bas</span>
                                        ) : (
                                            <span className="status-label success">En Stock</span>
                                        )}
                                    </td>
                                    <td className="text-right">
                                        <div className="action-buttons">
                                            <button 
                                                title="Modifier" 
                                                className="btn-edit"
                                                onClick={() => handleEdit(med)}
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                title="Archiver" 
                                                className="btn-delete"
                                                onClick={() => handleDelete(med.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
};

export default Medicaments;
