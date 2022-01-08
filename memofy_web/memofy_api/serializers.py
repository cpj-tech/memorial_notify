import calendar
import datetime
import logging
from rest_framework import serializers
from rest_framework import fields
from .models import Line, MemorialSchedule

# log setting
logger = logging.getLogger(__name__)

class CustomMultipleChoiceField(fields.MultipleChoiceField):
    """Enabling multiple list-type inputs

    Allow multiple selection of the received argument value.

    Return:
        list: Value of the argument value converted to a list type.

    """
    def to_representation(self, value):
        return list(super().to_representation(value))


class ScheduleSerializer(serializers.ModelSerializer):
    """Serializers for the MemorialSchedule table

    Control the input and output of each parameter.

    """

    notification_timing = CustomMultipleChoiceField(choices=MemorialSchedule.NOTIFICATION_TIMING)
    Line_id = serializers.PrimaryKeyRelatedField(label='LineID', queryset=Line.objects.all())
    is_leap_year = serializers.BooleanField(read_only=True)
    month = serializers.IntegerField(read_only=True)
    day = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

    class Meta:
        model = MemorialSchedule
        fields = [
            'id',
            'Line_id',
            'title',
            'is_leap_year',
            'notification_date',
            'month',
            'day',
            'notification_timing',
            'notification_time',
            'memo',
            'created_at',
            'updated_at'
        ]

    def create(self, validated_data):
        """
        Insert default values for 'month' and 'day' fields during creation.

        Args:
            validated_data (object): When requesting create, the request parameter

        Returns:
            list: user's schedule information

        """
        logger.info('Start')
        is_leap_year = False
        notification_data = validated_data.get('notification_date')
        if calendar.isleap(notification_data.year):
            if notification_data == datetime.date(notification_data.year, 2, 29):
                is_leap_year = True
        month = notification_data.month
        day = notification_data.day
        memorial_schedule = MemorialSchedule.objects.create(month=month, day=day, is_leap_year=is_leap_year, **validated_data)
        logger.info('End')
        return memorial_schedule

    def update(self, instance, validated_data):
        """Insert default values for 'month' and 'day' fields during update.

        Args:
            validated_data (object): When requesting update, the request parameter

        Returns:
            object: user's schedule information

        """
        logger.info('Start')
        instance.title = validated_data.get('title', instance.title)
        instance.notification_date = validated_data.get('notification_date', instance.notification_date)
        instance.notification_timing = validated_data.get('notification_timing', instance.notification_timing)
        instance.notification_time = validated_data.get('notification_time', instance.notification_time)
        instance.memo = validated_data.get('memo', instance.memo)
        if calendar.isleap(instance.notification_date.year):
            if instance.notification_date == datetime.date(instance.notification_date.year, 2, 29):
                instance.is_leap_year = True
        instance.month = instance.notification_date.month
        instance.day = instance.notification_date.day
        instance.save()
        logger.info('End')
        return instance
