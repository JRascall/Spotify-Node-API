'use strict'
const Request = require('request');
const EventsEmitter = require('events');

module.exports = WebAPI;

function WebAPI(){
    var that = this;

    this.Token = null;
    this.URLS = {
        TRACKS: {
            GET: "tracks/"
        },
        SEARCH: {
            
        }
    };

    this.GetTrack = function(trackId) {
        that.CreateRequest("tracks/" + trackId, function(data){
            console.log(data);
        }); 
    }

    this.Search = function(q){
        that.CreateRequest({URL: "search?q=" + q + "&type=album,artist,playlist,track"}, function(data){
            console.log(data);
        });
    }

    this.CreateRequest = function(options, cb){
        that.GetOAuthToken(function(){
            var request = new Request('https://api.spotify.com/v1/' + options.URL, {
                headers: {
                    'Authorization': that.Token.Type + " " + that.Token.Value
                }
            }, function(err, res, body){
                if(err) console.error(err);
                body = JSON.parse(body);
                cb(body);
            });
            console.log(request.URL);
        });
    }

    this.GetOAuthToken = function(cb){
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
            that.Token = {
                Type: body['token_type'],
                Value: body["access_token"]
            };
            cb();
        });
    }
}

WebAPI.prototype.__proto__ = EventsEmitter.prototype;