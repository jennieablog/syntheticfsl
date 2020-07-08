from django.urls import path
from . import views

urlpatterns = [
	# Assign a view called handshape to the Root URL.
	path('home/', views.index, name='index'),
	path('handshapes/', views.handshape_list, name='handshape_list'),
	# Assign a view called handshape_detail when displaying a handshape.
	path('handshapes/<int:pk>/', views.handshape_detail, name='handshape_detail'),
	# Assign a view called handshape_new when creating a new handshape.
	path('handshapes/new/', views.handshape_new, name='handshape_new'),
	# Assign a view called handshape_edit when editing an existing handshape.
	path('handshapes/<int:pk>/edit', views.handshape_edit, name='handshape_edit'),
	path('handshapes/<int:pk>/delete',views.handshape_delete,name='handshape_delete'),
]