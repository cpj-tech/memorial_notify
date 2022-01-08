"""line line_push
    * Push notification time
"""
import time
import logging
import traceback
from datetime import timedelta, date, datetime
from memofy_api.models import MemorialSchedule
from utils import config_info
from linebot.models import TextSendMessage

# log setting
logger = logging.getLogger(__name__)


def line_push(data, timing):
    """line_push()
        A function that pushes the argument list one by one.
        Args:
            push_data_list list:Store data to push
        Returns:
            sent_date_time: Returns the pushed time
    """
    logger.info("Start")
    send_message = f"予定：「{data.title}」の{timing}です。\n\n メモ：{data.memo}"
    message = TextSendMessage(text=send_message)
    line_id = data.Line_id.lineid
    config = config_info.GetConfigInfo()
    config.line_bot_api.push_message(line_id, message)
    logger.info(f"push message: {line_id}, {message}")
    logger.info("End")


def exists_match_timing(data, today, today_year, current_time):
    notification_timing_list = data.get_notification_timing_list()
    try:
        data_date = date(today_year, data.month, data.day)
    except:
        data_date = date(today_year, data.month, data.day-1)
    for timing in notification_timing_list:
        if any((
            (timing == '当日' and data_date == today),
            (timing == '1日前' and data_date + timedelta(days=-1) == today),
            (timing == '1週間前' and data_date + timedelta(days=-7) == today),
            (timing == '1か月前' and data_date   + timedelta(days=-30) == today)
        )):
            if data.get_notification_time_display() == current_time:
                return timing
    return None


def db_polling():
    """db_polling()
        A function that gets the DB value at 10-second intervals and
        pushes line when the notification time matches.
    """
    logger.info('Start')
    sent_time = ''
    sent_id_list = []
    try:
        while True:
            start = time.time()
            today = date.today()
            today_year = today.year
            today_month = today.month
            current_time = str(datetime.now().time())[0:5]
            queryset = MemorialSchedule.objects.filter(
                month__gte=today_month, month__lte=today_month+1)
            if queryset:
                for data in queryset:
                    timing = exists_match_timing(data, today, today_year, current_time)
                    if all((
                        (timing),
                        (sent_time != current_time or data.id not in sent_id_list)
                    )):
                        line_push(data, timing)
                        sent_time = str(datetime.now().time())[0:5]
                        sent_id_list.append(data.id)
                        logger.info(f'sent time:{sent_time}, sent memorialshcedule id list: {sent_id_list}')
            if sent_time != current_time:
                sent_id_list = []
            elapsed_time = time.time() - start
            logger.debug("elapsed_time:{0}".format(elapsed_time) + "[sec]")
            time.sleep(10)
    except Exception as e:
        logger.error(e)
        logger.error(traceback.format_exc())
