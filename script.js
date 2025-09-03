let board = [];
let currentPlayer = 'X';
let mode = '';
let difficulty = 'easy';

function startGame(selectedMode) {
  mode = selectedMode;
  board = Array(9).fill('');
  currentPlayer = 'X';
  difficulty = 'medium'; // par défaut ou via UI si souhaité

  document.getElementById('home').classList.add('hidden');
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  if (mode === 'lan') {
    const action = confirm("Tu es l'hôte ? OK = Offre, Annuler = Réponse");
    if (action) setupLAN();
    else {
      const sdp = prompt("Colle l'offre SDP reçue :");
      receiveOffer(sdp);
      const answer = prompt("Colle ici ta réponse SDP :");
      receiveAnswer(answer);
    }
  }

  updateGrid();
  updateTurn();
}

function updateGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  board.forEach((val, idx) => {
    const cell = document.createElement('div');
    cell.className = val.toLowerCase();
    cell.textContent = val;
    cell.onclick = () => handleClick(idx);
    grid.appendChild(cell);
  });
}

function handleClick(index) {
  if (board[index] !== '' || (mode === 'lan' && (!channel || channel.readyState !== 'open'))) return;

  board[index] = currentPlayer;
  updateGrid();

  if (mode === 'bot') {
    if (checkWin(currentPlayer)) return endGame(`${currentPlayer} gagne !`);
    const botIdx = getBotMove(board, difficulty);
    board[botIdx] = 'O';
    updateGrid();
    if (checkWin('O')) return endGame("Le bot gagne !");
    currentPlayer = 'X';
    updateTurn();
  }
  else if (mode === 'local') {
    if (checkWin(currentPlayer)) return endGame(`${currentPlayer} gagne !`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurn();
  }
  else if (mode === 'lan') {
    sendMoveLAN(index, currentPlayer);
    if (checkWin(currentPlayer)) return endGame(`${currentPlayer} gagne !`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurn();
  }

  if (board.every(c => c !== '')) {
    endGame("Match nul !");
  }
}

function postMoveCheck(player) {
  if (checkWin(player)) {
    endGame(`${player} gagne !`);
  } else if (board.every(c => c !== '')) {
    endGame("Match nul !");
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurn();
  }
}

function updateTurn() {
  document.getElementById('currentPlayer').textContent = currentPlayer;
}

function checkWin(p) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(line => line.every(i => board[i] === p));
}

function endGame(message) {
  document.getElementById('game').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('hidden');
  document.getElementById('resultText').textContent = message;
}

function resetGame() {
  startGame(mode);
}

function goHome() {
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('game').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
}
