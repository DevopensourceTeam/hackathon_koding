var socket = io.connect();

$( document ).ready(function() {
    socket.emit('addmonitor', channel);

    socket.on('updateoption', function (username,data) {
        console.log(username);
        console.log(data);
    });
});
