import { useMedicaments } from '../hooks/useMedicaments';
import { useVentes } from '../hooks/useVentes';
import './Dashboard.css';

/**
 * Page d'accueil fournissant une vue d'ensemble de l'activité.
 */
const Dashboard = () => {
    const { medicaments, loading: loadingMeds } = useMedicaments();
    const { ventes, loading: loadingVentes } = useVentes();

    // -- Calculs des indicateurs --
    const totalMeds = medicaments.length;
    const alerts = medicaments.filter(m => m.est_en_alerte);
    const alertsCount = alerts.length;
    
    const today = new Date().toLocaleDateString();
    const salesToday = ventes.filter(v => 
        new Date(v.date_vente).toLocaleDateString() === today && 
        v.statut === 'Complétée'
    );
    const revenueToday = salesToday.reduce((acc, v) => acc + parseFloat(v.total_ttc), 0).toFixed(2);

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <div className="header-text">
                    <h1>Tableau de Bord</h1>
                    <p className="subtitle">État actuel de la pharmacie — {today}</p>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-icon icon-blue">📦</div>
                    <div className="stat-info">
                        <span className="stat-label">Médicaments</span>
                        <span className="stat-value">{loadingMeds ? '...' : totalMeds}</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon icon-red">⚠️</div>
                    <div className="stat-info">
                        <span className="stat-label">Alertes Stock</span>
                        <span className="stat-value">{loadingMeds ? '...' : alertsCount}</span>
                    </div>
                </div>
                <div className="stat-card card">
                    <div className="stat-icon icon-green">💰</div>
                    <div className="stat-info">
                        <span className="stat-label">Chiffre d'Affaires (Hj)</span>
                        <span className="stat-value">{loadingVentes ? '...' : revenueToday} €</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <section className="dashboard-section card">
                    <div className="section-header">
                        <h2>Alertes Prioritaires</h2>
                        <span className="count-badge red">{alertsCount}</span>
                    </div>
                    <div className="alerts-list">
                        {alerts.length > 0 ? (
                            alerts.slice(0, 5).map(m => (
                                <div key={m.id} className="alert-item">
                                    <div className="alert-info">
                                        <span className="alert-name">{m.nom}</span>
                                        <span className="alert-stock">Stock : {m.stock_actuel} (Seuil: {m.stock_minimum})</span>
                                    </div>
                                    <span className="badge badge-danger">Rupture proche</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">Aucune alerte de stock.</div>
                        )}
                    </div>
                </section>

                <section className="dashboard-section card">
                    <div className="section-header">
                        <h2>Dernières Ventes</h2>
                        <span className="count-badge blue">{salesToday.length}</span>
                    </div>
                    <div className="recent-list">
                        {ventes.length > 0 ? (
                            ventes.slice(0, 5).map(v => (
                                <div key={v.id} className="recent-item">
                                    <div className="recent-info">
                                        <span className="recent-ref">{v.reference}</span>
                                        <span className="recent-date">{new Date(v.date_vente).toLocaleTimeString()}</span>
                                    </div>
                                    <span className="recent-amount">{v.total_ttc} €</span>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">Aucune vente enregistrée.</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
