from django.contrib import admin 
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Copropiedad, Residencia , AccesoVisitante # Importamos Residencia

class UsuarioAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('rol', 'copropiedad', 'residencia')}),  # 🔹 Cambiamos 'apartamento' por 'residencia'
    )
    
    list_display = ('username', 'rol', 'copropiedad', 'residencia')  # 🔹 Mostramos 'residencia' en la lista de usuarios
    list_filter = ('rol', 'copropiedad')  # 🔹 Agregamos filtros para búsqueda rápida

admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Copropiedad)
admin.site.register(Residencia)  # 🔹 Registramos Residencia en el admin
admin.site.register(AccesoVisitante)