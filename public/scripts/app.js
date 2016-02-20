socket = io.connect();

// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('my other event', { my: 'data' });
// });

$( document ).ready(function() {

  socket.on(channel+'_room', function (data) {
    console.log(data);
    console.log('escucha desde cliente js')
    //socket.emit('my other event', { my: 'data' });
  });

});
