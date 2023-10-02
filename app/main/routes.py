from flask import Flask,render_template, redirect
import urllib.request, json
from app.main import bp
from config import Config

becomeNew ={
    'id': 19,
    'channel_id': 'UCuDv5y3cjLSvZOecE77Gkfw',
    'channel_title': 'Become New',
    'channel_name': '@BecomeNew',
    'videos_count': 700,
    'link': 'https://www.youtube.com/@BecomeNew/videos',
    'channel_logo': 'https://yt3.ggpht.com/Rku879D5puL4rcGkWjNJRNjlxOSAvfIfG37cxOM12rL5Hjk9ZFmd_oBwbWZh-lc3t0PSv8R4ww=s88-c-k-c0xffffffff-no-rj-mo',
    'channel_description': 'Join John Ortberg for a series of devotional thoughts on the person we become. Sign up here for free supporting resources',
}
menloChurch ={
    'id': 5,
    'channel_id': 'UCtsi33WCfZd0n9CmK_rUAfA',
    'channel_title': 'Menlo Church',
    'channel_name': '@MenloChurch',
    'videos_count': 900,
    'link': 'https://www.youtube.com/@MenloChurch/streams',
    'channel_logo': 'https://yt3.ggpht.com/9QmAeD0tZRCBga4XKFFfb3y2c6veCKqaq5IZgHQNHMBk03MJj04vdOAIx5NK8IyMporGYJTqcg=s88-c-k-c0xffffffff-no-rj-mo',
    'channel_description': 'Our vision is to lead our generation into a transforming relationship with Jesus and authentic community with each other',
}
channels = []
channels.append(becomeNew)
channels.append(menloChurch)

def getChannelsList():
    url = Config.LIVE_DOMAIN+"/channelsList"
    response = urllib.request.urlopen(url)
    data = response.read()
    clist = json.loads(data)
    return clist

def getChannelDetails(channelName):
    url = Config.LIVE_DOMAIN+"/channelDetail/"+channelName
    response = urllib.request.urlopen(url)
    data = response.read()
    detail = json.loads(data)
    return detail

@bp.route('/')
def index():
    data = getChannelsList()
    channelsList = []
    if data['status']:
        channelsList = json.loads(data["list"])
        # print(channelsList)
    return render_template('index.html', channels=channelsList)

@bp.route('/<name>')
def chat(name):
    data = getChannelDetails(name)
    liveURL = Config.LIVE_DOMAIN
    if data['status']:
        channelDetail = json.loads(data["result"])
        preQuestions = json.loads(data['preQuestions'])
        return render_template('chat.html', channel = channelDetail, preQuestions = preQuestions, liveURL = liveURL)
    else:
        return redirect('/')
