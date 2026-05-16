from django.contrib import admin
from .models import Medicament


@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):
    """Configuration de l'administration pour les médicaments."""
    list_display = (
        'nom', 'dci', 'categorie', 'prix_vente',
        'stock_actuel', 'est_actif', 'est_en_alerte'
    )
    list_filter = ('categorie', 'est_actif', 'ordonnance_requise')
    search_fields = ('nom', 'dci')
    readonly_fields = ('date_creation',)

    def est_en_alerte(self, obj):
        return obj.est_en_alerte
    est_en_alerte.boolean = True
    est_en_alerte.short_description = "Alerte"
