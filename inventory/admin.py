from django.contrib import admin

# Register your models here.

# Handshape model
from .models import Handshape, Sign
admin.site.register(Handshape)
admin.site.register(Sign)
