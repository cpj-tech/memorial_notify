import os
import json
import threading
import logging
import traceback
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from datetime import date
from linebot.models import TextSendMessage
from utils import config_info
from line import line_push
from memofy_api.models import MemorialSchedule, Line


# log setting
logger = logging.getLogger(__name__)

# polling the DB and push the data of the notification time that matches the current time.
t1 = threading.Thread(target=line_push.db_polling)
t1.start()


def line_login(request):
    """line_login()

        A function that executes a line login request.

        Args:
            request : request

        Returns:
            returns the line login request

    """
    random_state = os.urandom(16)
    config = config_info.GetConfigInfo()
    redirect_uri = ""
    if "calendar" in request.path:
        redirect_uri = config.redirect_uri_calendar
    elif "contact" in request.path:
        redirect_uri = config.redirect_uri_contact
    channel_id = config.line_channel_id
    return redirect(
        'https://access.line.me/oauth2/v2.1/authorize?response_type=code'
        f'&client_id={channel_id}&redirect_uri={redirect_uri}&state={random_state}'
        '&scope=openid%20profile')


def make_reply_message(line_id, today_month):
    """make_reply_message()
        Function to set line_push information to dict
        Args:
            line_id str: line_id
            text str: message obtained from line

        Returns:
            Arrange the message in the form for line_push
    """
    logger.info('Start')
    reply_data = ""
    line_id_obj = Line.objects.get(lineid=line_id)
    queryset = MemorialSchedule.objects.filter(
        Line_id=line_id_obj.id, month=today_month).order_by('day')
    for data in queryset:
        reply_data = reply_data + \
            f'{data.month}月 {data.day}日 　{data.title}\n        {data.memo}'
        reply_data = reply_data + \
            '\n----------------------------------------------------------\n'
    reply_message = '1ヶ月の予定は以下になります。'
    reply_message = reply_message + \
        '\n\n----------------------------------------------------------\n'
    reply_message = reply_message + reply_data
    logger.info('End')
    return reply_message


def reply_push(user_id, reply_message):
    """richmenu_push()
        Function to push memorial schedule for 1 week or 1 month
        Args:
            user_id　str : line_id to push
            reply_message str: Weekly or monthly memorial schedule information
    """
    logger.info('Start')
    message = TextSendMessage(text=reply_message)
    config = config_info.GetConfigInfo()
    config.line_bot_api.push_message(user_id, message)
    logger.info(f"push user_id: {user_id}")
    logger.info('End')


@csrf_exempt
def callback(request):
    """callback()
        Called when receiving a line_message or deleting a line account.
        Args:
            request: request
        Returns:
            Arrange the message in the form for line_push
    """
    try:
        logger.info('Start')
        if request.method == 'POST':
            request_json = json.loads(request.body.decode('utf-8'))
            events = request_json['events']
            line_id = events[0]['source']['userId']
            today_month = date.today().month
            if 'message' in events[0] and events[0]['message']['type'] == 'text':
                text = events[0]['message']['text']
                if all((
                    (text == '1ヶ月の予定'),
                    (len(Line.objects.filter(lineid=line_id)) != 0
                     and MemorialSchedule.objects.filter(month=today_month))
                )):
                    reply_message = make_reply_message(line_id, today_month)
                elif text != '1ヶ月の予定':
                    reply_message = '申し訳ございませんが、チャットでのお問い合わせには対応しておりません。'
                else:
                    reply_message = "今月の予定は登録されていません。"
                reply_push(line_id, reply_message)
            elif 'type' in events[0] and events[0]['type'] == 'unfollow':
                # When canceling friend registration
                Line.objects.filter(lineid=line_id).delete()
                logger.info('Account deleted')   
        logger.info('End')
        return HttpResponse()
    except Exception as e:
        logger.error(e)
        logger.error(traceback.format_exc())
