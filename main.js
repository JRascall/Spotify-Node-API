"use strict";

const ReadLine = require('readline');

const Remote = require('./remote.js');
const WebAPI = require('./webapi.js');
const APIServer = require('./apiserver.js');

var remote = new Remote();
var webAPI = new WebAPI();
var server = new APIServer(remote, webAPI);

//webAPI.Search("yelawolf");

remote.on('Ready', function(){
    console.log("LOCALAPI-Ready");

    remote.Play("spotify:track:4FxkQzIhsLAkuiqX5puvU6", "spotify:track:4FxkQzIhsLAkuiqX5puvU6");
});

remote.on('TrackPlayedNew', function(){
    console.log("New Song Played");
});

remote.on('TrackPlayedCurrent', function(){
    console.log("Song resumed");
});

remote.on('TrackPaused', function(){
    console.log("Song Paused");
});

var RL = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

RL.on('line', function(input){
    switch(input){
        case "Play":
            remote.Play();
        break;
        case "Pause":
            remote.Pause();
        break;
    }
})
