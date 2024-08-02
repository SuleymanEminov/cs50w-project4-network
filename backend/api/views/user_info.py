from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics

from ..models import User
from ..serializers import *



class UserDetailView(generics.RetrieveAPIView):
     permission_classes = (IsAuthenticated, )
     serializer_class = UserSerializer

     def get_object(self):
          return self.request.user
     
