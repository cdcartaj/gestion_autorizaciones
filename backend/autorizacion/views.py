from rest_framework import viewsets
from .models import Autorizacion
from .serializers import AutorizacionSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .serializers import UsuarioSerializer
from django.contrib.auth.models import User
# Create your views here.

class AutorizacionViewSet(viewsets.ModelViewSet):
    queryset = Autorizacion.objects.all().order_by('-creado')
    serializer_class = AutorizacionSerializer
    permission_classes = [IsAuthenticated]
    
class RegistroUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = []  # acceso público

