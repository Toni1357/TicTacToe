let board, currentPlayer, mode, difficulty;

function enterSetup(m) {
  mode = m;
  document.getElementById('home').classList.add('hidden');
  document.getElementById('setup').classList.remove('hidden');
  ['bot','local','lan'].forEach(x=>{
    document.getElementById(`setup-${x}`)
      .classList.toggle('hidden', x!==m);
  });
}

function startGame(fromSetup) {
  // si startGame() sans argument, on vient du bouton Démarrer après setup
  if (fromSetup!==undefined) return;

  // lecture de la config
  difficulty = document.getElementById('difficulty').value;
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  board = Array(9).fill('');
  currentPlayer = 'X';
  showRole();
  renderGrid();
  updateTurn();

  if(mode==='lan') {
    // la connexion P2P est prête via lan.js
  }
}

function showRole() {
  const span = document.getElementById('yourRole');
  span.textContent = currentPlayer;
  span.className = currentPlayer.toLowerCase();
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  board.forEach((v,i)=>{
    const cell = document.createElement('div');
    cell.className = v.toLowerCase();
    cell.textContent = v;
    cell.onclick = ()=>onCellClick(i);
    grid.appendChild(cell);
  });
}

function onCellClick(i) {
  if(board[i] || document.getElementById('endScreen').offsetParent!==null) return;

  if (mode==='bot') {
    playMove(i);
    if (checkWin(currentPlayer)) return endGame(`${currentPlayer} gagne !`);
    swap();
    const bi = getBotMove(board, difficulty);
    playMove(bi);
    if (checkWin(currentPlayer)) return endGame(`Le bot (${currentPlayer}) gagne !`);
    swap();
  }
  else if(mode==='local') {
    playMove(i);
    if (checkWin(currentPlayer)) return endGame(`${currentPlayer} gagne !`);
    swap();
  }
  else if(mode==='lan') {
    playMove(i);
    sendLAN(i, currentPlayer);
    if (checkWin(currentPlayer)) return endGame(`${currentPlayer} gagne !`);
    swap();
  }

  if(board.every(c=>c)) endGame('Match nul !');
}

function handleRemoteMove(i, player) {
  board[i] = player;
  renderGrid();
  if (checkWin(player)) endGame(`${player} gagne !`);
  swap();
}

function playMove(i) {
  board[i] = currentPlayer;
  renderGrid();
}

function swap() {
  currentPlayer = currentPlayer==='X'?'O':'X';
  updateTurn();
  showRole();
}

function updateTurn() {
  document.getElementById('currentPlayer').textContent = currentPlayer;
}

function checkWin(p) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return lines.some(l=>l.every(i=>board[i]===p));
}

function endGame(msg) {
  document.getElementById('game').classList.add('hidden');
  const end = document.getElementById('endScreen');
  end.classList.remove('hidden');
  document.getElementById('resultText').textContent = msg;
}

function resetGame() {
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  board.fill('');
  currentPlayer = 'X';
  showRole();
  renderGrid();
  updateTurn();
}

function goHome() {
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('game').classList.add('hidden');
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('home').classList.remove('hidden');
}

function confirmQuit() {
  if (confirm('Quitter la partie ?')) goHome();
}
