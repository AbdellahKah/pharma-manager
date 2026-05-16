from django.contrib import admin
from .models import Vente, LigneVente


class LigneVenteInline(admin.TabularInline):
    """Permet d'éditer les lignes directement dans la fiche vente."""
    model = LigneVente
    extra = 0
    readonly_fields = ('sous_total',)
    fields = ('medicament', 'quantite', 'prix_unitaire', 'sous_total')


@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    """Configuration de l'administration pour les ventes."""
    list_display = ('reference', 'date_vente', 'total_ttc', 'statut')
    list_filter = ('statut', 'date_vente')
    search_fields = ('reference',)
    inlines = [LigneVenteInline]
    readonly_fields = ('reference', 'total_ttc')
