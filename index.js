const express = require('express');
const http = require('http');
const WebSocket = require('ws');
let board = Array.apply(null, Array(20)).map(x => Array(20))
let cnter = 0;

const app = express();
app.use('*', (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
})

app.use('/', express.static('game'));

app.get('/messages', (req, res) => {

    res.send(convo);
});
app.get('/wslist', (req, res) => {

    res.send(wslist);
});


app.get('/board', (req, res) => {
    res.send(board);
});
app.get('/restart', (req, res) => {
    cnter = 0;
    board = Array.apply(1, Array(20)).map(x => Array(20))
    res.send();
});


app.get('/move/:x/:y', (req, res) => {
    const cnt = board.reduce((x, y) => x + y.reduce((prev, next) => prev + (next ? 1 : 0), 0), 0);
    const x = +req.params.x;
    const y = +req.params.y;
    if (cnt % 2 == 0) {
        board[y][x] = 1;
    } else {
        board[y][x] = -1;
    }
    checkwin(x, y);
    cnter++;

    for (const sock of wslist) {
        sock.send(JSON.stringify({board}));
    }

    res.send(board);
    
});



const server = http.createServer(app);


const wss = new WebSocket.Server({ server });

const wslist = [];
const wsids = [];
const convo = [];

wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

let addmessageEvent = (ws) => {
    ws.on('message', (message) => {
        convo.push(JSON.parse(message.toString()));

        for (const sock of wslist) {
            if (sock.id != ws.id) {
                console.log('message sent is ', message.toString());
                sock.send(message.toString());
            }
        }
        console.log('message is ', message.toString())
        console.log('message is ', message)
    });
}

wss.on('connection', (ws) => {
    ws.id = wss.getUniqueID();
    wslist.push(ws);
    wsids.push(ws);

    wss.clients.forEach(function each(client) {
        console.log('Client.ID: ' + client.id);
    });
    addmessageEvent(ws);

});



let checkwin = (x, y) => {
    let isgreen = -1;
    if (board[y][x] == 1) {
        isgreen = 1;
    }
    checkdiag(x, y, isgreen);
    checkdiag2(x, y, isgreen);
    checkvert(x, y, isgreen);
    checkhoriz(x, y, isgreen);
}
let checkhoriz = (x, y, isgreen) => {
    let i = x;
    let cnt = 1;
    while (i > 0 && board[y][--i] == isgreen) {
        cnt++;
    }
    while (x < 20 - 1 && board[y][x + 1] == isgreen) {
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
    while (y < 20 - 1 && board[y + 1][x] == isgreen) {
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
            board[j - 1 - index][i - 1 - index] = 0;
        });
    }
}

let checkdiag2 = (x, y, isgreen) => {
    let i = x + 1;
    let j = y - 1;
    let cnt = 1;
    while (i <= 20 - 1 && j >= 0 && board[j][i] == isgreen && cnt++ && i++ && j--) {
    }

    i = x - 1;
    j = y + 1;
    while (i >= 0 && j < 20 && board[j][i] == isgreen && cnt++ && i-- && j++) {
    }
    if (cnt == 5) {
        Array.apply(0, Array(5)).forEach((_, index) => {
            board[j - 1 - index][i + 1 + index] = 0;
        });
    }
}





//start our server
server.listen(3000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});