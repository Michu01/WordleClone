const chances = 6;
const letters = 4;

let pen = { row: 0, col: 0 };
let word = "";
let guessed = false;

function keyPressed(key)
{
    if (pen.row == chances || pen.col == letters || guessed)
    {
        return;
    }

    document.getElementById(`inputWords[${pen.row}][${pen.col}]`).textContent = key;
    ++pen.col;
}

function keyPressedBack()
{
    if (pen.col == 0)
    {
        return;
    }

    --pen.col;
    document.getElementById(`inputWords[${pen.row}][${pen.col}]`).textContent = '';
}

async function checkIfWordExists(word)
{
    let response = await fetch(`https://localhost:7026/Dictionary/Exists?word=${word}`);
    let data = await response.json();
    return data == true;
}

function getWord()
{
    let str = "";

    for (let i = 0; i < letters; ++i)
    {
        let span = document.getElementById(`inputWords[${pen.row}][${i}]`);
        str += span.textContent;
    }

    return str;
}

function updateMessages()
{
    let guessedMessage = document.getElementById('guessedMessage');
    let correctWordMessage = document.getElementById('correctWordMessage');
    
    if (guessed)
    {
        guessedMessage.style.visibility = "visible";
    }
    else
    {
        guessedMessage.style.visibility = "collapse";
    }

    if (!guessed && pen.row == chances - 1)
    {
        correctWordMessage.style.visibility = "visible";
        correctWordMessage.textContent = word;
    }
    else
    {
        correctWordMessage.style.visibility = "collapse";
    }
}

async function keyPressedEnter()
{
    if (pen.row == chances || pen.col != letters)
    {
        return;
    }

    let inputWord = getWord();

    let invalidWordMessage = document.getElementById('invalidWordMessage');

    if (!await checkIfWordExists(inputWord))
    {
        invalidWordMessage.style.visibility = "visible";
        return;
    }
    else
    {
        invalidWordMessage.style.visibility = "collapse";
    }

    guessed = inputWord == word;

    updateMessages();

    for (let i = 0; i < letters; ++i)
    {
        let span = document.getElementById(`inputWords[${pen.row}][${i}]`);
        let button = document.getElementById(`key${inputWord[i].toUpperCase()}`);

        if (inputWord[i] == word[i])
        {
            span.style.backgroundColor = "Green";
            button.style.backgroundColor = "Green";
        }
        else if (word.includes(inputWord[i]))
        {
            span.style.backgroundColor = "Yellow";
            button.style.backgroundColor = "Yellow";
        }
        else
        {
            span.style.backgroundColor = "DimGray";
            button.style.backgroundColor = "DimGray";
        }
    }

    ++pen.row;
    pen.col = 0;
}

function initializeInputWords()
{
    let inputWords = document.getElementById('inputWords');

    inputWords.style.display = "grid";
    inputWords.style.gridTemplateRows = `repeat(${chances}, minmax(0, 1fr))`;
    inputWords.style.gridTemplateColumns = `repeat(${letters}, minmax(0, 1fr))`;

    for (let i = 0; i < 6; ++i)
    {
        for (let j = 0; j < 4; ++j)
        {
            let p = document.createElement('p');

            p.style.gridRow = `${i + 1} / auto`;
            p.style.gridColumn = `${j + 1} / auto`;
            p.style.borderStyle = "solid";
            p.style.borderWidth = "0.1em";
            p.style.borderColor = "black";
            p.style.fontSize = "large";
            p.style.width = "3em";
            p.style.height = "3em";
            p.style.display = "flex";
            p.style.justifyContent = "center";
            p.style.alignItems = "center";

            p.id = `inputWords[${i}][${j}]`;

            inputWords.appendChild(p);
        }
    }
}

async function fetchWord()
{
    let request = await fetch(`https://localhost:7026/Dictionary/Random?length=${letters}`);
    let data = await request.text();
    return data;
}

window.onload = async () => {
    initializeInputWords();
    word = await fetchWord();
}