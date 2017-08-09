"use strict";

const Remote = require('./remote.js');
const WebAPI = require('./webapi.js');

var remote = new Remote();
var webAPI = new WebAPI();

webAPI.Search("yelawolf");

remote.on('Ready', function(){
    console.log("LOCALAPI-Ready");
    remote.Pause();
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

process.stdin.resume();
