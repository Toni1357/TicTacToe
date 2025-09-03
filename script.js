let board = Array(9).fill('');
let currentPlayer = 'X';
let mode = 'bot';

function startGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  mode = document.getElementById('mode').value;
  const pseudo = document.getElementById('pseudo').value;
  const difficulty = document.getElementById('difficulty').value;

  updateBoard();

  if (mode === 'lan' && pseudo) {
    setupLAN(pseudo);
  }
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  updateBoard();
}

function updateBoard() {
  const game = document.getElementById('game');
  game.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.textContent = val;
    cell.onclick = () => handleClick(i);
    game.appendChild(cell);
  });
}

function handleClick(index) {
  if (board[index] !== '') return;

  if (mode === 'local') {
    playLocal(index);
  } else if (mode === 'bot') {
    board[index] = 'X';
    updateBoard();
    if (checkWin(board, 'X')) return alert("Tu gagnes !");
    const botMove = getBotMove(board, document.getElementById('difficulty').value);
    board[botMove] = 'O';
    updateBoard();
    if (checkWin(board, 'O')) return alert("Le bot gagne !");
  } else if (mode === 'lan') {
    board[index] = currentPlayer;
    updateBoard();
    sendMove(index, currentPlayer);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

function checkWin(b, p) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(line => line.every(i => b[i] === p));
}
