function playLocal(index) {
  if (board[index] !== '') return;
  board[index] = currentPlayer;
  updateBoard();
  if (checkWin(board, currentPlayer)) alert(`${currentPlayer} gagne !`);
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}
