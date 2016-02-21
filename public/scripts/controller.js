var socket = io.connect();

$( document ).ready(function() {
    $("#sendusername").on( "click", function() {
        var username = $("#username").val();

        console.log(username);
        if (username) {
            socket.emit('adduser', {username:username,room:channel});
            $("#init").hide();
            $("#game").show();
        }
    });

    $("#button-1").on( "click", function() {
        socket.emit(channel+'_room', { username: username, push:1 });
    });

    $("#button-2").on( "click", function() {
        socket.emit(channel+'_room', { username: username, push:2 });
    });

    $("#button-3").on( "click", function() {
        socket.emit(channel+'_room', { username: username, push:3 });
    });

    $("#button-4").on( "click", function() {
        socket.emit(channel+'_room', { username: username, push:4 });
    });

    // listener, whenever the server emits 'updatechat', this updates the chat body
    socket.on('updatecommand', function (username, data) {
        console.log(username,data);
    });

    // listener, whenever the server emits 'updateusers', this updates the username list
    socket.on('updateusers', function(data) {
        $('#users').empty();
        $.each(data, function(key, value) {
            console.log(key);
        });
    });

});
