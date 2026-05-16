"""
URL configuration for PharmaManager project.
"""

from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from apps.medicaments.views import MedicamentViewSet

urlpatterns = [
    path('admin/', admin.site.urls),

    # ── API v1 ────────────────────────────────────────────────────────────────
    path('api/v1/categories/', include('apps.categories.urls')),
    path('api/v1/medicaments/', include('apps.medicaments.urls')),
    path('api/v1/ventes/', include('apps.ventes.urls')),
    path('api/v1/alertes/', MedicamentViewSet.as_view({'get': 'alertes'}), name='alertes-direct'),

    # ── Authentication ────────────────────────────────────────────────────────
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ── API Documentation (Swagger) ───────────────────────────────────────────
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
