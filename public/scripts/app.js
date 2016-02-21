var socket = io.connect();

$( document ).ready(function() {

  socket.on('updateusers', function(_users){
    console.log('SCK: listen client ');
    console.log(_users);

  });
});
