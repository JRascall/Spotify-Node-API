'use strict'
const Restify = require('restify');
const EventsEmitter = require('events');

class APIServer extends EventsEmitter 
{
    constructor(remote, webapi){
        super();
        const self = this;
        this.Remote = remote;
        this.WebAPI = webapi;

        this.RestifyServer = Restify.createServer({
            name:"SpotiyControl"
        })

        this.RestifyServer.listen(8005);

        this.RestifyServer.post("/Play", function(req, res){
            self.Remote.Play();
            res.send(200, {status: 200});
        });

        this.RestifyServer.post("/Pause", function(req, res){
            self.Remote.Pause();
            res.send(200, {status: 200});
        });

    }
}

module.exports = APIServer; 