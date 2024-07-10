let currentQuestion = 0;
let score = 0;
let timeLeft = 10; 
let timerInterval;

const questions = [
    {
        question: "1.¿Quién fue el último zar de Rusia?",
        answers: [
            { text: "Nicólas Románov", correct: true},
            { text: "Lenin", correct: false},
            { text: "Iósif Stalin", correct: false },
            { text: "Benjamin Franklin", correct: false }
        ]
    },
    {
        question: "2.¿Quién unificó el norte (Nóvgorod) y el sur (Kiev), creando la Rus de Kiev, el primer estado eslavo oriental?",
        answers: [
            { text: "Ivan el Terrible", correct: false},
            { text: "Iósif Stalin", correct: false },
            { text: "Oleg de Nóvgorod", correct: true},
            { text: "Vladímir Putin", correct: false }
        ]       
    },
    {
        question: "3.¿Capital de Rusia?",
        answers: [
            { text: "Moscu", correct: true},
            { text: "Stalingrado", correct: false },
            { text: "Onrad", correct: false},
            { text: "Lingrado", correct: false }
        ]      
    },
    {
        question: "4.¿Cuántos kilometros cuadrados abarca el país?",
        answers: [
            { text: "16 millones de kilómetros cuadrados", correct: false},
            { text: "15 millones de kilómetros cuadrados", correct: false },
            { text: "17 millones de kilómetros cuadrados", correct: true},
            { text: "11 millones de kilómetros cuadrados", correct: false }
        ]      
    } ,
    {
        question: "5.¿En que año de disolvió la Unión Soviética?",
        answers: [
            { text: "1991", correct: true},
            { text: "1993", correct: false },
            { text: "1999", correct: false},
            { text: "1983", correct: false }
        ]      
    } 
];

function loadQuestion() {
    const quizForm = document.getElementById('quizForm');
    const resultDiv = document.getElementById('result');
    const questionElement = document.getElementById('question');
    resultDiv.innerHTML = '';
    quizForm.reset();
    const current = questions[currentQuestion];
    questionElement.textContent = current.question;
    for (let i = 0; i < 4; i++) {
        const answerElement = document.getElementById(`respuesta${i + 1}`);
        const labelElement = answerElement.nextElementSibling;
        answerElement.value = current.answers[i].correct ? 'correcto' : 'incorrecto';
        labelElement.textContent = current.answers[i].text;
    }
    startTimer();
}

function startTimer() {
    timeLeft = 10; 
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

function updateTimer() {
    const timeBar = document.getElementById('timeBar');
    timeBar.style.width = (timeLeft * 10) + '%'; 
}

function checkAnswer() {
    clearInterval(timerInterval);
    const radios = document.getElementsByName('respuesta');
    let selectedValue;
    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break;
        }
    }
    const resultDiv = document.getElementById('result');
    if (selectedValue === 'correcto') {
        resultDiv.innerHTML = '<div class="alert alert-success" role="alert">¡Correcto!</div>';
        score += 2;
    } else {
        resultDiv.innerHTML = '<div class="alert alert-danger" role="alert">Respuesta incorrecta. Inténtalo de nuevo.</div>';
    }
    setTimeout(nextQuestion, 3000);
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        const questionElement = document.getElementById('question');
        const quizForm = document.getElementById('quizForm');
        questionElement.textContent = `¡Has completado el quiz! Tu puntaje es: ${score} puntos.`;
        quizForm.classList.add('hidden');
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <button onclick="registerScore()" class="btn btn-primary">Registrar Puntuación</button>
            <button onclick="resetQuiz()" class="btn btn-secondary">Volver a hacer el cuestionario</button>
        `;
    }
}

function registerScore() {
    const usuario = prompt("Introduce tu nombre o apodo:");

    if (usuario) {
        fetch('/register_score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `usuario=${encodeURIComponent(usuario)}&puntaje=${score}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert("No se ha registrado la puntuación. Se requiere un nombre o apodo.");
    }
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quizForm').classList.remove('hidden');
    loadQuestion();
}

loadQuestion();