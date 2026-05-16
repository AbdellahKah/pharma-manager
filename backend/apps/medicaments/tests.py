from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Medicament
from apps.categories.models import Categorie


class MedicamentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='testadmin', password='password')
        self.client.force_authenticate(user=self.user)
        self.cat = Categorie.objects.create(nom="Test Cat")
        self.url_list = reverse('medicament-list')

    def test_create_medicament_validation(self):
        """Vérifie la validation des prix (vente > achat)."""
        data = {
            "nom": "Test Med",
            "dci": "Molecule",
            "categorie": self.cat.id,
            "forme": "Comprimé",
            "dosage": "500mg",
            "prix_achat": "10.00",
            "prix_vente": "5.00",  # Invalide (inférieur à l'achat)
            "stock_actuel": 10,
            "stock_minimum": 5,
            "date_expiration": "2030-01-01"
        }
        response = self.client.post(self.url_list, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # L'erreur est retournée par le validateur de prix
        self.assertIn("prix_vente", response.data)

    def test_soft_delete(self):
        """Vérifie que la suppression est bien un 'soft delete'."""
        med = Medicament.objects.create(
            nom="A supprimer", categorie=self.cat,
            prix_achat=1, prix_vente=2, stock_actuel=10, stock_minimum=5,
            forme="Sirop", dosage="150ml", date_expiration="2030-01-01"
        )
        url_detail = reverse('medicament-detail', args=[med.id])
        
        response = self.client.delete(url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        med.refresh_from_db()
        self.assertFalse(med.est_actif)
