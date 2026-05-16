from django.contrib import admin
from .models import Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    """Configuration de l'administration pour les catégories."""
    list_display = ('nom', 'description')
    search_fields = ('nom',)
