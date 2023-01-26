document.onreadystatechange = () => {
	if (document.readyState == 'complete') {
		renderChessBoard();
	}
};

let blackPieceCharCodes = [9818, 9819, 9820, 9821, 9822, 9823];
let whitePieceCharCodes = [9812, 9813, 9814, 9815, 9816, 9817];
let charCodeDict = {
	kingWhite: 9812,
	queenWhite: 9813,
	rookWhite: 9814,
	bishopWhite: 9815,
	knightWhite: 9816,
	pawnWhite: 9817,
	kingBlack: 9818,
	queenBlack: 9819,
	rookBlack: 9820,
	bishopBlack: 9821,
	knightBlack: 9822,
	pawnBlack: 9823,
	circleBlack: 11044,
};
let colorDict = {
	white: 'white',
	black: 'black'
}
let selectedPieceCharCode = '';
let selectedPieceCellId = '';
let selectedPieceColor = '';
let blackExchangePosY = 0;
let whiteExchangePosY = 0;
let currPlayerWhite = true;
let dangerPiecesPositionIdArr = [];
let wonBy = '';
let restrictClick = false;

function renderChessBoard() {
	document.querySelector('div#chess-board-container').innerHTML = '';
	let table = document.createElement('table');
	for (let i = 0; i < 8; i++) {
		let tr = document.createElement('tr');
		for (let j = 0; j < 8; j++) {
			let td = document.createElement('td');
			let tddiv = document.createElement('div');
			tddiv.id = `${i}-${j}`;
			tddiv.className = 'chess-cell-div';
			td.className = 'chess-cell';
			td.style.background = (i + j) % 2 == 0 ? '#8a7979' : '#ece7e7'; //black: white

			td.appendChild(tddiv);
			tr.appendChild(td);
			addCellClickEvent(td, i, j);
		}
		table.appendChild(tr);
	}
	document.querySelector('div#chess-board-container').appendChild(table);
	rearrangePieces();
}

function clearHeadSpace() {
	var elem = document.getElementById('head-win-stat');
	elem.innerText = '';
	elem.style.display = 'none';
}

function rearrangePieces() {
	clearBoard();
	clearPiecesDeck();
	currPlayerWhite = true;
	changeCurrentPlayerStatus();
	clearHeadSpace();
	restrictClick = false;

	//arrange black pieces
	document.getElementById('0-0').innerHTML = `&#${charCodeDict.rookBlack};`;
	document.getElementById('0-1').innerHTML = `&#${charCodeDict.knightBlack};`;
	document.getElementById('0-2').innerHTML = `&#${charCodeDict.bishopBlack};`;
	document.getElementById('0-3').innerHTML = `&#${charCodeDict.queenBlack};`;
	document.getElementById('0-4').innerHTML = `&#${charCodeDict.kingBlack};`;
	document.getElementById('0-5').innerHTML = `&#${charCodeDict.bishopBlack};`;
	document.getElementById('0-6').innerHTML = `&#${charCodeDict.knightBlack};`;
	document.getElementById('0-7').innerHTML = `&#${charCodeDict.rookBlack};`;

	// arrange black pawns
	for (let j = 0; j < 8; j++) {
		let elem = document.getElementById(`1-${j}`);
		elem.innerHTML = `&#${charCodeDict.pawnBlack};`;
	}

	//arrange white pieces
	document.getElementById('7-0').innerHTML = `&#${charCodeDict.rookWhite};`;
	document.getElementById('7-1').innerHTML = `&#${charCodeDict.knightWhite};`;
	document.getElementById('7-2').innerHTML = `&#${charCodeDict.bishopWhite};`;
	document.getElementById('7-3').innerHTML = `&#${charCodeDict.queenWhite};`;
	document.getElementById('7-4').innerHTML = `&#${charCodeDict.kingWhite};`;
	document.getElementById('7-5').innerHTML = `&#${charCodeDict.bishopWhite};`;
	document.getElementById('7-6').innerHTML = `&#${charCodeDict.knightWhite};`;
	document.getElementById('7-7').innerHTML = `&#${charCodeDict.rookWhite};`;

	// arrange white pawns
	for (let j = 0; j < 8; j++) {
		let elem = document.getElementById(`6-${j}`);
		elem.innerHTML = `&#${charCodeDict.pawnWhite};`;
	}
}

