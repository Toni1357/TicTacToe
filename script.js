let board = Array(9).fill('');
let currentPlayer = 'X';
let mode = '';

function startGame(selectedMode) {
  mode = selectedMode;
  board = Array(9).fill('');
  currentPlayer = 'X';
  document.getElementById('home').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  document.getElementById('endScreen').classList.add('hidden');
  updateGrid();
  updateTurn();
}

function updateGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = val.toLowerCase();
    cell.textContent = val;
    cell.onclick = () => handleClick(i);
    grid.appendChild(cell);
  });
}

function handleClick(index) {
  if (board[index] !== '') return;

  board[index] = currentPlayer;
  updateGrid();

  if (checkWin(currentPlayer)) {
    showEnd(`${currentPlayer} gagne !`);
  } else if (board.every(cell => cell !== '')) {
    showEnd("Match nul !");
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurn();
  }
}

function updateTurn() {
  document.getElementById('currentPlayer').textContent = currentPlayer;
}

function checkWin(p) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(line => line.every(i => board[i] === p));
}

function showEnd(message) {
  document.getElementById('game').classList.add('hidden');
  document.getElementById('endScreen').classList.remove('hidden');
  document.getElementById('resultText').textContent = message;
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  updateGrid();
  updateTurn();
}

function goHome() {
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
}
