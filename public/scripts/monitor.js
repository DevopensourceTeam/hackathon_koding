var socket = io.connect();
var startTime;
var answers;
var currentQuestion;
var timeQuestion = 10000;
var timeResult  = 5000;
var totalTime = timeQuestion+timeResult;
var remainingTime;
var endGame = false;
var reducePoints = 500;
var multPoint = 100;
var audioSucces = document.createElement('audio');
var audioNew = document.createElement('audio');
var audioClock = document.createElement('audio');
var audioRank = document.createElement('audio');
var rank;

$( document ).ready(function() {
    socket.emit('addmonitor', channel);

    audioSucces.setAttribute('src', '/sounds/correctanswere.wav');
    audioNew.setAttribute('src', '/sounds/newanswere.wav');
    audioClock.setAttribute('src', '/sounds/clock.wav');
    audioRank.setAttribute('src', '/sounds/rank.mp3');

    startGame();
});

function startGame(){
    var questionCount = 1;

    nextQuestion(0);
    var interval = setInterval(function(){
         if(questionCount>questions.length-2){
             endGame=true;
            clearInterval(interval);
         }
        nextQuestion(questionCount);
        questionCount++;
    }, totalTime);

    socket.on('updateoption', function (username, data) {
        var answereTime = (new Date).getTime() / 1000;

        console.log('answereTime: '+answereTime );

        var time = parseFloat(answereTime) - parseFloat(startTime);

        console.log('time: '+time );

        console.log(username);
        console.log(time);
        console.log('time response user: '+ time);

        for (i = 0; i < answers.length; i++) {
            if(answers[i].username == username){
                return false;
            }
        }

        // send points to SERVER
        if(currentQuestion.correct == data){

            console.log('timeRest: '+time.toFixed(2));


            var timeRest = timeQuestion / 1000 - time.toFixed(2);

            console.log('currentQuestion.correct '+ currentQuestion.correct );

            console.log('timeRest: '+timeRest);

            pointsToUser = parseInt(timeRest * multPoint);

            console.log('multPoint'+ multPoint);

            console.log('pointsToUser: '+pointsToUser);

            //calculate points
            socket.emit('sendpoints', {'points': pointsToUser, 'username':username });

            console.log('correct answer');
            console.log(username);
            console.log(pointsToUser);
        }else{
            socket.emit('sendpoints', {'points': reducePoints, 'username':username, 'reduce': true });

            console.log('bad answer');
            console.log(username);
            console.log(reducePoints);
        }

        answers.push({username:username,option:data,time:time});
        console.log(answers);
    });

    socket.on('finalizemonitor', function(data){
        rank = [];

        $.each(data.punctuation,function(index, value){
            rank.push({user:index,points:value});
        });

        rank = rank.sort(function(a, b){return b.points-a.points});
        displayResults()
    });
}

function nextQuestion(questionCount){
    $('.answer').removeClass('correct');

    remainingTime=timeQuestion;

    audioNew.play();

    $('#timer span').text(remainingTime/1000);

    console.log(timeQuestion);

    $('.progress-type span').text(timeQuestion/1000);
    $('.progress-bar').width('100%');
    $('.progress-completed, .sr-only').text('100%');
    $('.progress-bar').attr('aria-valuenow', 100);

    var intervalQuestion = setInterval(function(){
        remainingTime = remainingTime-1000;
        if(remainingTime<0){
            clearInterval(intervalQuestion);
            showCorrectAnswere();
        }else{
            if(remainingTime==3000){
                audioClock.play();
            }
            var percent = ((remainingTime/1000)*100)/(timeQuestion/1000);
            $('#timer span').text(remainingTime/1000);
            $('.progress-type span').text(remainingTime/1000);


            $('.progress-bar').width(percent+'%');
            $('.progress-completed, .sr-only').text(percent+'%');
            $('.progress-bar').attr('aria-valuenow', percent);
        }
    }, 1000);

    socket.emit('lockallcontroller', 0);
    answers = [];
    startTime = (new Date).getTime() / 1000;
    currentQuestion = questions[questionCount];
    $('#question span').text(questions[questionCount].question);
    $('#answer1').text(questions[questionCount].answers.option1);
    $('#answer2').text(questions[questionCount].answers.option2);
    $('#answer3').text(questions[questionCount].answers.option3);
    $('#answer4').text(questions[questionCount].answers.option4);

    socket.emit('sendanswers', questions[questionCount].answers);
}


function showCorrectAnswere(){
    socket.emit('lockallcontroller', 1);

    audioSucces.play();
    $('#answer'+currentQuestion.correct).addClass('correct');

    // Send points status to user
    socket.emit('getpoints');

    console.log("show correct answere");

    if(endGame){
        setTimeout(function(){ socket.emit('endgame'); },timeResult);
    }

}


function displayResults(){
    audioRank.play();
    var html = '<table class="table table-hover"><thead><tr><th>#</th><th>Username</th><th>Points</th></tr></thead><tbody>';

    for(var i = 0; i < rank.length; i++){
        html = html + '<tr class=""><td>'+(i+1)+'</td><td>'+rank[i].user+'</td><td>'+rank[i].points+'</td></tr>';
    }

    html = html + '</tbody>';
    html = html + '</table>';

    $('.questionrow').hide();
    $('#results-container').show();

    $('#results').html(html);
}