function clearBoard() {
	document.querySelectorAll('.chess-cell-div').forEach((elem) => {
		elem.innerHTML = '';
	});
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
		clickHandle(elem, posX, posY);
	});
}

function clickHandle(elem, posX, posY) {
	if (restrictClick) return;
	let charCode = elem.innerText.charCodeAt(0);

	clearCellHighlights();
	clearCircles();
	clearDangerCellsPlot();

	let dangerPicked = checkDangerPiecePick(posX, posY);
	if (dangerPicked) return;

	let isInvalid = checkSelectedPiece(posX, posY, charCode);
	if (isInvalid) return;

	let moved = moveDecision(posX, posY, charCode);
	if (moved) return;

	chooseCalcMethod(posX, posY, charCode);
	plotDangerCells();
}

function checkSelectedPiece(posX, posY, charCode) {
	if (blackPieceCharCodes.includes(charCode)) {
		if (currPlayerWhite) return true;
		highlightSelectedPiece(posX, posY);
		selectedPieceCharCode = charCode;
		selectedPieceCellId = `${posX}-${posY}`;
		selectedPieceColor = 'black';
	}
	else if (whitePieceCharCodes.includes(charCode)) {
		if (!currPlayerWhite) return true;
		highlightSelectedPiece(posX, posY);
		selectedPieceCharCode = charCode;
		selectedPieceCellId = `${posX}-${posY}`;
		selectedPieceColor = 'white';
	}
	return false;
}

function checkDangerPiecePick(posX, posY) {
	let elemId = `${posX}-${posY}`;
	if (dangerPiecesPositionIdArr.includes(elemId)) {
		let removePiece = document.getElementById(elemId).innerText;

		if (checkWinning(removePiece.charCodeAt(0))) {
			handleWin();
			return true;
		}

		addRemovedPieceToDeck(removePiece.charCodeAt(0));
		currPlayerWhite = !currPlayerWhite;
		changeCurrentPlayerStatus();
		movePiece(`${posX}-${posY}`);
		dangerPiecesPositionIdArr = [];

		checkPawnExchange(posX, posY);
		return true;
	}
	dangerPiecesPositionIdArr = [];
	return false;
}

function handleWin() {
	var elem = document.getElementById('head-win-stat');
	elem.innerText = `${wonBy} Won`;
	elem.style.display='block';
	restrictClick = true;
}

function moveDecision(posX, posY, charCode) {
	if (charCode == charCodeDict.circleBlack) {
		currPlayerWhite = !currPlayerWhite;
		changeCurrentPlayerStatus();

		let exchangeOpen = checkPawnExchange(posX, posY);
		if (exchangeOpen) return true;

		movePiece(`${posX}-${posY}`);
		return true;
	}
	return false;
}

function checkPawnExchange(posX, posY) {
	if (selectedPieceCharCode == charCodeDict.pawnBlack && posX == 7) {
		blackExchangePosY = posY;
		exchangeBlackPawn();
		return true;
	}
	if (selectedPieceCharCode == charCodeDict.pawnWhite && posX == 0) {
		whiteExchangePosY = posY;
		exchangeWhitePawn();
		return true;
	}
	return false;
}

