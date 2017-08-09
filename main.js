"use strict";

const Remote = require('./remote.js');

var OauthKey = null;
var CfidKey = null;

var remote = new Remote();
remote.on('Ready', function(){
    console.log("Ready To Take Commands");

    remote.PlayTrack();
})
process.stdin.resume();
