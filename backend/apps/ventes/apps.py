"""AppConfig for the ventes application."""

from django.apps import AppConfig


class VentesConfig(AppConfig):
    """Configuration for the ventes app."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.ventes'
    label = 'ventes'
