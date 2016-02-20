$( document ).ready(function() {
    $("#sendusername").on( "click", function() {
        var username = $("#username").val();

        console.log(username);
        if (username) {
            socket.emit(channel+'_room', { username: username });
        }
    });
});

// Listener
socket.on(channel+'_room', function (data) {
    console.log(data);
  //socket.emit('my other event', { my: 'data' });
});
