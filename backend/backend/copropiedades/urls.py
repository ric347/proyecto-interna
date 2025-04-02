from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CopropiedadViewSet,
    UsuarioViewSet,
    AccesoVisitanteViewSet,
    login_view,
    user_info,
    residencias_por_copropiedad,  # 🔹 Importar la vista
)

router = DefaultRouter()
router.register(r'copropiedades', CopropiedadViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'accesos', AccesoVisitanteViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', login_view, name="login"),
    path('api/user/', user_info, name="user_info"),
    path('api/residencias_por_copropiedad/', residencias_por_copropiedad, name="residencias_por_copropiedad"),
]
