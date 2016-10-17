

var socket = io.connect('http://localhost:3000');
var followers = [];
setTimeout(function() {
    $('.container').hide();
}, 1);

socket.io.on('message', function() {
    followers.push(followers);
    alert(follower);
});

function alert(follower) {
    console.log(followers);
    $('h1').text(follower.username + " just followed!");
    $('.container').fadeIn('fast').delay(6000).fadeOut('fast');
    var audio = new Audio('default.mp3');
    audio.play();

}