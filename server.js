// Serveur Express + WebSocket pour signalisation WebRTC
const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(3000, () =>
  console.log('HTTP+WS server running on http://localhost:3000')
);

const wss = new WebSocket.Server({ server });
let clients = new Map(); // ws → { id, name }

function broadcastLobby() {
  const lobby = Array.from(clients.values()).map(c => ({ id: c.id, name: c.name }));
  const msg = JSON.stringify({ type: 'lobby', lobby });
  clients.forEach((_, ws) => ws.send(msg));
}

wss.on('connection', ws => {
  ws.id = crypto.randomUUID();
  clients.set(ws, { id: ws.id, name: null });

  ws.on('message', raw => {
    const data = JSON.parse(raw);
    switch(data.type) {
      case 'register':
        clients.get(ws).name = data.name;
        broadcastLobby();
        break;
      case 'invite':
      case 'offer':
      case 'answer':
      case 'ice':
        // forward to target
        for (let [peerWs, meta] of clients) {
          if (meta.id === data.target) {
            peerWs.send(raw);
            break;
          }
        }
        break;
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    broadcastLobby();
  });
});
