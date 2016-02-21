var socket = io.connect();
var startTime;
var answers;
var currentQuestion;
var timeQuestion = 15000;
var timeResult  = 5000;
var totalTime = timeQuestion+timeResult;
var remainingTime;


$( document ).ready(function() {
    socket.emit('addmonitor', channel);
    startGame();
});



function startGame(){
    var endGame = false;
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

    socket.on('updateoption', function (username,data) {
        var answereTime = (new Date).getTime() / 1000;
        var time = parseFloat(answereTime) - parseFloat(startTime);

        for (i = 0; i < answers.length; i++) {
            if(answers[i].username == username){
                return false;
            }
        }

        if(currentQuestion.correct==data){
            //calculate points
        }else{

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

    socket.emit('unlockallcontroller', 1);
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
    $('#answer'+currentQuestion.correct).addClass('correct');
    console.log("show correct answere");
}
