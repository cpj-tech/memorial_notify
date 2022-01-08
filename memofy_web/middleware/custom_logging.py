"""middleware custom_logging.py
    * Used for log output 
"""

import logging
import threading
import json
from rest_framework_simplejwt.authentication import JWTAuthentication

local = threading.local()


class CustomAttrMiddleware:
    """CustomAttrMiddleware"""

    def __init__(self, get_response):
        """__init__()

            __init__ function

        """

        self.get_response = get_response

    def __call__(self, request):
        """__call__()

        Get the username of the request when requesting from the client
        Temporarily saved in threading.local ()

            Args:
                self : instance
                request : request

            Returns:
                returns the line login request

        """
        from memofy_api import models
        if "update_nfdates" in request.path:
            req_body = json.loads(request.body.decode('utf-8'))
            req_id = req_body["Line_id"]
            Line = models.Line.objects.get(id=req_id)
            LineUser = models.LineUser.objects.get(Line_lineid=Line.lineid)
            username = LineUser.username
        elif "schedules" in request.path:
            token = request.META.get("HTTP_AUTHORIZATION", None)[4:]
            jwt_object = JWTAuthentication()
            validated_token = jwt_object.get_validated_token(token)
            line_id = jwt_object.get_user(validated_token)
            Line = models.Line.objects.get(lineid=line_id)
            LineUser = models.LineUser.objects.get(Line_lineid=Line.lineid)
            username = LineUser.username
        elif "contact" in request.path and request.method == "POST":
            req_body = json.loads(request.body.decode('utf-8'))
            userid = req_body["userid"]
            Line_obj = models.Line.objects.get(id=userid)
            LineUser_obj = models.LineUser.objects.get(Line_lineid=Line_obj.lineid)
            username = LineUser_obj.username
        elif "/api/auth/jwt/create" in request.path:
            username = "jwt/create"
        else:
            username = "not found"
        setattr(local, "username", username)
        response = self.get_response(request)

        # Clear at the time of response
        setattr(local, "username", None)

        return response


class CustomAttrFilter(logging.Filter):
    """CustomAttrFilter"""

    def filter(self, record):
        """filter()"""
        record.username = getattr(local, 'username', None)
        return True
