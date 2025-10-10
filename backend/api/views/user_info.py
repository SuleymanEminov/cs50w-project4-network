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
     

from rest_framework.pagination import PageNumberPagination

class ProfileView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        posts = Post.objects.filter(author=user).order_by('-created_at')

        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_posts = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(paginated_posts, many=True)

        profile_data = {
            'username': user.username,
            'followers': user.followers.count(),
            'following': user.following.count(),
            'posts': serializer.data,
            'is_following': Follow.objects.filter(follower=request.user, following=user).exists(),
            'is_self': request.user == user
        }
        return paginator.get_paginated_response(profile_data)


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
