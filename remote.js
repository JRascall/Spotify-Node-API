'use strict'
const Request = require('request');
const EventsEmitter = require('events');

class Remote extends EventsEmitter
{
    constructor() {
        super();
        this.OAuthKey = null;
        this.CSRFKey = null;
        this.URLS = {
            CSRFTOKEN: "simplecsrf/token.json?&ref=&cors=",
            OAUTH: "http://open.spotify.com/token",
            PLAYCURRENT: "remote/pause.json?pause=false",
            PLAYNEW: "remote/play.json?uri={url}&context={context}",
            PAUSE: "remote/pause.json?pause=true",
            QUEUE: "remote/play.json?url={url}&action=queue",
            STATUS: "remote/status.json?test=test"
        };

        this.on('OAuthComplete', function(oauthKey){
            this.OAuthKey = oauthKey;
            this.IsLoaded();
        });

        this.on('CSRFComplete', function(csrfKey){
            this.CSRFKey = csrfKey;
            this.IsLoaded();
        });

        this.GetOAuthKey();
        this.GetCSRFToken();
    }
   
   
    IsLoaded(){
        if(this.OAuthKey && this.CSRFKey) this.emit('Ready');
    }

    GetOAuthKey(){
        const self = this;

        this.CreateRequest({URL: "", OverrideURL: this.URLS.OAUTH}, function(res){
            self.emit('OAuthComplete', res['t']);
        });
    }

    GetCSRFToken() {
       const self = this;

        var extraheaders = {
            'Origin': 'https://embed.spotify.com',
            'Referer': 'https://embed.spotify.com/?uri=spotify:track:4bz7uB4edifWKJXSDxwHcs'
        }

        this.CreateRequest({ URL:this.URLS.CSRFTOKEN, ExtraHeader: extraheaders}, function(res){
            self.emit('CSRFComplete', res['token']);
        });
    }

    Pause() {
        const self = this;

        this.CreateRequest({URL: this.URLS.PAUSE, OAUTH: true, CSRF: true}, function(res){
            self.emit('TrackPaused');
        });
    }

    Play(trackURL) {
       const self = this;
       
        var url = this.URLS.PLAYCURRENT;

        if(trackURL)
        {
            url = this.URLS.PLAYNEW;
            url = url.replace('{url}', trackURL);
            url = url.replace('{context}', trackURL);
        }
        this.CreateRequest({URL: url, OAUTH: true, CSRF: true}, function(res){
            self.emit(trackURL ? "TrackPlayedNew" : "TrackPlayedCurrent");
        });
    }

    GetStatus(){
        const self = this;
        
        this.CreateRequest({URL: this.URLS.STATUS, OAUTH: true, CSRF: true}, function(res){
            self.emit("Status", res);
        });
    }

    //Doesn't work
    /*AddToQueue(trackURL) {
       const self = this;
       var url = this.URLS.QUEUE.replace('{url}', trackURL);
        this.CreateRequest({URL: url, OAUTH: true, CSRF: true}, function(res){
            self.emit("QueuedSong");
        })
    }*/

    CreateRequest(options, cb) {
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

        if(options.OAUTH) defaultOptions.url += "&oauth=" + this.OAuthKey;
        if(options.CSRF) defaultOptions.url += "&csrf=" + this.CSRFKey;
        console.log(defaultOptions.url);
        var request = new Request(defaultOptions,  function(err, res, body){
                if(err) console.log(err);
                body = JSON.parse(body);
                cb(body);
        });
    }
}

module.exports = Remote;
