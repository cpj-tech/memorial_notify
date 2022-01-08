"""module config_info.py
    * Class get Config Information
"""
import configparser
from linebot import LineBotApi


class GetConfigInfo(object):
    """GetConfigInfo"""

    def __init__(self):
        self._line_channel_id = None
        self._line_channel_secret = None
        self._redirect_uri_calendar = None
        self._redirect_uri_contact = None
        self._line_bot_api = None
        self._default_email = None
        self._restapi_auth_url = None
        self._getSettingValue()

    @property
    def line_channel_id(self):
        return self._line_channel_id

    @property
    def line_channel_secret(self):
        return self._line_channel_secret

    @property
    def redirect_uri_calendar(self):
        return self._redirect_uri_calendar

    @property
    def redirect_uri_contact(self):
        return self._redirect_uri_contact

    @property
    def line_bot_api(self):
        return self._line_bot_api

    @property
    def default_email(self):
        return self._default_email
    
    @property
    def restapi_auth_url(self):
        return self._restapi_auth_url

    def _getSettingValue(self):
        config_ini = configparser.ConfigParser()
        config_ini.read('config/config.ini', encoding='utf-8')
        line_login = config_ini['Line Login']
        self._line_channel_id = line_login['CHANNEL_ID']
        self._line_channel_secret = line_login['CHANNEL_SECRET']
        self._redirect_uri_calendar = line_login['REDIRECT_URI_CALENDAR']
        self._redirect_uri_contact = line_login['REDIRECT_URI_CONTACT']

        line_messaging_api = config_ini['LINE Messaging API']
        self._line_bot_api = LineBotApi(
            line_messaging_api['CHANNEL_ACCESS_TOKEN']
        )

        memofy_web = config_ini['Memofy Web']
        self._default_email = memofy_web['DEFAULT_EMAIL']
        self._restapi_auth_url = memofy_web['RESTAPI_AUTH_URL']
        
