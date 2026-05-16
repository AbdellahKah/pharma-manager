from django.db import transaction
from rest_framework import serializers
from .models import Vente, LigneVente
from apps.medicaments.models import Medicament


class LigneVenteSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les lignes de vente.
    """
    medicament_nom = serializers.ReadOnlyField(source='medicament.nom')

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'medicament_nom', 'quantite', 'prix_unitaire', 'sous_total']
        read_only_fields = ['prix_unitaire', 'sous_total']


class VenteSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les Ventes.
    Gère la création atomique et la mise à jour des stocks.
    """
    lignes = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'lignes']
        read_only_fields = ['reference', 'total_ttc']

    def validate_lignes(self, value):
        if not value:
            raise serializers.ValidationError("Une vente doit contenir au moins un article.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes')
        vente = Vente.objects.create(**validated_data)
        total_vente = 0

        for ligne_data in lignes_data:
            medicament = ligne_data['medicament']
            quantite = ligne_data['quantite']

            if medicament.stock_actuel < quantite:
                raise serializers.ValidationError({
                    "stock": f"Stock insuffisant pour {medicament.nom}. Disponible: {medicament.stock_actuel}"
                })

            ligne = LigneVente.objects.create(
                vente=vente,
                medicament=medicament,
                quantite=quantite,
                prix_unitaire=medicament.prix_vente
            )

            # Déduction du stock
            medicament.stock_actuel -= quantite
            medicament.save()

            total_vente += ligne.sous_total

        vente.total_ttc = total_vente
        vente.save()
        return vente
