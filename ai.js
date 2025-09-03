function getBotMove(board, difficulty) {
  const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  if (difficulty === 'easy') return empty[Math.floor(Math.random() * empty.length)];
  if (difficulty === 'medium') return empty[0]; // simplifié
  if (difficulty === 'hard') return minimax(board, 'O').index;
}

function minimax(board, player) {
  const opponent = player === 'X' ? 'O' : 'X';
  const empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);

  if (checkWin(board, 'X')) return { score: -10 };
  if (checkWin(board, 'O')) return { score: 10 };
  if (empty.length === 0) return { score: 0 };

  const moves = [];
  for (let i of empty) {
    const newBoard = [...board];
    newBoard[i] = player;
    const result = minimax(newBoard, opponent);
    moves.push({ index: i, score: result.score });
  }

  return player === 'O'
    ? moves.reduce((a, b) => a.score > b.score ? a : b)
    : moves.reduce((a, b) => a.score < b.score ? a : b);
}
