'use strict'
const Request = require('request');
const EventsEmitter = require('events');

module.exports = Remote;

function Remote(){
    var that = this;

    this.OAuthKey = null;
    this.CSRFKey = null;
    this.URLS = {
        CSRFTOKEN: "simplecsrf/token.json?&ref=&cors=",
        OAUTH: "http://open.spotify.com/token",
        PLAYCURRENT: "remote/pause.json?pause=false",
        PLAYNEW: "remote/play.json?uri={url}&context={context}",
        PAUSE: "remote/pause.json?pause=true"
    };

    this.on('OAuthComplete', function(oauthKey){
        that.OAuthKey = oauthKey;
        that.IsLoaded();
    });

    this.on('CSRFComplete', function(csrfKey){
        that.CSRFKey = csrfKey;
        that.IsLoaded();
    });

    this.IsLoaded = function(){
        if(that.OAuthKey && that.CSRFKey) that.emit('Ready');
    }

    this.GetOAuthKey = function() {
        that.CreateRequest({URL: "", OverrideURL: that.URLS.OAUTH}, function(res){
            that.emit('OAuthComplete', res['t']);
        });
    }

    this.GetCSRFToken = function() {
        var extraheaders = {
            'Origin': 'https://embed.spotify.com',
            'Referer': 'https://embed.spotify.com/?uri=spotify:track:4bz7uB4edifWKJXSDxwHcs'
        }

        that.CreateRequest({ URL:that.URLS.CSRFTOKEN, ExtraHeader: extraheaders}, function(res){
            that.emit('CSRFComplete', res['token']);
        });
    }

    this.Pause = function() {
        that.CreateRequest({URL: that.URLS.PAUSE, OAUTH: true, CSRF: true}, function(res){
            that.emit('TrackPaused');
        });
    }

    this.Play = function(trackURL, context) {
        var url = that.URLS.PLAYCURRENT;

        if(trackURL && context)
        {
            url = that.URLS.PLAYNEW;
            url = url.replace('{url}', trackURL);
            url = url.replace('{context}', context);
        }
        that.CreateRequest({URL: url, OAUTH: true, CSRF: true}, function(res){
            that.emit(trackURL ? "TrackPlayedNew" : "TrackPlayedCurrent");
        });
    }

    this.CreateRequest = function(options, cb) {
        
        var defaultOptions = { 
            url: "https://tpcaahshvs.spotilocal.com:4371/" + options.URL,
            headers: {
                'Pragma': 'no-cache',
                'Accept-Language': 'en-US,en;q=0.8,da;q=0.6,nb;q=0.4',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2156.0 Safari/537.36',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            }
        };

        if(options.OverrideURL) defaultOptions.url = options.OverrideURL;
        if(options.ExtraHeader) {
            for(var key in options.ExtraHeader)
            {
                defaultOptions.headers[key] = options.ExtraHeader[key];
            }
        }

        if(options.OAUTH) defaultOptions.url += "&oauth=" + that.OAuthKey;
        if(options.CSRF) defaultOptions.url += "&csrf=" + that.CSRFKey;

        var request = new Request(defaultOptions,  function(err, res, body){
                if(err) console.log(err);
                body = JSON.parse(body);
                cb(body);
        });
    }

    this.GetOAuthKey();
    this.GetCSRFToken();
}

Remote.prototype.__proto__ = EventsEmitter.prototype;