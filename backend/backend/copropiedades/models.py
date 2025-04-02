from django.contrib.auth.models import AbstractUser
from django.db import models

class Copropiedad(models.Model):
    nombre = models.CharField(max_length=255)
    direccion = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class Residencia(models.Model):
    nombre = models.CharField(max_length=50)  # Número de apartamento o casa
    copropiedad = models.ForeignKey(Copropiedad, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} - {self.copropiedad.nombre}"

class Usuario(AbstractUser):
    ROL_CHOICES = (
        ('guarda', 'Guarda'),
        ('residente', 'Residente'),
    )
    rol = models.CharField(max_length=10, choices=ROL_CHOICES)
    copropiedad = models.ForeignKey(Copropiedad, on_delete=models.CASCADE, null=True, blank=True)
    residencia = models.ForeignKey(Residencia, on_delete=models.SET_NULL, null=True, blank=True)  # Relación con residencia

    def __str__(self):
        return f"{self.username} ({self.rol})"

class AccesoVisitante(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('autorizado', 'Autorizado'),
        ('rechazado', 'Rechazado'),
    ]
    
    visitante_nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=20)
    residente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="accesos")  
    residencia = models.ForeignKey(Residencia, on_delete=models.CASCADE,blank=True, null=True)  # Asociamos la visita a una residencia
    fecha_hora = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='pendiente')

    def __str__(self):
        return f"{self.visitante_nombre} - {self.residencia.nombre} - {self.estado}"
