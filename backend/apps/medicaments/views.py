from django.db import models
from django.db.models import Q, F
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema_view(
    list=extend_schema(summary="Liste des médicaments actifs"),
    create=extend_schema(summary="Créer un médicament"),
    retrieve=extend_schema(summary="Détail d'un médicament"),
    update=extend_schema(summary="Modifier un médicament"),
    partial_update=extend_schema(summary="Modifier partiellement"),
    destroy=extend_schema(summary="Soft delete d'un médicament")
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer le catalogue de médicaments.

    Implémente le CRUD complet avec support du soft delete
    et des alertes de stock.
    """
    serializer_class = MedicamentSerializer

    def get_queryset(self):
        """
        Retourne les médicaments actifs avec filtrage optionnel.
        """
        queryset = Medicament.objects.filter(est_actif=True)
        search = self.request.query_params.get('search')
        categorie = self.request.query_params.get('categorie')

        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) | Q(dci__icontains=search)
            )
        
        if categorie:
            queryset = queryset.filter(categorie_id=categorie)

        return queryset.order_by('nom')

    def destroy(self, request, *args, **kwargs):
        """
        Désactive le médicament au lieu de le supprimer physiquement.
        """
        instance = self.get_object()
        instance.est_actif = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        summary="Médicaments en alerte de stock",
        description="Récupère la liste des médicaments dont le stock est inférieur ou égal au seuil minimum."
    )
    @action(detail=False, methods=['get'], url_path='alertes')
    def alertes(self, request):
        """
        Endpoint personnalisé pour lister les ruptures de stock potentielles.
        """
        queryset = self.get_queryset().filter(stock_actuel__lte=F('stock_minimum'))
        # Note: 'models' must be imported if F is used. Let's fix that.
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
