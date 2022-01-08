from django.test import TestCase
from ..models import Line
from .test_scheduleviewset import create_lineuser, create_lineid

# エンドポイント
POST_CONTACT_URL = '/api/contact/'


class ContactPostApiTests(TestCase):
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

    def test_post_contact_normal_1(self):
        testcase = 'test_post_contact_normal_1'
        url = POST_CONTACT_URL
        create_lineid("lineid10")
        lineid6 = Line.objects.get(lineid="lineid10")
        create_lineuser(lineid6, 'pass', 'test_user10')
        # contactをラインでお知らせできるようにする？改善点になるけど
        data = {
            'userid': 1,
            'category': 'アプリの不具合',
            'email': 'kasamayoshiki@gmail.com',
            'message': '直してください'
        }
        self.before_log(testcase, url, data)
        response = self.client.post(url, data=data, content_type="application/json")
        self.after_log(response)
        self.assertEqual(response.status_code, 200)

       