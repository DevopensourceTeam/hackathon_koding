$( document ).ready(function() {
    $("#sendusername").on( "click", function() {
        var username = $("#username").val();
        if (username) {
            socket.emit(channel+'_room', { username: username });
        }
    });
});

