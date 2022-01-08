from django.test import TestCase
from django.urls import reverse, resolve
from memofy_api import mf_schedule, mf_contact, mf_token


class TestUrls(TestCase):
    '''特定のURLでの動作が、そのURLのfunctionと一致しているか
    ・TestCaseクラス　：　Djangoに標準的に組み込まれているunittestの拡張機能。最初にインポートしておき、今後作成するテストクラスはこのTestCaseクラスを継承します。
    ・reverse関数　：　引数のURLを返します。
    ・resolve関数　：　URLのpathをResolveMatchオブジェクトにして返す。このオブジェクトからURLの様々な情報にアクセスできる。
    ・func　：　ResolveMatchオブジェクトのURLを使用するために使われる関数を示す。
    ・assertEqual関数　：　第一引数と第二引数の値が等しいかどうかを返す。
    '''
    def test_update_nfdates_url(self):
        url = reverse('mf_schedule.update_nfdates')
        self.assertEqual(resolve(url).func, mf_schedule.update_nfdates)

    def test_contact_url(self):
        url = reverse('mf_contact.contact_post')
        self.assertEqual(resolve(url).func, mf_contact.contact_post)

    def test_get_token_url(self):
        url = reverse('mf_token.get_token')
        self.assertEqual(resolve(url).func, mf_token.get_token)

