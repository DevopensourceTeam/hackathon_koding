var socket = io.connect();
var username = "";
var game = {};

$( document ).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', audio);


    if($.cookie('username')){
        username = $.cookie('username');
        socket.emit('adduser', {username:username,room:channel, avatar:avatar});
        $('#usernameDisplay').html(username+' ');
        $("#init").hide();
        $("#waiting").show();
    }

    $("#sendusername").on( "click", function(event) {

        // Cancel default action click event
        event.preventDefault();

        username = $("#username").val();
        if (username) {
            socket.emit('adduser', {username:username,room:channel, avatar:avatar});
            $.cookie('username', username, { expires: 7, path: '/' });
            $.cookie('avatar', avatar, { expires: 7, path: '/' });
            $('#usernameDisplay').html(username+' ');
            $("#init").hide();
            $("#waiting").show();
            enterFullscreen();
        }


    });

    $("#button-1").on( "click", function() {
        if($(this).hasClass( "lock" )){
            return false;
        }

        $(this).addClass("answered");

        lockcontroller();

        socket.emit('sendoption', 1);
        audioElement.play();
    });

    $("#button-2").on( "click", function() {
        if($(this).hasClass( "lock" )){
            return false;
        }

        $(this).addClass("answered");

        lockcontroller();



        socket.emit('sendoption', 2);
        audioElement.play();
    });

    $("#button-3").on( "click", function() {
        if($(this).hasClass( "lock" )){
            return false;
        }

        $(this).addClass("answered");

        lockcontroller();

        socket.emit('sendoption', 3);
        audioElement.play();
    });

    $("#button-4").on( "click", function() {
        if($(this).hasClass( "lock" )){
            return false;
        }

        $(this).addClass("answered");

        lockcontroller();

        socket.emit('sendoption', 4);
        audioElement.play();
    });

    socket.on('controllercommand', function (data) {
        console.log(data);
    });

    socket.on('updatepoints', function (data) {
        console.log(data);
        console.log('updatepoints');

        var points = data.punctuation[username];

        console.log(points);

        $('#points').text(points + ' points');

    });

    socket.on('lockcontroller', function (data) {
        if(data){
            lockcontroller()
        }else{
            unlockcontroller();
        }
    });

    socket.on('getOptionValues', function (data) {
        if($('#game').is(':hidden')){
            $("#waiting").hide();
            $("#game").show();
            audioElement.play();
        }

        console.log(data);
        $('div#button-1 span').text(data.option1);
        $('div#button-2 span').text(data.option2);
        $('div#button-3 span').text(data.option3);
        $('div#button-4 span').text(data.option4);
        console.log(data);
    });
});

function unlockcontroller(){
    $(".quizzbutton").removeClass('lock');
    $(".quizzbutton").removeClass('answered');

}

function lockcontroller(){
    $(".quizzbutton").addClass('lock');
}

function onFullScreenEnter() {
  console.log("Entered fullscreen!");
  elem.onwebkitfullscreenchange = onFullScreenExit;
  elem.onmozfullscreenchange = onFullScreenExit;
};

// Called whenever the browser exits fullscreen.
function onFullScreenExit() {
  console.log("Exited fullscreen!");
};

function exitFullscreen() {
  console.log("exitFullscreen()");
  document.cancelFullScreen();
  document.getElementById('enter-exit-fs').onclick = enterFullscreen;
}

// Note: FF nightly needs about:config full-screen-api.enabled set to true.
function enterFullscreen() {
  var elem = document.querySelector(document.webkitExitFullscreen ? "#game" : "#game");
  console.log("enterFullscreen()");
  elem.onwebkitfullscreenchange = onFullScreenEnter;
  elem.onmozfullscreenchange = onFullScreenEnter;
  elem.onfullscreenchange = onFullScreenEnter;
  if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else {
      elem.requestFullscreen();
    }
  }
  //document.getElementById('enter-exit-fs').onclick = exitFullscreen;
}
