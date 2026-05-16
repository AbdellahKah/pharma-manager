"""AppConfig for the medicaments application."""

from django.apps import AppConfig


class MedicamentsConfig(AppConfig):
    """Configuration for the medicaments app."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.medicaments'
    label = 'medicaments'
