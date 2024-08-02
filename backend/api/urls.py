from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    path('api/user/', views.UserDetailView.as_view(), name='user-detail'),
    path('api/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/create-post/', views.CreatePostView.as_view(), name='create-post'),
    path('api/all-posts/', views.ListPostView.as_view(), name='list-post'),

]
