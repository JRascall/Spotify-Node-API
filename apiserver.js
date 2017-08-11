'use strict'
const Restify = require('restify');
const EventsEmitter = require('events');

class APIServer extends EventsEmitter {
    constructor(remote, webapi) {
        super();
        const self = this;
        this.Remote = remote;
        this.WebAPI = webapi;

        this.RestifyServer = Restify.createServer({
            name: "SpotiyControl"
        })

        this.RestifyServer.listen(8005);

        this.RestifyServer.get("/play", function (req, res) {
            self.Remote.Play();
            res.send(200, { status: 200 });
        });

        this.RestifyServer.get("/play/:url", function (req, res) {
            self.Remote.Play(req.params.url);
            res.send(200, { status: 200 });
        });

        this.RestifyServer.get("/pause", function (req, res) {
            self.Remote.Pause();
            res.send(200, { status: 200 });
        });

        this.RestifyServer.get("/search/:searchQuery", function (req, res) {
            self.WebAPI.Search(req.params.searchQuery, function (data) {
                res.send(200, data);
            });
        });

    }
}

module.exports = APIServer; 