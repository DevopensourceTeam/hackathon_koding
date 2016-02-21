var socket = io.connect();
var username = "";

$( document ).ready(function() {
    $("#sendusername").on( "click", function() {
        username = $("#username").val();
        if (username) {
            socket.emit('adduser', {username:username,room:channel});
            $("#init").hide();
            $("#game").show();
        }
    });

    $("#button-1").on( "click", function() {
        socket.emit('sendoption', 1);
    });

    $("#button-2").on( "click", function() {
        socket.emit('sendoption', 2);
    });

    $("#button-3").on( "click", function() {
        socket.emit('sendoption', 3);
    });

    $("#button-4").on( "click", function() {
        socket.emit('sendoption', 4);
    });

    socket.on('controllercommand', function (data) {
        console.log(data);
    });

    socket.on('updatepoints', function (data) {
        console.log(data);
    });

});
