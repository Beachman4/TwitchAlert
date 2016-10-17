
import NewFollower from './NewFollower.js';
import config from 'config';
import Request from 'request';
var models = require('../models');

class Twitch {
    constructor(io) {
        this.newFollowers = [];
        this.socket = io;
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
    removeFromArray(follower) {
        var remove = 0;
        this.newFollowers.forEach((item, index, array) => {
            if (item.username == follower.username) {
                remove = index;
            }
        });
        this.newFollowers.splice(remove, 1);
    }
    alert(follower) {
        this.socket.emit('message', {follower: follower});
        this.removeFromArray(follower);
    }
    checkForFollowers() {
        if (this.newFollowers.length > 0) {
            for(var follower of this.newFollowers) {
                this.alert(follower);
            }
        }
    }
}

module.exports = Twitch;