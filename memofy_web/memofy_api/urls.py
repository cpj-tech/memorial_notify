from django.urls import path, include
from memofy_api.mf_schedule import ScheduleViewSet
from memofy_api import mf_schedule
from memofy_api import mf_token
from memofy_api import mf_contact
from rest_framework import routers

router = routers.DefaultRouter()
router.register('schedules', ScheduleViewSet)

urlpatterns = [
    path('auth/', include('djoser.urls.jwt')),
    path('update_nfdates/', mf_schedule.update_nfdates, name='mf_schedule.update_nfdates'),
    path('contact/', mf_contact.contact_post, name='mf_contact.contact_post'),
    path('get/token/', mf_token.get_token, name='mf_token.get_token'),
    path('', include(router.urls)),
]
