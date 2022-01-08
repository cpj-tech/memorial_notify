from django.test import TestCase
from ..models import Line
from .test_scheduleviewset import TOKEN_URL, create_lineuser, create_lineid, create_schedules
from datetime import datetime, timedelta, timezone

# エンドポイント
UPDATE_NFDATES_URL = '/api/update_nfdates/'
# タイムゾーンの生成
JST = timezone(timedelta(hours=+9))


class UpdateNfdatesApiTests(TestCase):
    def before_log(self, testcase, url, data):
        print('\n')
        print('--start---------------------------')
        print(f'testcase {testcase}')
        print(f'url {url}')
        print(f'data {data}')
        print('----------------------------------')
        print('\n')

    def after_log(self, response):
        print('\n')
        print('--result---------------------------')
        print(f' response.status_code: {response.status_code}')
        print(f' response.result: {response._container}')
        print('-----------------------------------')

    def test_post_update_nfdates_normal_1(self):
        testcase = 'test_post_update_nfdates_normal_1'
        url = UPDATE_NFDATES_URL
        create_lineid("lineid7")
        lineid7 = Line.objects.get(lineid="lineid7")
        create_lineuser(lineid7, 'pass', 'test_user7')
        param = {'Line_lineid': 'lineid7', 'password': 'pass'}
        response = self.client.post(TOKEN_URL, data=param)
        token = response.data['access']
        create_schedules(
            Line_id=lineid7,
            title="test8",
            notification_date=datetime.now(JST).date(),
            month=datetime.now(JST).date().month,
            day=datetime.now(JST).date().day,
            notification_timing="0",
            notification_time="12",
            memo="test8",
            is_leap_year=False
        )
        data = {
            'Line_id': 7, 'displayYear': 2021, 'displayMonth': 9
        }
        self.before_log(testcase, url, data)
        token = "JWT " + token
        response = self.client.post(url, data, content_type="application/json", **{'HTTP_AUTHORIZATION': token})
        self.after_log(response)
        self.assertEqual(response.status_code, 200)
