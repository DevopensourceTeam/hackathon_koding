var socket = io.connect();
var username = "";
var game = {};

$( document ).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', audio);

    $("#sendusername").on( "click", function(event) {

        // Cancel default action click event
        event.preventDefault();

        username = $("#username").val();
        if (username) {
            socket.emit('adduser', {username:username,room:channel, avatar:avatar});
            audioElement.play();
            $('#usernameDisplay').html(username+' ');
            $("#init").hide();
            $("#game").show();
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
