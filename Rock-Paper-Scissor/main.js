
let optionsObj = {
    rock: 'rock',
    paper: 'paper',
    scissor: 'scissor'
}

let player = {
    player: 'player',
    cpu: 'cpu'
};

let image = {
    rock: 'img/rock.svg',
    paper: 'img/paper.svg',
    scissor: 'img/scissor.svg',
    fist: 'img/fist.svg'
};

let optionsArr = Object.values(optionsObj);

let playerScore = 0;
let cpuScore = 0;
let displayPlayerOptions = true;

function reset() {
    playerScore = 0;
    cpuScore = 0;
    displayFistAnimation();
    displayScores()
}

function play(option) {
    let moveWonBy = '';
    let cpuOption = getCpuRandomPlay();
    switch (option) {
        case optionsObj.rock:
            if (cpuOption == optionsObj.paper) {
                cpuScore += 1;
                moveWonBy = player.cpu;
            }
            if (cpuOption == optionsObj.scissor) {
                playerScore += 1;
                moveWonBy = player.player;
            }
            break;
        case optionsObj.paper:
            if (cpuOption == optionsObj.rock) {
                playerScore += 1;
                moveWonBy = player.player;
            }
            if (cpuOption == optionsObj.scissor) {
                cpuScore += 1;
                moveWonBy = player.cpu;
            }
            break;
        case optionsObj.scissor:
            if (cpuOption == optionsObj.paper) {
                playerScore += 1;
                moveWonBy = player.player;
            }
            if (cpuOption == optionsObj.rock) {
                cpuScore += 1;
                moveWonBy = player.cpu;
            }
            break;
    }
    removeFistAnimation();
    displayMoveOption(option, cpuOption);
    disablePlayerOptions(true);

    setTimeout(() => {
        moveDecision(moveWonBy);
    }, 500);

}

function moveDecision(moveWonBy) {
    if (!moveWonBy) {
        disablePlayerOptions(false);
        displayFistAnimation();
        return;
    }

    displayMoveWonAnimation(moveWonBy);
    
    setTimeout(() => {
        afterWinMove(moveWonBy);
    }, 2000);
}

function afterWinMove(moveWonBy) {
    displayScores();
    clearMoveWonAnimation(moveWonBy);
    disablePlayerOptions(false);
    displayFistAnimation();
}

function displayMoveWonAnimation(moveWonBy) {
    switch (moveWonBy) {
        case player.player:
            document.getElementById('player-option').classList.add('player-option-anim');
            break;
        case player.cpu:
            document.getElementById('cpu-option').classList.add('cpu-option-anim');
            break;
    }
}

function clearMoveWonAnimation(moveWonBy) {
    switch (moveWonBy) {
        case player.player:
            document.getElementById('player-option').classList.remove('player-option-anim');
            break;
        case player.cpu:
            document.getElementById('cpu-option').classList.remove('cpu-option-anim');
            break;
    }
}

function disablePlayerOptions(isDisable) {
    document.querySelectorAll('.player-choice>button').forEach(elem => {
        elem.disabled = isDisable;
    });
}

function displayMoveOption(option, cpuOption) {
    document.getElementById('player-option').src = image[option];
    document.getElementById('cpu-option').src = image[cpuOption];
}


function displayScores() {
    document.querySelector('#player-score').innerText = playerScore;
    document.querySelector('#cpu-score').innerText = cpuScore;
}

function displayFistAnimation() {
    document.getElementById('player-option').src = image.fist;
    document.getElementById('cpu-option').src = image.fist;
    document.getElementById('player-option').classList.add('player-prepare-anim');
    document.getElementById('cpu-option').classList.add('cpu-prepare-anim');
}

function removeFistAnimation() {
    document.getElementById('player-option').classList.remove('player-prepare-anim');
    document.getElementById('cpu-option').classList.remove('cpu-prepare-anim');
}

function getCpuRandomPlay() {
    let random = Math.floor(Math.random() * 3) + 1;
    return optionsArr[random - 1];
}