from django.urls import path, include

urlpatterns = [
    path('events/', include('apps.events.urls')),
]