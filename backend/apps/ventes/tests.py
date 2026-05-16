from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.medicaments.models import Medicament
from apps.categories.models import Categorie


class VenteTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser(username='testadmin2', password='password')
        self.client.force_authenticate(user=self.user)
        self.cat = Categorie.objects.create(nom="Test Cat")
        self.med = Medicament.objects.create(
            nom="A",
            dci="A",
            categorie=self.cat,
            prix_achat=10,
            prix_vente=20,
            stock_actuel=100,
            stock_minimum=10,
            forme="Comprimé",
            dosage="500mg",
            date_expiration="2026-01-01"
        )
        self.url_list = reverse('vente-list')

    def test_vente_deducts_stock(self):
        """Vérifie qu'une vente diminue bien le stock."""
        data = {
            "lignes": [
                {"medicament": self.med.id, "quantite": 10}
            ]
        }
        response = self.client.post(self.url_list, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.med.refresh_from_db()
        self.assertEqual(self.med.stock_actuel, 90)

    def test_vente_insufficient_stock(self):
        """Vérifie le blocage si stock insuffisant."""
        data = {
            "lignes": [
                {"medicament": self.med.id, "quantite": 150}
            ]
        }
        response = self.client.post(self.url_list, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
