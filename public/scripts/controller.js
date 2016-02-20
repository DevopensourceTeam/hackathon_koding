$( document ).ready(function() {
    $("#sendusername").on( "click", function() {
        var username = $("#username").val();

        console.log(username);
        if (username) {
            socket.emit(channel+'_room', { username: username });
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

    // Listener
    socket.on(channel+'_room', function (data) {
        console.log(data);
        //socket.emit('my other event', { my: 'data' });
    });
});
