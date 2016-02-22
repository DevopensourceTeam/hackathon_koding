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

$( document ).ready(function() {
    socket.emit('addmonitor', channel);
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
}

function nextQuestion(questionCount){
    $('.answer').removeClass('correct');

    remainingTime=timeQuestion;

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

function endGameResults(){



}

socket.on('finalizemonitor', function(data){
    console.log(data);
});

function showCorrectAnswere(){
    socket.emit('lockallcontroller', 1);

    $('#answer'+currentQuestion.correct).addClass('correct');

    // Send points status to user
    socket.emit('getpoints');

    console.log("show correct answere");

    if(endGame){

          socket.emit('endgame');

          console.log("end game");
          //endGameResults();

          var html = '<table class="table table-hover"><thead><tr><th>#</th><th>Username</th><th>Points</th></tr></thead><tbody>';

          for(var i = 0; i < 5; i++){
              html = html + '<tr class=""><td>'+i+'</td><td>username'+i+'</td><td>1000'+i+'</td></tr>';
          }

          html = html + '</tbody>';
          html = html + '</table>';

          $('.questionrow').hide();
          $('#results').html(html);
          $('#results').show();

    //    setTimeout(function(){
    //    }, timeResult);

    }

}
