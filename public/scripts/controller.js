var socket = io.connect();
var username = "";
var game = {};

$( document ).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', audio);

    $("#sendusername").on( "click", function() {
        username = $("#username").val();
        if (username) {
            socket.emit('adduser', {username:username,room:channel, avatar:avatar});
            audioElement.play();
            $("#init").hide();
            $("#game").show();
        }
    });

    $("#button-1").on( "click", function() {
        socket.emit('sendoption', 1);
        audioElement.play();
    });

    $("#button-2").on( "click", function() {
        socket.emit('sendoption', 2);
        audioElement.play();
    });

    $("#button-3").on( "click", function() {
        socket.emit('sendoption', 3);
        audioElement.play();
    });

    $("#button-4").on( "click", function() {
        socket.emit('sendoption', 4);
        audioElement.play();
    });

    socket.on('controllercommand', function (data) {
        console.log(data);
    });

    socket.on('updatepoints', function (data) {
        console.log(data);
    });

    socket.on('getOptionValues', function (data) {
        console.log(data);
    });
});
