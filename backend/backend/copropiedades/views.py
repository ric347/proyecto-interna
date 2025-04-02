from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .models import Copropiedad, AccesoVisitante, Residencia  # 🔹 Cambiado Apartamento → Residencia
from .serializers import CopropiedadSerializer, UsuarioSerializer, AccesoVisitanteSerializer, ResidenciaSerializer  # 🔹 Agregar ResidenciaSerializer

User = get_user_model()

@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:
        if not user.is_active:
            return Response({"error": "Cuenta inactiva"}, status=403)

        refresh = RefreshToken.for_user(user)
        
        # Serializar datos del usuario
        user_data = UsuarioSerializer(user).data

        # Agregar datos adicionales
        user_data['copropiedad_id'] = user.copropiedad.id if user.copropiedad else None
        user_data['residencia'] = ResidenciaSerializer(user.residencia).data if user.residencia else None  # 🔹 Serializar residencia

        return Response({
            "token": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user_data
        })

    return Response({"error": "Credenciales inválidas"}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    user = request.user
    return Response({
        "id": user.id,  
        "username": user.username,
        "rol": user.rol,
        "copropiedad": {
            "id": user.copropiedad.id if user.copropiedad else None,
            "nombre": user.copropiedad.nombre if user.copropiedad else None
        },
        "residencia": ResidenciaSerializer(user.residencia).data if user.residencia else None  # 🔹 Serializar residencia
    })


class CopropiedadViewSet(viewsets.ModelViewSet):
    queryset = Copropiedad.objects.all()
    serializer_class = CopropiedadSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        rol = self.request.query_params.get("rol")
        if rol:
            return User.objects.filter(rol=rol)
        return super().get_queryset()


class AccesoVisitanteViewSet(viewsets.ModelViewSet):
    queryset = AccesoVisitante.objects.all()
    serializer_class = AccesoVisitanteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """El guarda crea el acceso asignándolo al residente correcto según la residencia."""
        user = self.request.user

        # Verificar que el usuario es un guarda
        if user.rol != "guarda":
            raise PermissionError("Solo los guardas pueden registrar accesos")  # 🔹 Mejor uso de excepción

        # Obtener la residencia desde el request
        residencia_id = self.request.data.get("residencia")

        try:
            residencia = Residencia.objects.get(id=residencia_id)
            residente = residencia.residente if hasattr(residencia, "residente") else None  # 🔹 Validar si existe el residente
        except Residencia.DoesNotExist:
            return Response({"error": "No existe una residencia con este ID"}, status=400)

        if not residente:
            return Response({"error": "Esta residencia no tiene un residente asignado"}, status=400)

        # Guardar el acceso con el residente correcto
        serializer.save(residente=residente)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # 🔹 Protege la ruta con autenticación
def residencias_por_copropiedad(request):
    copropiedad_id = request.GET.get('copropiedad_id')  # Obtener parámetro de la URL
    if not copropiedad_id:
        return Response({"error": "Falta el parámetro 'copropiedad_id'"}, status=400)

    residencias = Residencia.objects.filter(copropiedad_id=copropiedad_id)
    serializer = ResidenciaSerializer(residencias, many=True)
    return Response(serializer.data)
