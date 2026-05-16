from rest_framework import serializers
from .models import Medicament


class MedicamentSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour le modèle Medicament.

    Inclut le champ calculé 'est_en_alerte' et valide les prix/stocks.
    """
    est_en_alerte = serializers.ReadOnlyField()
    categorie_nom = serializers.ReadOnlyField(source='categorie.nom')

    class Meta:
        model = Medicament
        fields = [
            'id', 'nom', 'dci', 'categorie', 'categorie_nom', 'forme',
            'dosage', 'prix_achat', 'prix_vente', 'stock_actuel',
            'stock_minimum', 'date_expiration', 'ordonnance_requise',
            'date_creation', 'est_actif', 'est_en_alerte'
        ]

    def validate(self, data):
        """Vérifie la cohérence des prix."""
        prix_achat = data.get('prix_achat')
        prix_vente = data.get('prix_vente')

        if prix_achat and prix_vente and prix_vente <= prix_achat:
            raise serializers.ValidationError({
                "prix_vente": "Le prix de vente doit être supérieur au prix d'achat."
            })
        return data
