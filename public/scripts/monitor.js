var socket = io.connect();

$( document ).ready(function() {
    socket.emit('addmonitor', channel);

    startGame();



    socket.on('updateoption', function (username,data) {
        console.log(username);
        console.log(data);
    });
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
    }, 20000);
}

function nextQuestion(questionCount){
    socket.emit('unlockallcontroller', 1);
    $('#question span').text(questions[questionCount].question);
    $('#answer1 span').text(questions[questionCount].answers.option1);
    $('#answer2 span').text(questions[questionCount].answers.option2);
    $('#answer3 span').text(questions[questionCount].answers.option3);
    $('#answer4 span').text(questions[questionCount].answers.option4);

    socket.emit('sendanswers', questions[questionCount].answers);
}
