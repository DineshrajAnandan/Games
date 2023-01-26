function botTurn() {
    if (botCheckRowWinningMove()) return;
    if (botCheckColWinningMove()) return;
    if (botCheckDiagWinningMove()) return;
    if (botCheckCenter()) return;
    if (botCheckOppCornersSameMove()) return;
    if (botCheckRowColSingleOpponentFill()) return;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (!values[i][j]) {
                fillPosition(i, j);
                return;
            }
        }
    }
}

function botCheckRowWinningMove() {
    for (let i = 0; i < 3; i++) {
        let rowArr = values[i];
        let xCnt = rowArr.filter(x => x == 'X').length;
        let oCnt = rowArr.filter(o => o == 'O').length;
        if ((xCnt == 2 && oCnt == 0) || (oCnt == 2 && xCnt == 0)) {
            fillPosition(i, rowArr.indexOf(''));
            return true;
        }
    }
    return false;
}

function botCheckColWinningMove() {
    for (let i = 0; i < 3; i++) {
        let colArr = [values[0][i], values[1][i], values[2][i]];
        let xCnt = colArr.filter(x => x == 'X').length;
        let oCnt = colArr.filter(o => o == 'O').length;
        if ((xCnt == 2 && oCnt == 0) || (oCnt == 2 && xCnt == 0)) {
            fillPosition(colArr.indexOf(''), i);
            return true;
        }
    }
    return false;
}

function botCheckCenter() {
    if (!values[1][1]) {
        fillPosition(1, 1);
        return true;
    }
    else if (totalNoOfMoves == 1) {
        fillPosition(0, 0);
        return true;
    }
    return false;
}

function botCheckDiagWinningMove() {
    let leftDiagArr = [values[0][0], values[1][1], values[2][2]];
    let xCnt = leftDiagArr.filter(x => x == 'X').length;
    let oCnt = leftDiagArr.filter(o => o == 'O').length;
    if ((xCnt == 2 && oCnt == 0) || (oCnt == 2 && xCnt == 0)) {
        let ind = leftDiagArr.indexOf('');
        fillPosition(ind, ind);
        return true;
    }
    let rightDiagArr = [values[0][2], values[1][1], values[2][0]];
    xCnt = rightDiagArr.filter(x => x == 'X').length;
    oCnt = rightDiagArr.filter(o => o == 'O').length;
    if ((xCnt == 2 && oCnt == 0) || (oCnt == 2 && xCnt == 0)) {
        let ind = rightDiagArr.indexOf('');
        let ind2 = (ind == 1) ? 1 : (ind == 2) ? 0 : 2;
        fillPosition(ind, ind2);
        return true;
    }
    return false;
}

function botCheckOppCornersSameMove() {
    let botsOpponent = botIsX ? 'O' : 'X';
    if (values[0][0] == botsOpponent && values[2][2] == botsOpponent && botFillInAnyPlusPlaces()) {
        return true;
    }
    if (values[0][2] == botsOpponent && values[2][0] == botsOpponent && botFillInAnyPlusPlaces()) {
        return true;
    }
    return false;

}

function botFillInAnyPlusPlaces() {
    let plusBoxesVal = [values[0][1], values[1][2], values[2][1], values[1][0]];
    let ind = plusBoxesVal.indexOf('');
    switch (ind) {
        case 0:
            fillPosition(0, 1);
            return true;
        case 1:
            fillPosition(1, 2);
            return true;
        case 2:
            fillPosition(2, 1);
            return true;
        case 3:
            fillPosition(1, 0);
            return true;
        default:
            return false;
    }
}

function botCheckRowColSingleOpponentFill() {
    let botsOpponent = botIsX ? 'O' : 'X';
    for (let i = 0; i < 3; i++) {
        let oppCnt = values[i].filter(x => x == botsOpponent).length;
        let emptyCnt = values[i].filter(x => !x).length;
        if (oppCnt == 1 && emptyCnt == 2) {
            fillPosition(i, values[i].indexOf(''));
            return true;
        }
    }
    for (let i = 0; i < 3; i++) {
        let colArr = [values[0][i], values[1][i], values[2][i]];
        let oppCnt = colArr.filter(x => x == botsOpponent).length;
        let emptyCnt = colArr.filter(x => !x).length;
        if (oppCnt == 1 && emptyCnt == 2) {
            fillPosition(colArr.indexOf(''), i);
            return true;
        }
    }
    return false;
}