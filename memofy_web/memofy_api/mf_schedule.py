import calendar
import datetime
import json
import logging
import traceback
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import viewsets
from django_filters import rest_framework as filters
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse


from .models import MemorialSchedule, Line
from .serializers import ScheduleSerializer

# log setting
logger = logging.getLogger(__name__)

class CustomFilter(filters.FilterSet):
    """Filters for searching the MemorialSchedule table

    Filter so that userid is a string type, exact match.
    Filter so that a range of dates can be specified.

    """
    Line_id = filters.CharFilter(field_name="Line_id__id", lookup_expr='exact')
    start_month = filters.DateTimeFilter(field_name="notification_date", lookup_expr='gte')
    end_month = filters.DateTimeFilter(field_name="notification_date", lookup_expr='lte')

    class Meta:
        model = MemorialSchedule
        fields = ['notification_date']


class ScheduleViewSet(viewsets.ModelViewSet):
    """API view set for MemorialSchedule

    Set the target of queryset to MemorialSchedule.
    Set ScheduleSerializer to serializer_class.
    Set IsAuthenticated to permission_classes.
    Set filter_class to CustomFilter.

    """
    queryset = MemorialSchedule.objects.all()
    serializer_class = ScheduleSerializer
    # JWTの認証済みユーザのみ
    # permission_classes = (AllowAny,)
    permission_classes = (IsAuthenticated,)
    filter_class = CustomFilter

    def get_queryset(self):
        """This is a function to filter API get requests by userid.

        Get the API Token from the request header.
        Get the userid from the Token information.
        Return the one filtered by userid from MemorialSchedule table.

        Returns:
            object: user's schedule information

        """
        logger.info('Start')
        token = self.request.META.get('HTTP_AUTHORIZATION', None)[4:]
        jwt_object = JWTAuthentication()
        validated_token = jwt_object.get_validated_token(token)
        line_id = jwt_object.get_user(validated_token)
        lineid = Line.objects.get(lineid=line_id)
        schedules = MemorialSchedule.objects.filter(Line_id=lineid.id)
        logger.info('End')
        return schedules


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_nfdates(request):
    """Update the notification_date in the MemorialSchedule table.

    Get the parameters from the post request.
    Get the schedules from the MemorialSchedule table using the request 'userid' and 'month'.
    If the request 'year' is different from the year of notification_date in MemorialSchedule table, update the table.

    Args:
        request (object) : request

    Returns:
        object: API response information

    """
    try:
        logger.info('Start')
        req_body = json.loads(request.body.decode('utf-8'))
        req_id = req_body['Line_id']
        req_disp_year = req_body['displayYear']
        req_disp_month = req_body['displayMonth']
        is_updated_flg = False
        memorial_schedules = MemorialSchedule.objects.filter(Line_id=Line(req_id), month=req_disp_month)
        if (len(memorial_schedules) > 0):
            for schedule in memorial_schedules:
                # カレンダー表示年とDB登録年が異なってる場合、スケジュールを更新
                if schedule.notification_date.year != req_disp_year:
                    if schedule.is_leap_year:
                        if calendar.isleap(req_disp_year):
                            schedule.notification_date = datetime.date(
                                req_disp_year, schedule.notification_date.month, 29)
                            schedule.save()
                        else:
                            schedule.notification_date = datetime.date(
                                req_disp_year, schedule.notification_date.month, 28)
                            schedule.save()
                    else:
                        schedule.notification_date = datetime.date(
                            req_disp_year, schedule.notification_date.month, schedule.notification_date.day)
                        schedule.save()
                    is_updated_flg = True

        if is_updated_flg:
            result = {'message': 'OK', 'data': 'MemorialSchedule table is updated'}
        else:
            result = {'message': 'OK', 'data': 'MemorialSchedule table is not updated'}

        response = JsonResponse(result)
        logger.info('End')
        return response

    except Exception as e:
        result = {'message': 'NG', 'data': str(e)}
        logger.error(e)
        logger.error(traceback.format_exc())
        return JsonResponse(result)
