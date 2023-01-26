let values = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
let xoToggle = true; // lets keep true for 'X' and false for 'O'
let totalNoOfMoves = 0;
let matchComplete = false;
let playWithBot = false;
let botIsX = false;
let botsValue = 'X';
let botIsPlaying = false;

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        initializeClickEvents();
        playerCheck();
    }
};

function initializeClickEvents() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            document.getElementById(`${i}${j}`).addEventListener('click', () => {
                if (botIsPlaying || matchComplete) return;
                fillPosition(i, j);
            });
        }
    }
}

function changeBotsValue(value) {
    if (totalNoOfMoves > 0) return; // play is already in progress
    if (!playWithBot) return;
    botsValue = value;
    botIsX = botsValue == 'X';
    if (botIsX) {
        botIsPlaying = true;
        botTurn();
        botIsPlaying = false;
    }
}

function fillPosition(i, j) {
    let presentText = document.getElementById(`${i}${j}`).innerText.trim();
    let fillValue = xoToggle ? 'X' : 'O'
    if (!presentText) {
        totalNoOfMoves++;
        document.getElementById(`${i}${j}`).innerText = values[i][j] = fillValue;
        checkWinningMove(fillValue);
        xoToggle = !xoToggle;
        playerCheck();
    }
}

function playerCheck() {
    if(matchComplete) return;
    let currPlayerIdName = xoToggle ? 'x-stat' : 'o-stat';
    let oppPlayerIdName = xoToggle ? 'o-stat' : 'x-stat';

    document.getElementById(currPlayerIdName).style.background = 'aqua';
    document.getElementById(oppPlayerIdName).style.background = 'white';

    checkBotsTurn();
}

function checkBotsTurn() {
    if (playWithBot && botIsX == xoToggle) {
        botIsPlaying = true;
        setTimeout(() => {
            botTurn();
            botIsPlaying = false;
        }, 500);
    }
}

function checkWinningMove(fillValue) {
    if (winningCheck(fillValue)) {
        document.getElementById('winner-display-div').style.display = 'block';
        document.getElementById('winner-display').innerText = `${fillValue} won`;
        matchComplete = true;
    }
    else if (totalNoOfMoves >= 9) {
        document.getElementById('winner-display-div').style.display = 'block';
        document.getElementById('winner-display').innerText = `Draw`;
        matchComplete = true;
    }

}

function winningCheck(fillValue) {
    let toCheck = ['row', 'col', 'diag'];
    for (let t = 0; t < toCheck.length; t++) {
        if ((toCheck[t] == 'row' || toCheck[t] == 'col') &&
            rowOrColWinningCheck(fillValue, toCheck[t])) {
            return true;
        }
        else if (toCheck[t] == 'diag' &&
            (leftDiagWinningCheck(fillValue) || rightDiagWinningCheck(fillValue))) {
            return true;
        }
    }
    return false;
}

function leftDiagWinningCheck(fillValue) {
    for (let i = 0; i < 3; i++) {
        if (values[i][i] != fillValue) return false;
    }
    fillWinningCells('leftDiag');
    return true;
}

function rightDiagWinningCheck(fillValue) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (i + j == 2 && values[i][j] != fillValue) return false;
        }
    }
    fillWinningCells('rightDiag');
    return true;
}

function rowOrColWinningCheck(fillValue, toCheck) {
    for (let i = 0; i < 3; i++) {
        let matchFound = true;
        for (let j = 0; j < 3; j++) {
            matchFound = toCheck == 'row' ?
                values[i][j] == fillValue : values[j][i] == fillValue;
            if (!matchFound) break;
        }
        if (matchFound) {
            fillWinningCells(toCheck, i);
            return true;
        }
    }
    return false;
}

function fillWinningCells(toFill, index = -1) {
    if (toFill == 'row' || toFill == 'col') {
        for (let i = 0; i < 3; i++) {
            let id = toFill == 'row' ? `${index}${i}` : `${i}${index}`;
            document.getElementById(id).style.background = 'grey';
        }
        return;
    }
    if (toFill == 'leftDiag') {
        for (let i = 0; i < 3; i++) {
            document.getElementById(`${i}${i}`).style.background = 'grey';
        }
        return;
    }
    if (toFill == 'rightDiag') {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i + j == 2) document.getElementById(`${i}${j}`).style.background = 'grey';
            }
        }
        return;
    }
}

function restartGame() {
    matchComplete = false;
    xoToggle = true;
    totalNoOfMoves = 0;
    botIsX = false;
    botsValue = 'X';
    values = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    document.querySelectorAll('td').forEach(elem => {
        elem.style.background = 'white';
        elem.innerText = '';
    });
    document.getElementById('winner-display-div').style.display = 'none';
    playerCheck();
}

function togglePlayWithBot(checkElem) {
    restartGame();
    playWithBot = checkElem.checked;
}