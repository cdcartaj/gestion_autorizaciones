from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Autorizacion

class AutorizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autorizacion
        fields = '__all__'
    
# Usar User.objects.create_user en lugar de instanciar y llamar a set_password manualmente, 
# así aprovechas la lógica interna de Django para validación y encriptación.
# Evitar KeyError usando validated_data.get() por si algún campo no viene.
# Asegurarte que email no sea obligatorio si no lo quieres (o sí, si es requisito).

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data.get('username'),
            password=validated_data.get('password'),
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agrega campos personalizados
        token['username'] = user.username
        token['password'] = user.password
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email

        return token
