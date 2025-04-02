from rest_framework import serializers
from .models import Copropiedad, Usuario, AccesoVisitante, Residencia

class ResidenciaSerializer(serializers.ModelSerializer):
    residente = serializers.SerializerMethodField()
    class Meta:
        model = Residencia
        fields = ['id', 'nombre', 'copropiedad', 'residente']

    def get_residente(self, obj):
        try:
            residente = Usuario.objects.get(residencia=obj)
            return f'{residente.first_name} {residente.last_name}'
        except:
            return 'Sin residente'

class CopropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Copropiedad
        fields = '__all__'  

class UsuarioSerializer(serializers.ModelSerializer):
    residencia = ResidenciaSerializer(read_only=True)  # 🔹 Serializa en vez de devolver solo None
    copropiedad_id = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'rol', 'copropiedad', 'copropiedad_id', 'residencia']

    def get_copropiedad_id(self, obj):
        return obj.copropiedad.id if obj.copropiedad else None

class AccesoVisitanteSerializer(serializers.ModelSerializer):
    residente = UsuarioSerializer(read_only=True)  # 🔹 Serializa el residente completo
    residencia = ResidenciaSerializer(source="residente.residencia", read_only=True)  # 🔹 Serializa la residencia
    residente_nombre = serializers.CharField(source="residente.username", read_only=True)  # 🔹 Obtiene directamente el nombre

    class Meta:
        model = AccesoVisitante
        fields = ['visitante_nombre', 'documento', 'estado', 'residente', 'residente_nombre', 'residencia', 'fecha_hora']
