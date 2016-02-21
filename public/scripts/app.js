var socket = io.connect();

$( document ).ready(function() {

  socket.on('updateusers', function(_users){
    console.log('SCK: listen client ');
    console.log(_users);
    
    // clean list users
    $('#users').text('');

    // view of user
    var numUserExist = {};

    $.each(_users, function (index, value) {
      console.log(index);
      console.log(value.avatar);

      var html = '<div clas="user"><span><img src="/images/avatars/avatar_'+value.avatar+'.png"/></span><span>'+value.username+'</span></div>';
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
});
