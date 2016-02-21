var socket = io.connect();

$( document ).ready(function() {

  socket.on('updateusers', function(_users){
    console.log('SCK: listen client ');
    console.log(_users);

    for (i = 0; i < users.length; i++) {
      $('#users').text(_users.indexOf(i));
    }
  });

  socket.on('sendquestion', function(question){
    console.log('SCK: listen client :sendquestion ');
    console.log(question);

    $('#question').text(question);


  });
});
