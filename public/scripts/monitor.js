var socket = io.connect();
var startTime;
var answers;
var currentQuestion;


$( document ).ready(function() {
    socket.emit('addmonitor', channel);

    startGame();
});



function startGame(){
    var endGame = false;
    var questionCount = 1;
    var timeQuestion = 15000;
    var timeResult  = 5000;
    var totalTime = timeQuestion+timeResult;

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
        console.log(time);


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
    socket.emit('unlockallcontroller', 1);
    answers = [];
    startTime = (new Date).getTime() / 1000;
    console.log(startTime);
    currentQuestion = questions[questionCount];
    $('#question span').text(questions[questionCount].question);
    $('#answer1 span').text(questions[questionCount].answers.option1);
    $('#answer2 span').text(questions[questionCount].answers.option2);
    $('#answer3 span').text(questions[questionCount].answers.option3);
    $('#answer4 span').text(questions[questionCount].answers.option4);

    socket.emit('sendanswers', questions[questionCount].answers);
}
