from django.test import TestCase
from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient
from rest_framework import status
from ..models import MemorialSchedule, Line, LineUser
from datetime import datetime, timedelta, timezone
from ..serializers import ScheduleSerializer

# タイムゾーンの生成
JST = timezone(timedelta(hours=+9))
# エンドポイント
SCHEDULES_URL = '/api/schedules/'
TOKEN_URL = '/api/auth/jwt/create'


def create_lineuser(lineid, password, username):
    return LineUser.objects.create(
            Line_lineid=lineid,
            password=make_password(password),
            username=username,
        )


# LineIdを作成する関数
def create_lineid(lineid):
    return Line.objects.create(
        lineid=lineid
    )


# Scheduleを作成する関数
def create_schedules(Line_id, title, notification_date, month, day, notification_timing, notification_time, memo, is_leap_year):
    return MemorialSchedule.objects.create(
        Line_id=Line_id,
        title=title,
        notification_date=notification_date,
        month=month,
        day=day,
        notification_timing=notification_timing,
        notification_time=notification_time,
        memo=memo,
        is_leap_year=is_leap_year
    )


class ScheduleViewSetApiTests(TestCase):
    def setUp(self):
        '''setup methodは各テスト前に必ず実行されるmethod'''
        self.client = APIClient()

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

    # GETメソッド(1)
    # 複数のscheduleを取得
    def test_1_1_should_get_schedules(self):
        url = SCHEDULES_URL
        testcase = 'test_1_1_should_get_schedules'
        data = None
        create_lineid("lineid1")
        lineid1 = Line.objects.get(lineid="lineid1")
        create_lineuser(lineid1, 'pass','test_user1')
        param = {'Line_lineid': 'lineid1', 'password': 'pass'}
        response = self.client.post(TOKEN_URL, data=param)
        token = response.data['access']
        create_schedules(
            Line_id=lineid1,
            title="test1",
            notification_date=datetime.now(JST).date(),
            month=datetime.now(JST).date().month,
            day=datetime.now(JST).date().day,
            notification_timing="0",
            notification_time="12",
            memo="test1",
            is_leap_year=False
        )
        create_schedules(
            Line_id=lineid1,
            title="test2",
            notification_date=datetime.now(JST).date(),
            month=datetime.now(JST).date().month,
            day=datetime.now(JST).date().day,
            notification_timing="0",
            notification_time="10",
            memo="test2",
            is_leap_year=False
        )
        self.before_log(testcase, url, data)
        token = "JWT " + token
        res = self.client.get(url, **{'HTTP_AUTHORIZATION': token})
        self.after_log(res)
        # res_data = json.loads(res._container[0].decode())
        # res_data = res_data[0]
        schedules = MemorialSchedule.objects.all().order_by('id')
        serializer = ScheduleSerializer(schedules, many=True)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

        # GETメソッド(2)
    # 特定のscheduleを取得
    def test_1_2_should_get_single_schedule(self):
        testcase = 'test_1_2_should_get_single_schedule'
        create_lineid("lineid2")
        lineid2 = Line.objects.get(lineid="lineid2")
        create_lineuser(lineid2, 'pass','test_user2')
        param = {'Line_lineid': 'lineid2', 'password': 'pass'}
        response = self.client.post(TOKEN_URL, data=param)
        token = response.data['access']
        schedule = create_schedules(
            Line_id=lineid2,
            title="test3",
            notification_date=datetime.now(JST).date(),
            month=datetime.now(JST).date().month,
            day=datetime.now(JST).date().day,
            notification_timing="0",
            notification_time="12",
            memo="test3",
            is_leap_year=False
        )
        url = f'{SCHEDULES_URL}{schedule.id}/'
        data = None
        self.before_log(testcase, url, data)
        token = "JWT " + token
        res = self.client.get(url, **{'HTTP_AUTHORIZATION': token})
        self.after_log(res)
        serializer = ScheduleSerializer(schedule)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

        # POSTメソッド(1)
    # 新規でscheduleを作成
    def test_1_3_should_create_new_schedule(self):
        create_lineid("lineid3")
        lineid3 = Line.objects.get(lineid="lineid3")
        create_lineuser(lineid3, 'pass', 'test_user3')
        param = {'Line_lineid': 'lineid3', 'password': 'pass'}
        response = self.client.post(TOKEN_URL, data=param)
        token = response.data['access']
        payload = {
            "Line_id": lineid3.id,
            "title": "test4",
            "notification_date": datetime.now(JST).date(),
            "notification_timing": "0",
            "notification_time": "12",
            "memo": "test4"
        }
        url = SCHEDULES_URL
        testcase = 'test_1_3_should_create_new_schedule'
        self.before_log(testcase, url, payload)
        token = "JWT " + token
        res = self.client.post(url, data=payload, **{'HTTP_AUTHORIZATION': token})
        self.after_log(res)
        exists = MemorialSchedule.objects.filter(
            Line_id=payload['Line_id']
        ).exists()

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(exists)

    # PATCHメソッド
    def test_1_4_should_partial_update_schedule(self):
        testcase = 'test_1_4_should_partial_update_schedule'
        create_lineid("lineid4")
        lineid4 = Line.objects.get(lineid="lineid4")
        create_lineuser(lineid4, 'pass','test_user4')
        param = {'Line_lineid': 'lineid4', 'password': 'pass'}
        response = self.client.post(TOKEN_URL, data=param)
        token = response.data['access']
        schedule = create_schedules(
            Line_id=lineid4,
            title="test5",
            notification_date=datetime.now(JST).date(),
            month=datetime.now(JST).date().month,
            day=datetime.now(JST).date().day,
            notification_timing="0",
            notification_time="12",
            memo="test5",
            is_leap_year=False
        )
        before_object = MemorialSchedule.objects.get(Line_id=lineid4)
        payload = {
            "title": "test6",
            "notification_date": datetime.now(JST).date(),
            "notification_timing": "0",
            "notification_time": "12",
            "memo": "test6"
        }
        url = f'{SCHEDULES_URL}{schedule.id}/'
        self.before_log(testcase, url, payload)
        token = "JWT " + token
        res = self.client.patch(url, data=payload, **{'HTTP_AUTHORIZATION': token})
        self.after_log(res)
        before_object.refresh_from_db()

        self.assertEqual(before_object.title, payload['title'])

    # DELETEメソッド
    def test_1_5_should_delete_schedule(self):
        testcase = 'test_1_5_should_delete_schedule'
        create_lineid("lineid5")
        lineid5 = Line.objects.get(lineid="lineid5")
        create_lineuser(lineid5, 'pass','test_user5')
        param = {'Line_lineid': 'lineid5', 'password': 'pass'}
        response = self.client.post(TOKEN_URL, data=param)
        token = response.data['access']
        schedule = create_schedules(
            Line_id=lineid5,
            title="test7",
            notification_date=datetime.now(JST).date(),
            month=datetime.now(JST).date().month,
            day=datetime.now(JST).date().day,
            notification_timing="0",
            notification_time="12",
            memo="test7",
            is_leap_year=False
        )
        self.assertEqual(1, MemorialSchedule.objects.count())
        url = f'{SCHEDULES_URL}{schedule.id}/'
        data = None
        self.before_log(testcase, url, data)
        token = "JWT " + token
        res = self.client.delete(url, **{'HTTP_AUTHORIZATION': token})
        self.after_log(res)

        self.assertEqual(0, MemorialSchedule.objects.count())
