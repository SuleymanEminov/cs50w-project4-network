from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin

from ..models import User
from ..serializers import *



class UserDetailView(generics.RetrieveAPIView):
     permission_classes = (IsAuthenticated, )
     serializer_class = UserSerializer

     def get_object(self):
          return self.request.user
     

class ProfileView(LoginRequiredMixin):

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        posts = Post.objects.filter(author=user).order_by('-created_at')
        profile_data = {
            'username': user.username,
            'followers': user.followers.count(),
            'following': user.following.count(),
            'posts': [{'id': post.id, 'content': post.content, 'created_at': post.created_at, 'likes': post.likes} for post in posts],
            'is_following': request.user in user.followers.all()
        }
        return JsonResponse(profile_data)
