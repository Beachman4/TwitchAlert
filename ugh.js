
import config from 'config';
import Request from 'request';
var models = require('./models');

class NewFollower {
    constructor(username, twitch_id, time) {
        this.username = username;
        this.twitch_id = twitch_id;
        this.time = time;
    }
}

class Twitch {
    constructor() {
        this.newFollowers = [];
        this.followers = [];
        this.clientId = config.get('data.client_id');
        let twitch = this;
        setInterval(function() {
            twitch.checkForFollowers()
        }, 1000);
    }
    run() {
        this.request();
    }
    request() {
        var clientId = this.clientId;
        var twitch = this;
        return new Promise(function(resolve, reject) {
            var options = {
                url: "https://api.twitch.tv/kraken/channels/beachman4/follows?direction=DESC",
                headers: {
                    "Accept": "application/vnd.twitchtv[3]+json",
                    "Client-ID": clientId
                }
            }
            Request(options, function(err, resp, body) {
                var followers = JSON.parse(body).follows;
                twitch.followers = followers;
                twitch.checkArray();
            });
        });
    }
    checkArray() {
        var followers = this.followers;
        for(let follower of followers) {
            models.alerted.findOne({
                where: {
                    username: follower.user.name
                }
            }).then((alerted) => {
                if (alerted == null) {
                this.newFollowers.push(new NewFollower(follower.user.name, follower.user._id, new Date()));
            }
        });
        }
    }
    alert() {

    }
    checkForFollowers() {
        if (this.newFollowers.length > 0) {
            for(var follower of this.newFollowers) {

            }
        }
    }
}

let twitch = new Twitch();
twitch.run();