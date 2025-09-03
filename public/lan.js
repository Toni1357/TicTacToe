let ws, localId, peerConnection, dataChannel, pendingOffer;

function startLAN() {
  const name = document.getElementById('lan-name').value.trim();
  if (!name) return alert('Entre un pseudo');
  ws = new WebSocket(`ws://${location.host}`);
  ws.onopen = () => ws.send(JSON.stringify({ type:'register', name }));
  ws.onmessage = e => handleSignal(JSON.parse(e.data));
  document.getElementById('lan-peers').classList.remove('hidden');
}

function handleSignal(msg) {
  switch(msg.type) {
    case 'lobby':
      updatePeerList(msg.lobby); break;
    case 'invite':
      onInvite(msg.from); break;
    case 'offer':
      onReceiveOffer(msg.offer, msg.from); break;
    case 'answer':
      onReceiveAnswer(msg.answer); break;
    case 'ice':
      peerConnection.addIceCandidate(msg.candidate); break;
  }
}

function updatePeerList(lobby) {
  const ul = document.getElementById('peer-list');
  ul.innerHTML = '';
  lobby.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    li.onclick = () => sendInvite(p.id);
    ul.appendChild(li);
  });
}

function sendInvite(target) {
  ws.send(JSON.stringify({ type:'invite', target }));
}

function onInvite(fromId) {
  if (confirm('Invité par un joueur, accepter ?')) {
    createPeer(false, fromId);
  }
}

async function createPeer(isHost, otherId) {
  peerConnection = new RTCPeerConnection({ iceServers:[{ urls:'stun:stun.l.google.com:19302' }] });
  peerConnection.onicecandidate = e => {
    if (e.candidate) {
      ws.send(JSON.stringify({ type:'ice', candidate:e.candidate, target:otherId }));
    }
  };
  if (isHost) {
    dataChannel = peerConnection.createDataChannel('game');
    setupChannel();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    ws.send(JSON.stringify({ type:'offer', offer, target:otherId }));
  } else {
    peerConnection.ondatachannel = e => {
      dataChannel = e.channel;
      setupChannel();
    };
  }
}

async function onReceiveOffer(offer, fromId) {
  await createPeer(false, fromId);
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  ws.send(JSON.stringify({ type:'answer', answer, target:fromId }));
}

async function onReceiveAnswer(answer) {
  await peerConnection.setRemoteDescription(answer);
}

function setupChannel() {
  dataChannel.onopen = () => startGame('lan');
  dataChannel.onmessage = e => {
    const { index, player } = JSON.parse(e.data);
    handleRemoteMove(index, player);
  };
}

function sendLAN(index, player) {
  dataChannel.send(JSON.stringify({ index, player }));
}
