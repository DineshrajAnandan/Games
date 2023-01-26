document.onreadystatechange = () => {
  if (document.readyState == 'complete') {
    renderChessBoard();
  }
};

let blackPieceCharCodes = [9818, 9819, 9820, 9821, 9822, 9823];
let charCodeDict = {
  kingBlack: 9818,
  queenBlack: 9819,
  rookBlack: 9820,
  bishopBlack: 9821,
  knightBlack: 9822,
  pawnBlack: 9823,
  circleBlack: 11044,
};
let selectedPieceCharCode = '';
let selectedPieceCellId = '';
let blackExchangePosY = 0;

function renderChessBoard() {
  document.querySelector('div#chess-board-container').innerHTML = '';
  let table = document.createElement('table');
  for (let i = 0; i < 8; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < 8; j++) {
      let td = document.createElement('td');
      td.id = `${i}-${j}`;
      td.className = 'chess-cell';
      td.style.background = (i + j) % 2 == 0 ? '#8a7979' : '#ece7e7'; //black: white
      // '#645656':'#ece7e7';
      tr.appendChild(td);
      addCellClickEvent(td, i, j);
    }
    table.appendChild(tr);
  }
  document.querySelector('div#chess-board-container').appendChild(table);
}

function choosePiece(piece) {
  document.querySelectorAll('.chess-cell').forEach((elem) => {
    elem.innerHTML = '';
  });
  let unicodeVal = '';
  let positionId = '';
  switch (piece) {
    case 'king':
      unicodeVal = `&#${charCodeDict.kingBlack};`;
      positionId = '0-3';
      break;
    case 'queen':
      unicodeVal = `&#${charCodeDict.queenBlack};`;
      positionId = '0-4';
      break;
    case 'rook':
      unicodeVal = `&#${charCodeDict.rookBlack};`;
      positionId = '0-0';
      break;
    case 'bishop':
      unicodeVal = `&#${charCodeDict.bishopBlack};`;
      positionId = '0-2';
      break;
    case 'knight':
      unicodeVal = `&#${charCodeDict.knightBlack};`;
      positionId = '0-1';
      break;
    case 'pawn':
      unicodeVal = `&#${charCodeDict.pawnBlack};`;
      positionId = '1-0';
      break;
    default:
      return;
  }
  plotPiece(unicodeVal, positionId);
}

function plotPiece(pieceUnicode, positionId) {
  document.getElementById(positionId).style.color = 'black';
  document.getElementById(positionId).innerHTML = pieceUnicode;
}

function plotPossibleCell(possibleMovesArr) {
  possibleMovesArr.forEach((id) => {
    let elem = document.getElementById(id);
    elem.innerHTML = `&#${charCodeDict.circleBlack};`;
    elem.classList.add('possible-cell');
  });
}

function addCellClickEvent(elem, posX, posY) {
  elem.addEventListener('click', () => {
    let text = elem.innerText;
    clearCellHighlights();
    clearCircles();

    let charCode = text.charCodeAt(0);
    if (blackPieceCharCodes.includes(charCode)) {
      highlightSelectedPiece(elem);
      selectedPieceCharCode = charCode;
      selectedPieceCellId = `${posX}-${posY}`;
    }

    if (charCode == charCodeDict.circleBlack) {
      if (selectedPieceCharCode == charCodeDict.pawnBlack && posX == 7) {
        blackExchangePosY = posY;
        exchangeBlackPawn();
        return;
      }
      movePiece(`${posX}-${posY}`);
      return;
    }

    switch (charCode) {
      case charCodeDict.kingBlack:
        calcKingMove(posX, posY);
        break;
      case charCodeDict.queenBlack:
        calcQueenMove(posX, posY);
        break;
      case charCodeDict.bishopBlack:
        calcBishopMove(posX, posY);
        break;
      case charCodeDict.rookBlack:
        calcRookMove(posX, posY);
        break;
      case charCodeDict.knightBlack:
        calcKnightMove(posX, posY);
        break;
      case charCodeDict.pawnBlack:
        calcPawnMove(posX, posY);
        break;
    }
  });
}

function highlightSelectedPiece(elem) {
  elem.classList.add('cell-selected');
}

function exchangeBlackPawn() {
  document.getElementById('exchangeBlackPawn-div').style.visibility = 'visible';
}

function exchangePiece(piece) {
  hidePawnExchangeDiv();
  switch (piece) {
    case 'queen':
      selectedPieceCharCode = charCodeDict.queenBlack;
      movePiece(`7-${blackExchangePosY}`);
      break;
    case 'rook':
      selectedPieceCharCode = charCodeDict.rookBlack;
      movePiece(`7-${blackExchangePosY}`);
      break;
    case 'bishop':
      selectedPieceCharCode = charCodeDict.bishopBlack;
      movePiece(`7-${blackExchangePosY}`);
      break;
    case 'knight':
      selectedPieceCharCode = charCodeDict.knightBlack;
      movePiece(`7-${blackExchangePosY}`);
      break;
  }
}

function hidePawnExchangeDiv() {
  document.getElementById('exchangeBlackPawn-div').style.visibility = 'hidden';
}

function clearCellHighlights() {
  let elems = document.getElementsByClassName('cell-selected');
  for (let i = 0; i < elems.length; i++)
    elems[i].classList.remove('cell-selected');
}

function movePiece(cellId) {
  document.getElementById(cellId).innerHTML = `&#${selectedPieceCharCode};`;
  document.getElementById(selectedPieceCellId).innerText = '';
}

function clearCircles() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let elem = document.getElementById(`${i}-${j}`);
      let innerText = elem.innerText;
      if (!innerText) continue;
      if (innerText.charCodeAt(0) == charCodeDict.circleBlack) {
        elem.innerText = '';
        elem.classList.remove('possible-cell');
      }
    }
  }
}
