# MEMORIAL NOTIFY

LINEアカウントと連携し、記念日を通知してくれるwebアプリケーション。LINEアカウントと連携することで、LINEログイン、
LINE Messaging APIでのメッセージ送信を実現しています。

# デモ

[Memorial_Notifyデモ動画](https://youtu.be/yqd2cbp4ktk)

# 特徴

　LINE画面から遷移し、カレンダーを開くことで記念日を登録でき、予定時刻なるとLINEからの通知を受け取れます。
「1ヶ月」ボタンを押下することで、記念日の1ヶ月の予定を確認できます。
また、「問い合わせ」ボタンからは管理者への問合せが可能です。

# 動作手順

## ローカルで動作させたい場合

LINEアプリ上で動作するwebアプリケーションなので、基本的にはローカルで動作はしない。ただ「ngrok」というローカル上で稼働しているネットワークを外部公開できるサービスを用いたら簡単にローカル上で確認ができます。
<br>
<br>
<br>

### 1.ngrokの使用

ngrokをインストール、アカウント作成し、port 8000、3000でポートフォワーディングできるようにします。（以下パス参照）

[Ngrokの導入方法](https://qiita.com/mininobu/items/b45dbc70faedf30f484e)

### 2.postgresqlのインストール

DBをインストールし、memofy_web/settings.pyのデータベース情報を更新する。
<br>
<br>

### 3.LINE Developersアカウントの使用

LINE Messaging APIとLINE　Login機能を使用するため、「LINE Developers」でアカウントを作成、「LINE Messaging API」「LINE Login」の二種類のチャンネルを作成します。


### 4.requirements.txtを事前にインストール

~~~
pip install -r requirements.txt
~~~

### 5.以下の環境変数をそれぞれ修正します。

#### LINEの環境変数
|ファイル|環境変数名 |概要|
| :--- | :--- | :--- |
|config.init|CHANNEL_ACCESS_TOKEN|LINE Messaging APIのトークン|
|config.init|CHANNEL_ID|LINE LOGINのチャネルID|
|config.init|CHANNEL_SECRET|LINE LOGINのチャネルシークレットキー|
|config.init|REDIRECT_URI_CALENDAR|3000ポートURL/|
|config.init|REDIRECT_URI_CONTACT|3000ポートURL/contact/|
|config.init|RESTAPI_AUTH_URL|8000ポートURL/|
|memorial-client/src/hooks/useBaseUrl.ts|baseUrl|8000ポートURL/|

<br>

#### LINE　Developersのダッシュボードでの設定
|設定先|URL |概要|
| :--- | :--- | :--- |
|Line Loginアカウント|Callback URL|3000ポートURL/|
|Line Messaging APIアカウント|Webhook URL|8000ポートURL/line/callback/|
|Line Messaging APIアカウントのリッチメニュー設定|カレンダー URL|8000ポートURL/line/linelogin/|
|Line Messaging APIアカウントのリッチメニュー設定|問合せ URL|3000ポートURL/contact/|

### 6.ソースコード起動

#### フロントエンド（memofy-client）

1. 移動 
~~~
$cd ＜任意のディレクトリ＞/cpj_memorial_notify/memofy-client 
~~~

2. react-scriptsのインストール 
~~~
yarn add react-scripts
~~~

3. クライアントサーバ立ち上げ
~~~
yarn start 
~~~

※参照

[yarnコマンドインストール方法](https://qiita.com/suisui654/items/1b89446e03991c7c2c3d)


#### バックエンド（memofy_web）

1. 移動
~~~
cd <任意のディレクトリ>/cpj_memorial_notify/memofy_web
~~~

2. Web server run
~~~
python manage.py runserver 
~~~

※テストする際のコマンド
~~~
python manage.py test
~~~

## 番外編

### DB adminユーザー作成方法

1. shellに入る
~~~
python manage.py shell
~~~

1. shell内でuseidのオブジェクトを作成する
~~~
from memofy_api.models import LineId
LineId.objects.create(userid='<userid>')
~~~

※useidは任意のname

2. adminのアカウントをさきほど作成したobjectを使用して作成する
~~~
python manage.py createsuperuser
~~~

### MYSQL内でのデータ確認方法

1. mysqlのサービスに入るコマンド
~~~
mysql -u root -p
~~~

※ 「-u」でmysqlユーザー名、「-p」でその後にパスワード指定する

2. データベース確認コマンド
~~~
show databases;
~~~

3. データベースの中に入るコマンド
~~~
use データベース名;
~~~

4. table情報確認コマンド
~~~
show tables;
~~~

5. カラム情報確認コマンド
~~~
show columns from テーブル名;
~~~

6. table確認
~~~
select * from tablename;
~~~