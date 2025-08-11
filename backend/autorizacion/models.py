from django.db import models
from django.utils import timezone

# Create your models here.
# Create your models here.
class Autorizacion(models.Model):
    ESTADOS = [
        ('en_gestion','En Gestión'),
        ('autorizado','Autorizado'),
        ('finalizado','Finalizado'),
    ]
    
    responsable = models.CharField(max_length=100)
    sin = models.IntegerField()
    jira = models.IntegerField()
    nombre_jira = models.TextField()
    fecha_pap = models.DateField(default=timezone.now)
    autorizador1 = models.BooleanField(default=False)
    autorizador2 = models.BooleanField(default=False)
    autorizador3 = models.BooleanField(default=False)
    autorizador4 = models.BooleanField(default=False)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='en_gestion')
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.responsable