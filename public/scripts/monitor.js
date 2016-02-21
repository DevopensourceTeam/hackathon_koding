var socket = io.connect();
var startTime;
var answers;
var currentQuestion;
var timeQuestion = 10000;
var timeResult  = 5000;
var totalTime = timeQuestion+timeResult;
var remainingTime;
var endGame = false;
var reducePoints = 1000;
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

    var intervalQuestion = setInterval(function(){
        remainingTime = remainingTime-1000;
        if(remainingTime<0){
            clearInterval(intervalQuestion);
            showCorrectAnswere();
        }else{
            $('#timer span').text(remainingTime/1000);
        }
    }, 1000);

    socket.emit('lockallcontroller', 0);
    answers = [];
    startTime = (new Date).getTime() / 1000;
    currentQuestion = questions[questionCount];
    $('#question span').text(questions[questionCount].question);
    $('#answer1 span').text(questions[questionCount].answers.option1);
    $('#answer2 span').text(questions[questionCount].answers.option2);
    $('#answer3 span').text(questions[questionCount].answers.option3);
    $('#answer4 span').text(questions[questionCount].answers.option4);

    socket.emit('sendanswers', questions[questionCount].answers);
}

function showCorrectAnswere(){
    socket.emit('lockallcontroller', 1);

    $('#answer'+currentQuestion.correct).addClass('correct');

    // Send points status to user
    socket.emit('getpoints');

    console.log("show correct answere");

    if(endGame){
        setTimeout(function(){
            socket.emit('endgame');
        }, timeResult);
    }

}
