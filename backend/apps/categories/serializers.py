from rest_framework import serializers
from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le modèle Categorie.

    Assure la validation des données et la conversion entre
    les instances de modèle et le format JSON.
    """
    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'description']

    def validate_nom(self, value):
        """Vérifie que le nom n'est pas uniquement composé d'espaces."""
        if not value.strip():
            raise serializers.ValidationError("Le nom de la catégorie ne peut pas être vide.")
        return value
