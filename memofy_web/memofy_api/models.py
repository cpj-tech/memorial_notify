from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, _user_has_perm
)
from django.utils import timezone
from multiselectfield import MultiSelectField


class Line(models.Model):
    """Line Model

    Define the columns of the LineId table.

    Args:
        id int : auto increment key
        lineid str : lineid

    """
    lineid = models.CharField('ラインID', max_length=150, unique=True)

    def __str__(self):
        return str(self.lineid)


class UserManager(BaseUserManager):
    def create_superuser(self, Line_lineid, username, email, password):
        now = timezone.now()
        lineid = Line.objects.get(lineid=Line_lineid)
        lineid.save()
        user = self.model(
            Line_lineid=lineid,
            username=username,
            email=email,
            is_active=True,
            is_staff=True,
            is_admin=True,
            date_joined=now,
            last_login=now
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class LineUser(AbstractBaseUser):
    """LineUser Model

    Define the columns of the LineUser table.

    Args:
        id int : auto increment key
        Line_lineid obj : Line.lineid
        username str : line username

    """

    Line_lineid = models.OneToOneField(Line, to_field='lineid', on_delete=models.CASCADE)
    username = models.CharField('ユーザ名', max_length=30, blank=True)
    email = models.EmailField('メールアドレス', max_length=255, blank=True)
    is_active = models.BooleanField('ユーザ権限', default=True)
    is_staff = models.BooleanField('スタッフ権限', default=False)
    is_admin = models.BooleanField('管理者権限', default=False)
    date_joined = models.DateTimeField('登録日時', default=timezone.now)
    last_login = models.DateTimeField('最終ログイン日時', default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'Line_lineid'
    REQUIRED_FIELDS = ['username', 'email']

    def user_has_perm(user, perm, obj):
        return _user_has_perm(user, perm, obj)

    def has_perm(self, perm, obj=None):
        return _user_has_perm(self, perm, obj=obj)

    def has_module_perms(self, app_label):
        return self.is_admin

    @property
    def is_superuser(self):
        return self.is_admin

    class Meta:
        swappable = 'AUTH_USER_MODEL'

    def __str__(self):
        return str(self.Line_lineid)


class MemorialSchedule(models.Model):
    """MemorialSchedule Model

    Define the columns of the MemorialSchedule table.

    Args:
        id int : auto increment key
        Line_id obj : Line.id
        title str : schedule title
    """

    NOTIFICATION_TIMING = (
        ("0", '当日'),
        ("1", '1日前'),
        ("2", '1週間前'),
        ("3", '1か月前')
    )

    NOTIFICATION_TIME = (
        ("0", '00:00'),
        ("1", '01:00'),
        ("2", '02:00'),
        ("3", '03:00'),
        ("4", '04:00'),
        ("5", '05:00'),
        ("6", '06:00'),
        ("7", '07:00'),
        ("8", '08:00'),
        ("9", '09:00'),
        ("10", '10:00'),
        ("11", '11:00'),
        ("12", '12:00'),
        ("13", '13:00'),
        ("14", '14:00'),
        ("15", '15:00'),
        ("16", '16:00'),
        ("17", '17:00'),
        ("18", '18:00'),
        ("19", '19:00'),
        ("20", '20:00'),
        ("21", '21:00'),
        ("22", '22:00'),
        ("23", '23:00'),
    )

    Line_id = models.ForeignKey(Line, to_field="id", on_delete=models.CASCADE)
    title = models.CharField('タイトル', max_length=50)
    notification_date = models.DateField('日付')
    month = models.IntegerField("月")
    day = models.IntegerField("日")
    notification_timing = MultiSelectField('通知タイミング', choices=NOTIFICATION_TIMING, max_choices=4, max_length=7)
    notification_time = models.CharField('通知時間', choices=NOTIFICATION_TIME, max_length=3)
    memo = models.TextField('メモ', blank=True, default='')
    is_leap_year = models.BooleanField('閏年のスケジュール有無', default=False)
    created_at = models.DateTimeField('登録日', auto_now_add=True)
    updated_at = models.DateTimeField('更新日', auto_now=True)

    def __str__(self):
        return str(self.id)
