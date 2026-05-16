from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Categorie
from .serializers import CategorieSerializer


@extend_schema_view(
    list=extend_schema(
        summary="Liste des catégories",
        description="Récupère la liste de toutes les catégories de médicaments enregistrées."
    ),
    create=extend_schema(
        summary="Créer une catégorie",
        description="Enregistre une nouvelle catégorie de médicaments dans le système."
    ),
    retrieve=extend_schema(
        summary="Détail d'une catégorie",
        description="Récupère les informations détaillées d'une catégorie spécifique via son ID."
    ),
    update=extend_schema(
        summary="Modifier une catégorie",
        description="Met à jour l'intégralité d'une catégorie existante."
    ),
    partial_update=extend_schema(
        summary="Modifier partiellement une catégorie",
        description="Met à jour certains champs d'une catégorie existante."
    ),
    destroy=extend_schema(
        summary="Supprimer une catégorie",
        description="Supprime définitivement une catégorie de la base de données."
    )
)
class CategorieViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les opérations CRUD sur les catégories.

    Fournit les endpoints standards pour la gestion du catalogue
    de classification des médicaments.
    """
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