function chooseCalcMethod(posX, posY, charCode) {
	switch (charCode) {
		case charCodeDict.kingBlack:
		case charCodeDict.kingWhite:
			calcKingMove(posX, posY);
			break;
		case charCodeDict.queenBlack:
		case charCodeDict.queenWhite:
			calcQueenMove(posX, posY);
			break;
		case charCodeDict.bishopBlack:
		case charCodeDict.bishopWhite:
			calcBishopMove(posX, posY);
			break;
		case charCodeDict.rookBlack:
		case charCodeDict.rookWhite:
			calcRookMove(posX, posY);
			break;
		case charCodeDict.knightBlack:
		case charCodeDict.knightWhite:
			calcKnightMove(posX, posY);
			break;
		case charCodeDict.pawnBlack:
		case charCodeDict.pawnWhite:
			calcPawnMove(posX, posY);
			break;
	}
}

function checkWinning(removePieceCharCode) {
	if (removePieceCharCode == charCodeDict.kingBlack) {
		wonBy = 'White';
		return true;
	}
	else if (removePieceCharCode == charCodeDict.kingWhite) {
		wonBy = 'Black';
		return true;
	}
	return false;
}

function addRemovedPieceToDeck(charCode) {
	if (blackPieceCharCodes.includes(charCode)) {
		document.getElementById('black-deck').innerHTML += `&#${charCode};`;
	}
	else {
		document.getElementById('white-deck').innerHTML += `&#${charCode};`
	}
}

function clearPiecesDeck() {
	document.getElementById('black-deck').innerHTML = '';
	document.getElementById('white-deck').innerHTML = '';
}

function changeCurrentPlayerStatus() {
	if (currPlayerWhite)
		document.getElementById('currPlayerStat').style.backgroundColor = "white";
	else
		document.getElementById('currPlayerStat').style.backgroundColor = "black";
}

function highlightSelectedPiece(posX, posY) {
	document.getElementById(`${posX}-${posY}`).classList.add('cell-selected');
}

function exchangeBlackPawn() {
	document.getElementById('exchangeBlackPawn-div').style.visibility = 'visible';
}

function exchangeWhitePawn() {
	document.getElementById('exchangeWhitePawn-div').style.visibility = 'visible';
}

function exchangePiece(piece, pieceColor) {
	hidePawnExchangeDiv();
	switch (`${piece}-${pieceColor}`) {
		case 'queen-black':
			selectedPieceCharCode = charCodeDict.queenBlack;
			movePiece(`7-${blackExchangePosY}`);
			break;
		case 'rook-black':
			selectedPieceCharCode = charCodeDict.rookBlack;
			movePiece(`7-${blackExchangePosY}`);
			break;
		case 'bishop-black':
			selectedPieceCharCode = charCodeDict.bishopBlack;
			movePiece(`7-${blackExchangePosY}`);
			break;
		case 'knight-black':
			selectedPieceCharCode = charCodeDict.knightBlack;
			movePiece(`7-${blackExchangePosY}`);
			break;
		case 'queen-white':
			selectedPieceCharCode = charCodeDict.queenWhite;
			movePiece(`0-${whiteExchangePosY}`);
			break;
		case 'rook-white':
			selectedPieceCharCode = charCodeDict.rookWhite;
			movePiece(`0-${whiteExchangePosY}`);
			break;
		case 'bishop-white':
			selectedPieceCharCode = charCodeDict.bishopWhite;
			movePiece(`0-${whiteExchangePosY}`);
			break;
		case 'knight-white':
			selectedPieceCharCode = charCodeDict.knightWhite;
			movePiece(`0-${whiteExchangePosY}`);
			break;
	}
}

function hidePawnExchangeDiv() {
	document.getElementById('exchangeBlackPawn-div').style.visibility = 'hidden';
	document.getElementById('exchangeWhitePawn-div').style.visibility = 'hidden';
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

function plotDangerCells() {
	dangerPiecesPositionIdArr.forEach(id => {
		document.getElementById(id).classList.add('danger-cell');
	});
}

function clearDangerCellsPlot() {
	let elems = document.querySelectorAll('.danger-cell');
	if (elems && elems.length > 0) {
		for (let i = 0; i < elems.length; i++) {
			elems.item(i).classList.remove('danger-cell');
		}
	}
}