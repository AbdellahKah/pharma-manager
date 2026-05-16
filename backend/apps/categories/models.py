from django.db import models


class Categorie(models.Model):
    """
    Représente une catégorie de médicaments pour la classification.

    Attributs:
        nom (str): Nom unique de la catégorie (ex: Antibiotique).
        description (str): Description optionnelle de l'usage de la catégorie.
    """

    nom = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Nom'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Description'
    )

    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
        ordering = ['nom']

    def __str__(self):
        return self.nom
