from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from drf_spectacular.utils import extend_schema, OpenApiExample
from drf_spectacular.openapi import OpenApiTypes

from .models import User
from .serializers import UserSerializer, RegisterSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        request=RegisterSerializer,
        responses={201: UserSerializer},
        summary='Регистрация нового пользователя',
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary='Вход по email и паролю (получить JWT-токены)',
        request={'application/json': {'type': 'object', 'properties': {
            'email': {'type': 'string', 'format': 'email'},
            'password': {'type': 'string'},
        }, 'required': ['email', 'password']}},
        responses={200: UserSerializer},
    )
    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'error': 'Укажите email и пароль'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Неверный email или пароль'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.check_password(password):
            return Response(
                {'error': 'Неверный email или пароль'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary='Обновить access-токен по refresh-токену',
        request={'application/json': {'type': 'object', 'properties': {
            'refresh': {'type': 'string'},
        }, 'required': ['refresh']}},
    )
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'error': 'Укажите refresh-токен'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            refresh = RefreshToken(refresh_token)
            return Response({'access': str(refresh.access_token)})
        except TokenError as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary='Получить данные текущего пользователя',
        responses={200: UserSerializer},
    )
    def get(self, request):
        return Response(UserSerializer(request.user).data)


# ─── Admin user views ─────────────────────────────────────────────────────────

class UserAdminListView(generics.ListAPIView):
    """GET /api/admin/users — список всех пользователей."""
    queryset = User.objects.order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class UserAdminDetailView(generics.RetrieveUpdateAPIView):
    """GET + PATCH /api/admin/users/{id} — детали + изменение is_staff/is_active."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_serializer(self, *args, **kwargs):
        # Разрешаем частичное обновление через PATCH
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)

    def update(self, request, *args, **kwargs):
        # Ограничиваем изменяемые поля до is_staff и is_active
        allowed = {'is_staff', 'is_active'}
        data = {k: v for k, v in request.data.items() if k in allowed}
        user = self.get_object()
        for field, value in data.items():
            setattr(user, field, value)
        user.save(update_fields=list(data.keys()))
        return Response(UserSerializer(user).data)
