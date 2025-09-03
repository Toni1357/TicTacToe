// Niveau Bot : facile, moyen, difficile (Minimax)
function getBotMove(board, difficulty) {
  const empties = board
    .map((v, i) => v === '' ? i : null)
    .filter(i => i !== null);

  if (difficulty === 'easy') {
    return empties[Math.floor(Math.random() * empties.length)];
  }
  if (difficulty === 'medium') {
    // bloque ou joue aléatoire
    for (let i of empties) {
      let copy = board.slice();
      copy[i] = 'O';
      if (checkWin(copy, 'O')) return i;
      copy[i] = 'X';
      if (checkWin(copy, 'X')) return i;
    }
    return empties[Math.floor(Math.random() * empties.length)];
  }
  // hard
  return minimax(board, 'O').index;
}

function minimax(board, player) {
  const opponent = player === 'X' ? 'O' : 'X';
  if (checkWin(board, 'X'))  return { score: -10 };
  if (checkWin(board, 'O'))  return { score:  10 };
  if (board.every(v => v !== '')) return { score:  0 };

  let moves = [];
  board.forEach((v, i) => {
    if (v === '') {
      let copy = board.slice();
      copy[i] = player;
      let result = minimax(copy, opponent);
      moves.push({ index: i, score: result.score });
    }
  });

  return player === 'O'
    ? moves.reduce((a, b) => a.score > b.score ? a : b)
    : moves.reduce((a, b) => a.score < b.score ? a : b);
}
