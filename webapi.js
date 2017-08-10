'use strict'
const Request = require('request');
const EventsEmitter = require('events');

class WebAPI extends EventsEmitter
{
    constructor() {
        super();
        this.Token = null;
        this.URLS = {
            TRACKS: {
                GET: "tracks/"
            },
            SEARCH: {
                
            }
        };
    }

    GetTrack(trackId) {
        const self = this;
        this.CreateRequest("tracks/" + trackId, function(data){
            console.log(data);
        }); 
    }

    Search(q){
        const self = this;
        this.CreateRequest({URL: "search?q=" + q + "&type=album,artist,playlist,track"}, function(data){
            return data;
        });
    }

    CreateRequest(options, cb){
        const self = this;
        this.GetOAuthToken(function(){
            var request = new Request('https://api.spotify.com/v1/' + options.URL, {
                headers: {
                    'Authorization': self.Token.Type + " " + self.Token.Value
                }
            }, function(err, res, body){
                if(err) console.error(err);
                body = JSON.parse(body);
                cb(body);
            });
        });
    }

    GetOAuthToken(cb){
        const self = this;
        var auth = "Basic " + new Buffer('8217b40df2604420abe3610819932559' + ":" + '325419217cae40db91a9830f541083c1').toString("base64");
        var request = new Request.post("https://accounts.spotify.com/api/token", {
            body: 'grant_type=client_credentials',
            headers: {
                'Authorization': auth,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }, function(err, res, body){
            if(err) console.error(err);
            body = JSON.parse(body);
            self.Token = {
                Type: body['token_type'],
                Value: body["access_token"]
            };
            cb();
        });
    }
}


module.exports = WebAPI;