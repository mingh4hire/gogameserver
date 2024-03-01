import express from 'express';

 
let board = Array.apply(null, Array(20)).map(x=> Array(20))
const app = express();
app.use('/', express.static('game'));
let cnter =0;
app.use ('*', function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});
 
app.use(express.json());
app.get('/board', (req, res) => {
  res.send(board);
});
app.get('/restart', (req, res) => {
  cnter = 0;
  board = Array.apply(1, Array(20)).map(x=> Array(20))
  res.send();
});
 

app.get('/move/:x/:y', (req, res) => {
    const cnt = board.reduce((x,y)=>  x + y.reduce((prev, next)=>prev + (next ? 1 : 0 ) , 0) , 0);
    const x = +req.params.x;
    const y = +req.params.y;
    if (cnt % 2 == 0){
      board[y][x] = 1;
    }else{
      board[y][x]= -1;
    }
    checkwin(x,y);
    cnter++;
    res.send(board);
});

const PORT = 8081;
 
app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
})
 
 
let checkwin = (x, y)  =>{
  let isgreen = -1;
  if (board[y][x] == 1) {
    isgreen = 1;
  }
  checkdiag(x, y, isgreen);
  checkdiag2(x, y, isgreen);
  checkvert(x, y, isgreen);
  checkhoriz(x, y, isgreen);
}
let checkhoriz= (x, y, isgreen) =>{
  let i = x;
  let cnt = 1;
  while (i > 0 && board[y][--i] == isgreen) {
    cnt++;
  }
  while (x < 20-1 && board[y][x + 1] == isgreen) {
    cnt++;
    x++;
  }
  if (cnt > 4) {
    Array.apply(0, Array(5)).forEach((_, index) => {
      board[y][x - index] = 0;
    });
  }
}

let checkvert = (x, y, isgreen) => {
  let i = y;
  let cnt = 1;
  while (i > 0 && board[--i][x] == isgreen) {
    cnt++;
  }
  while (y < 20-1 && board[y + 1][x] == isgreen) {
    cnt++;
    y++;
  }
  if (cnt > 4) {
    Array.apply(0, Array(5)).forEach((_, index) => {
      board[y - index][x] = 0;
    });
  }
}

let checkdiag = (x, y, isgreen) => {
  let i = x - 1;
  let j = y - 1;
  let cnt = 1;
  while (i >= 0 && j >= 0 && board[j][i] == isgreen && cnt++ && i-- && j--) {
  }

  i = x + 1;
  j = y + 1;
  while (i < 20 && j < 20 && board[j][i] == isgreen && cnt++ && i++ && j++) {
  }
  if (cnt == 5) {
    Array.apply(0, Array(5)).forEach((_, index) => {
      board[j-1-index][i-1-index] = 0;
    });
  }
}

let checkdiag2 = (x, y, isgreen) => {
  let i = x + 1;
  let j = y - 1;
  let cnt = 1;
  while (i <= 20-1 && j >= 0 && board[j][i] == isgreen && cnt++ && i++ && j--) {
  }

  i = x - 1;
  j = y + 1;
  while (i >= 0 && j < 20 && board[j][i] == isgreen && cnt++ && i-- && j++) {
  }
  if (cnt == 5) {
    Array.apply(0, Array(5)).forEach((_, index) => {
      board[j-1-index][i+1+index] = 0;
    });
  }
}