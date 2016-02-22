var socket = io.connect();

$( document ).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '/sounds/intro.mp3');
    audioElement.setAttribute('autoplay',true);

    socket.emit('newsession', channel);


    socket.on('updateusers', function(_users){
        $('.no-players h1').hide();
    console.log('SCK: listen client ');
    console.log(_users);

    // clean list users
    $('#users').text('');

    console.log(_users);

    // view of user
    var numUserExist = {};

    $.each(_users, function (index, value) {
      console.log(index);
      console.log(value.avatar);

      var html = '<div class="col-md-3 user"><div><img src="/images/avatars/avatar_'+value.avatar+'.png"/><span class="user-name">'+value.username+'</span></div></div>';
      $('#users').append(html);

    });

    });

    socket.on('enableplay', function(game){
    console.log('SCK: listen client :enableplay ');
    console.log(game);

    if(game){
        $('#gotoplay').prop("disabled", false);
    }

    });

    //logica redirect form url
    $('#gotoroom').on('click', function(event) {
      event.preventDefault();
      var url = $('#code-room').val();
      location.replace("/game-quizz/ct/" + url.toLowerCase());
    });


});
