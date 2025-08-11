from rest_framework.routers import DefaultRouter
from .views import AutorizacionViewSet
from django.urls import path, include
from .views import RegistroUsuarioView

router = DefaultRouter()
router.register(r'autorizacion', AutorizacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('registro/', RegistroUsuarioView.as_view(), name='registro'),
    #path('registro/', RegistroView.as_view(), name='registro'),
]

