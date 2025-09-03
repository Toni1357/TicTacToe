let board, currentPlayer, mode, difficulty;

function enterSetup(m) {
  mode = m;
  document.getElementById('home').classList.add('hidden');
  document.getElementById('setup').classList.remove('hidden');
  ['bot','local','lan'].forEach(x=> {
    document.getElementById(`setup-${x}`).classList.toggle('hidden', x!==m);
  });
}

function startGame() {
  difficulty = document.getElementById('difficulty')?.value || 'easy';
  board = Array(9).fill('');
  currentPlayer = 'X';
  showScreen('game');
  showRole(); renderGrid(); updateTurn();

  if (mode==='lan' && dataChannel && dataChannel.readyState==='open') {
    // partie lancée automatiquement en lan.js
  }
}

function showScreen(id) {
  ['home','setup','game','endScreen'].forEach(i=> 
    document.getElementById(i).classList.toggle('hidden', i!==id)
  );
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  board.forEach((v,i)=> {
    const cell = document.createElement('div');
    cell.className = v.toLowerCase();
    cell.textContent = v;
    cell.onclick = ()=>onCellClick(i);
    grid.appendChild(cell);
  });
}

function onCellClick(i) {
  if (board[i] || (mode==='lan' && (!dataChannel||dataChannel.readyState!=='open'))) return;
  playMove(i);
  if (checkWin(currentPlayer)) return finish(`${currentPlayer} gagne !`);
  if (mode==='bot') {
    swap(); 
    const bi = getBotMove(board, difficulty);
    playMove(bi);
    if (checkWin(currentPlayer)) return finish(`Le bot (${currentPlayer}) gagne !`);
  }
  if (mode==='lan') sendLAN(i, currentPlayer);
  if (board.every(c=>c)) return finish('Match nul !');
  swap();
}

function playMove(i) {
  board[i] = currentPlayer; renderGrid();
}

function handleRemoteMove(i, p) {
  board[i] = p; renderGrid();
  if (checkWin(p)) return finish(`${p} gagne !`);
  swap();
}

function swap() {
  currentPlayer = currentPlayer==='X'?'O':'X';
  updateTurn(); showRole();
}

function showRole() {
  const span = document.getElementById('yourRole');
  span.textContent = currentPlayer;
  span.className = currentPlayer.toLowerCase();
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
  return combos.some(line=> line.every(i=> board[i]===p));
}

function finish(msg) {
  document.getElementById('resultText').textContent = msg;
  showScreen('endScreen');
}

function resetGame() {
  showScreen('game'); board.fill(''); currentPlayer='X';
  showRole(); renderGrid(); updateTurn();
}

function goHome() {
  showScreen('home');
}

function confirmQuit() {
  if (confirm('Quitter la partie ?')) goHome();
}
