import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # SECRET_KEY = os.environ.get('SECRET_KEY')
    SECRET_KEY = os.urandom(16)
    BASE_DOMAIN = 'http://127.0.0.1:5555'
    LIVE_DOMAIN = 'https://pastors.ai'
    ELEVENLABS_API_KEY = '1b3a3da9addc954cac1bd302fc9e40c4'
    ANSWER_AUDIO_FOLDER = './app/static/audio/answers'
    QUESTION_AUDIO_FOLDER = './app/static/audio/questions'
    # LIVE_DOMAIN = 'http://127.0.0.1:5000'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')\
        or 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
