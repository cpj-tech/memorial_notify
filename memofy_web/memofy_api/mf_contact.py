import logging
import json
import textwrap
import traceback
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.conf import settings
from django.core.mail import EmailMessage
from .models import Line, LineUser

# log setting
logger = logging.getLogger(__name__)


@csrf_exempt
@api_view(["POST"])
def contact_post(request):
    """Inquiry content acquisition and mail transmission processing

    Get the parameters from the post request.
    If the information entered in the form is correct, an inquiry completion e-mail is sent to the user.
    Otherwise, it returns an HTTP response error.

    Args:
        request (object): request

    Returns:
        object: API response information.

    """

    try:
        logger.info('Start')
        req_body = json.loads(request.body.decode('utf-8'))
        userid = req_body['userid']
        Line_obj = Line.objects.get(id=userid)
        LineUser_obj = LineUser.objects.get(Line_lineid=Line_obj.lineid)
        username = LineUser_obj.username
        email = req_body['email']
        category = ""
        if category == req_body['category']:
            category = "アプリの不具合"
        elif category == req_body['category']:
            category = "アイデア・機能のご提案"
        else:
            category = "その他"

        message = req_body['message']
        subject = 'memorial notify お問い合わせ完了のお知らせ'
        contact = textwrap.dedent('''

            ※このメールはシステムからの自動返信です。

            {username} 様

            お問い合わせありがとうございました。
            以下のの内容でお問い合わせを受け付けました。
            内容を確認させていただき、ご返信させて頂きますので、少々お待ち下さい。

            - - - - - - - - - - - - - - - - - - - -
            ■お名前
            {username}

            ■メールアドレス
            {email}

            ■カテゴリー
            {category}

            ■メッセージ
            {message}
            - - - - - - - - - - - - - - - - - - - -
            ''').format(username=username, email=email, message=message, category=category)

        to_list = [email]
        bcc_list = [settings.EMAIL_HOST_USER]

        message = EmailMessage(
            subject=subject, body=contact, to=to_list, bcc=bcc_list)
        message.send()
        result = {'message': 'OK', 'data': ''}
        response = JsonResponse(result)
        logger.info('End')
        return response

    except Exception as e:
        logger.error(e)
        logger.error(traceback.format_exc())
        result = {'message': 'NG', 'data': str(e)}
        return JsonResponse(result)
