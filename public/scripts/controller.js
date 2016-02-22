var socket = io.connect();
var username = "";
var game = {};
var positionRank;
var points = 0 ;
var currentPoints = "";

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

    socket.on('updatepoints', function (data) {
        console.log(data);
        console.log('updatepoints');

        points = data.punctuation[username];

        if(typeof points === 'undefined'){
          points = 0;
        }

        var totalPoints = [];

        $.each(data.punctuation,function(index, value){
            totalPoints.push({user:index,points:value});
        });

        totalPoints = totalPoints.sort(function(a, b){return b.points-a.points});
        positionRank=1;
        $.each(totalPoints,function(index, value){
            if(value.user==username){
                return false;
            }else{
                positionRank++;
            }
        });

        console.log(points);
        $('#points').text(points + ' points');

    });

    socket.on('pointsresult', function (data) {
        if(data.username==username){
            currentPoints=data.points;
        }
    });



    socket.on('lockcontroller', function (data) {
        if(data){

            if(!isNaN(currentPoints) && currentPoints!=""){
                if(currentPoints>0){
                    $('#splashpoint').removeClass('error');
                    $('#pointresult').text("+"+currentPoints);
                    $('#splashpoint').show();
                }else{
                    $('#splashpoint').addClass('error');
                    $('#pointresult').text(currentPoints);
                    $('#splashpoint').show();
                }
            }

            lockcontroller()
        }else{
            $('#splashpoint').hide();
            unlockcontroller();
        }
    });

    socket.on('endgame', function (data) {
        $("#waiting").hide();
        $("#game").hide();
        $('span#position').text(positionRank);
        $('span#points').text("Points: "+points);
        $("#endgame").show();
    });

    socket.on('getOptionValues', function (data) {
        if($('#game').is(':hidden')){
            $("#endgame").hide();
            $("#waiting").hide();
            $("#game").show();
            audioElement.play();
        }

        $('div#button-1 span').text(data.option1);
        $('div#button-2 span').text(data.option2);
        $('div#button-3 span').text(data.option3);
        $('div#button-4 span').text(data.option4);
        console.log(data);
    });
});

function unlockcontroller(){
    currentPoints = "";
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
