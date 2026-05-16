from django.db import models
from django.utils import timezone


class Vente(models.Model):
    """
    Représente une transaction de vente dans la pharmacie.

    Attributs:
        reference (str): Code unique auto-généré (ex: VNT-2024-0001).
        date_vente (datetime): Date et heure de la transaction.
        total_ttc (Decimal): Montant total calculé automatiquement.
        statut (str): État de la vente (En cours, Complétée, Annulée).
        notes (str): Remarques optionnelles.
    """
    STATUT_CHOICES = [
        ('En cours', 'En cours'),
        ('Complétée', 'Complétée'),
        ('Annulée', 'Annulée'),
    ]

    reference = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='Référence',
        editable=False
    )
    date_vente = models.DateTimeField(
        default=timezone.now,
        verbose_name='Date de vente'
    )
    total_ttc = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        verbose_name='Total TTC'
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='Complétée',
        verbose_name='Statut'
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Notes'
    )

    class Meta:
        verbose_name = 'Vente'
        verbose_name_plural = 'Ventes'
        ordering = ['-date_vente']

    def __str__(self):
        return self.reference

    def save(self, *args, **kwargs):
        """Auto-génère la référence au format VNT-YYYY-XXXX."""
        if not self.reference:
            year = timezone.now().year
            last_vente = Vente.objects.filter(
                reference__startswith=f'VNT-{year}'
            ).order_by('reference').last()

            if last_vente:
                last_num = int(last_vente.reference.split('-')[-1])
                new_num = str(last_num + 1).zfill(4)
            else:
                new_num = '0001'

            self.reference = f'VNT-{year}-{new_num}'
        super().save(*args, **kwargs)


class LigneVente(models.Model):
    """
    Détail d'un médicament spécifique dans une vente.

    Attributs:
        vente (FK): La vente parente.
        medicament (FK): Le médicament vendu.
        quantite (int): Quantité vendue.
        prix_unitaire (Decimal): Prix au moment de la vente (snapshot).
        sous_total (Decimal): Montant calculé (quantité x prix_unitaire).
    """
    vente = models.ForeignKey(
        Vente,
        on_delete=models.CASCADE,
        related_name='lignes',
        verbose_name='Vente'
    )
    medicament = models.ForeignKey(
        'medicaments.Medicament',
        on_delete=models.PROTECT,
        verbose_name='Médicament'
    )
    quantite = models.PositiveIntegerField(
        verbose_name='Quantité'
    )
    prix_unitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Prix unitaire'
    )
    sous_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Sous-total',
        editable=False
    )

    class Meta:
        verbose_name = 'Ligne de vente'
        verbose_name_plural = 'Lignes de vente'

    def __str__(self):
        return f'{self.medicament.nom} x {self.quantite}'

    def save(self, *args, **kwargs):
        """Calcule le sous-total avant sauvegarde."""
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)
