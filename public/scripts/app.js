var socket = io.connect();

$( document ).ready(function() {

  socket.on('updateusers', function(_users){
    console.log('SCK: listen client ');
    console.log(_users);

    $('#users').text('');
    $.each(_users, function (index, value) {
      console.log(value);
      $('#users').append(value+'</br>');

    });

  });

  socket.on('enableplay', function(game){
    console.log('SCK: listen client :enableplay ');
    console.log(game);

    if(game){
        $('#gotoplay').prop("disabled", false);
    }

  });
});
