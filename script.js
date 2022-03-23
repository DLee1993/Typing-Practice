const RANDOM_QUOTE_API = "http://api.quotable.io/random",
    quoteText = document.querySelector(".quote-text"),
    inputField = document.querySelector(".input-text"),
    timeCont = document.querySelector(".timer span b"),
    mistakeCont = document.querySelector(".mistakes span"),
    wpmCont = document.querySelector(".wpm span"),
    cpmCont = document.querySelector(".cpm span"),
    toolTip = document.querySelector(".toolTip"),
    results = document.querySelector('.results-container'),
    accuracyEl = document.querySelector('.percentage'),
    restart = document.querySelector('button');

let timer,
    maxTime = 240,
    timeLeft = maxTime,
    characterIndex = 0,
    mistakes = 0,
    userTyping;


function typing() {
    const characters = quoteText.querySelectorAll("span");
    let typedChar = inputField.value.split("")[characterIndex];

    if (!userTyping) {
        timer = setInterval(startTimer, 1000);
        userTyping = true;
    }

    if (typedChar == null) {
        characterIndex--;
        if (characters[characterIndex].classList.contains("incorrect")) {
            mistakes--;
        }
        characters[characterIndex].classList.remove("correct", "incorrect");
    } else {
        if (characters[characterIndex].innerText === typedChar) {
            characters[characterIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[characterIndex].classList.add("incorrect");
        }
        characterIndex++;
        toolTip.style.display = "none";
    }

    if (characters.length === characterIndex) {
        results.style.display = "flex";
        quoteText.style.display = "none";
        let number = 0; 
        characters.forEach((span) => {
            if(span.classList.contains('correct')){
                number++
            }
        }); 
        accuracyEl.innerText = Math.floor(number / characters.length * 100);
    }

    let wpm = Math.round(
        ((characterIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );

    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    mistakeCont.innerText = mistakes;
    wpmCont.innerText = wpm;
    cpmCont.innerText = characterIndex - mistakes;

    characters.forEach((span) => span.classList.remove("active"));
    if(characterIndex < characters.length){
        characters[characterIndex].classList.add('active')
    }
}

function startTimer() {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timer);
    }
}

function noInput() {
    toolTip.style.display = "block";
}

//* Get a random quote and pass it to the quoteText element
function getRandomQuote() {
    return fetch(RANDOM_QUOTE_API)
        .then((response) => response.json())
        .then((data) => data.content);
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteText.innerHTML = "";
    quote.split("").forEach((character) => {
        const characterSpan = document.createElement("span");
        characterSpan.innerText = character;
        quoteText.appendChild(characterSpan);
    });
    const characters = document.querySelectorAll("span");
    characters[0].classList.add("active");
    quoteText.value = null;
    setTimeout(function(){
        if(characterIndex == 0){
            noInput();
        }
    }, 2500)
}
renderNewQuote();

//* Event listeners for input field
restart.addEventListener('click', () => location.reload())
document.addEventListener("keydown", () => inputField.focus());
inputField.addEventListener("input", () => typing());
