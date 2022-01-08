import json
import jwt
import requests
import string
import random
import logging
import traceback
from utils import config_info
from .models import Line, LineUser
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

# log setting
logger = logging.getLogger(__name__)


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def get_token(request):
    """Generate API Token.

    Get the parameters from the post request.
    GET the user infomation from the request parameter.
    When logging in for the first time, user information is registered in the LineUser table.
    GET the Token for API authentication from the user infomation.
    Return Token for API authentication.

    Args:
        request (object): request

    Returns:
        object: API response information.(Token)

    """
    try:
        logger.info("Start")
        req_body = json.loads(request.body.decode('utf-8'))
        req_code = req_body['code']
        req_isCalendar = req_body['isCalendar']
        config = config_info.GetConfigInfo()
        redirect_uri = ""
        if req_isCalendar:
            # calendarのlogin認証
            redirect_uri = config.redirect_uri_calendar
        else:
            redirect_uri = config.redirect_uri_contact
        uri_access_token = "https://api.line.me/oauth2/v2.1/token/"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        params = {
            "grant_type": "authorization_code",
            "code": req_code,
            "redirect_uri": redirect_uri,
            "client_id": config.line_channel_id,
            "client_secret": config.line_channel_secret,
        }

        # ログインユーザのトークンを取得
        res_linetoken = requests.post(
            uri_access_token, headers=headers, data=params)
        line_id_token = json.loads(res_linetoken.text)["id_token"]
        # トークン情報をデコードしてプロフィール取得
        user_profile = jwt.decode(line_id_token,
                                  config.line_channel_secret,
                                  audience=config.line_channel_id,
                                  issuer='https://access.line.me',
                                  algorithms=['HS256'])
        email = config.default_email
        if 'email' in user_profile:
            email = user_profile['email']
        random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        password = make_password(random_str)
        logger.info(user_profile)
        column_n = Line.objects.filter(lineid=user_profile['sub']).count()
        # 初回ログイン
        if column_n == 0:
            lineid = Line.objects.create(lineid=user_profile['sub'])
            LineUser.objects.create(
                Line_lineid=lineid,
                username=user_profile['name'],
                email=email,
                password=password
            )
        else:
            # 2回目以降のログイン
            lineuser = LineUser.objects.get(Line_lineid=Line(lineid=user_profile['sub']))
            lineuser.username = user_profile['name']
            lineuser.email = email
            lineuser.password = password
            lineuser.save()

        auth_param = {
            "Line_lineid": user_profile['sub'],
            "password": random_str,
        }
        auth_url = config.restapi_auth_url

        # Memofy API認証用のトークンを取得
        res_memofytoken = requests.post(auth_url, data=auth_param)
        memofy_api_token = json.loads(res_memofytoken.text)['access']
        line_obj = Line.objects.filter(lineid=user_profile['sub']).first()
        result = {'message': 'OK', 'token_api': memofy_api_token, 'userid': line_obj.id}
        response = JsonResponse(result)
        logger.info("End")
        return response

    except Exception as e:
        logger.error(e)
        logger.error(traceback.format_exc())
        result = {'message': 'NG', 'data': str(e)}
        return JsonResponse(result)



for i in range(10000):
    email = f'kasama{i}@gmail.com'
    
