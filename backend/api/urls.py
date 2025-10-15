from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    # Auth
    path('api/user/', views.UserDetailView.as_view(), name='user-detail'),
    path('api/token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    # Posts
    path('api/create-post/', views.CreatePostView.as_view(), name='create-post'),
    path('api/all-posts/', views.ListPostView.as_view(), name='list-post'),
    path('api/posts/<int:pk>/', views.UpdatePostView.as_view(), name='update-post'),
    # Profile
    path('api/profile/<str:username>/', views.ProfileView.as_view(), name='profile'),
    # Follow and Unfollow
    path('api/profile/<str:username>/follow/', views.FollowToggleView.as_view(), name='follow-toggle'),
    path('api/following-posts/', views.FollowingListView.as_view(), name='following-posts'),
]
