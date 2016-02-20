socket = io.connect();

$( document ).ready(function() {

  socket.on(channel+'_room_monitor', function (data) {
    console.log(data);
    console.log('escucha desde cliente js')
    //socket.emit('my other event', { my: 'data' });
  });

});
