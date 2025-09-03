let peer, channel;

function setupLAN(pseudo) {
  peer = new RTCPeerConnection();
  channel = peer.createDataChannel("game");

  channel.onmessage = (e) => {
    const move = JSON.parse(e.data);
    board[move.index] = move.player;
    updateBoard();
  };

  channel.onopen = () => console.log("Connexion P2P établie");

  peer.createOffer().then(offer => {
    peer.setLocalDescription(offer);
    prompt("Copie cette offre et envoie-la à ton adversaire :", offer.sdp);
  });
}

function receiveOffer(sdp) {
  peer = new RTCPeerConnection();
  peer.ondatachannel = (e) => {
    channel = e.channel;
    channel.onmessage = (e) => {
      const move = JSON.parse(e.data);
      board[move.index] = move.player;
      updateBoard();
    };
  };

  peer.setRemoteDescription({ type: "offer", sdp });
  peer.createAnswer().then(answer => {
    peer.setLocalDescription(answer);
    prompt("Renvoie cette réponse à ton adversaire :", answer.sdp);
  });
}

function receiveAnswer(sdp) {
  peer.setRemoteDescription({ type: "answer", sdp });
}

function sendMove(index, player) {
  if (channel && channel.readyState === "open") {
    channel.send(JSON.stringify({ index, player }));
  }
}
