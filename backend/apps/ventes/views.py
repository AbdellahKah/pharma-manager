from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Vente
from .serializers import VenteSerializer


@extend_schema_view(
    list=extend_schema(summary="Historique des ventes"),
    create=extend_schema(summary="Enregistrer une vente (avec déduction stock)"),
    retrieve=extend_schema(summary="Détail d'une vente"),
)
class VenteViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les transactions de vente.

    Fournit l'historique et la logique d'annulation avec
    réintégration automatique des stocks.
    """
    queryset = Vente.objects.all().order_by('-date_vente')
    serializer_class = VenteSerializer
    filterset_fields = {
        'statut': ['exact'],
        'date_vente': ['gte', 'lte'],
    }
    search_fields = ['reference']
    ordering_fields = ['date_vente', 'total_ttc']
    http_method_names = ['get', 'post']

    @extend_schema(
        summary="Annuler une vente",
        description="Annule une vente existante et réintègre les quantités dans le stock des médicaments.",
        responses={200: VenteSerializer}
    )
    @action(detail=True, methods=['post'], url_path='annuler')
    @transaction.atomic
    def annuler(self, request, pk=None):
        """
        Annule la vente et rend le stock à la pharmacie.
        """
        vente = self.get_object()

        if vente.statut == 'Annulée':
            return Response(
                {"error": "Cette vente est déjà annulée."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Réintégration du stock
        for ligne in vente.lignes.all():
            medicament = ligne.medicament
            medicament.stock_actuel += ligne.quantite
            medicament.save()

        vente.statut = 'Annulée'
        vente.save()

        serializer = self.get_serializer(vente)
        return Response(serializer.data)
