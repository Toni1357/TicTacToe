// IA 3 niveaux : easy, medium, hard (Minimax)
function getBotMove(board, difficulty) {
  const empties = board.map((v,i)=>v===''?i:null).filter(i=>i!==null);
  if (difficulty==='easy') {
    return empties[Math.floor(Math.random()*empties.length)];
  }
  if (difficulty==='medium') {
    // bloquer ou random
    for (let i of empties) {
      let c1=[...board]; c1[i]='O';
      if (checkWin(c1,'O')) return i;
      let c2=[...board]; c2[i]='X';
      if (checkWin(c2,'X')) return i;
    }
    return empties[Math.floor(Math.random()*empties.length)];
  }
  // hard
  return minimax(board,'O').index;
}

function minimax(bd, player) {
  const opp = player==='X'?'O':'X';
  if (checkWin(bd,'X'))  return { score:-10 };
  if (checkWin(bd,'O'))  return { score: 10 };
  if (bd.every(v=>v!=='')) return { score: 0 };

  let moves=[];
  bd.forEach((v,i)=>{
    if(v===''){
      let copy=[...bd]; copy[i]=player;
      let res = minimax(copy, opp);
      moves.push({ index:i, score:res.score });
    }
  });

  return player==='O'
    ? moves.reduce((a,b)=>a.score>b.score?a:b)
    : moves.reduce((a,b)=>a.score<b.score?a:b);
}
