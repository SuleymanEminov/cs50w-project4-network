from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.views import APIView

from ..models import User, Follow, Post
from ..serializers import *



class UserDetailView(generics.RetrieveAPIView):
     permission_classes = (IsAuthenticated, )
     serializer_class = UserSerializer

     def get_object(self):
          return self.request.user
     

class ProfileView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        posts = Post.objects.filter(author=user).order_by('-created_at')
        profile_data = {
            'username': user.username,
            'followers': user.followers.count(),
            'following': user.following.count(),
            'posts': [
                {'id': post.id, 
                'content': post.content, 
                'created_at': post.created_at, 
                'likes': post.likes
                } for post in posts
            ],
            'is_following': request.user in user.followers.all(),
            'is_self': request.user == user
        }
        return JsonResponse(profile_data)


# Follow and Unfollow endpoints

class FollowToggleView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, username):
        target = get_object_or_404(User, username=username)
        if target == request.user:
            return JsonResponse({'detail': "You can't follow yourself."}, status=400)

        rel, created = Follow.objects.get_or_create(follower=request.user, following=target)
        if not created:
            rel.delete()
            is_following = False
        else:
            is_following = True

        return JsonResponse({
            'is_following': is_following,
            'followers': target.followers.count(),
            'following': target.following.count(),
        })
