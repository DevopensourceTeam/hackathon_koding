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

  socket.on('sendquestion', function(question){
    console.log('SCK: listen client :sendquestion ');
    console.log(question);

    $('#question').text(question);


  });
});
