let peer, channel;

function setupLAN() {
  peer = new RTCPeerConnection();
  channel = peer.createDataChannel("game");

  channel.onopen = () => console.log('P2P ouvert');
  channel.onmessage = e => {
    const { index, player } = JSON.parse(e.data);
    board[index] = player;
    updateGrid();
    postMoveCheck(player);
  };

  peer.createOffer().then(offer => {
    peer.setLocalDescription(offer);
    prompt("Copie cette offre SDP et envoie-la à ton adversaire :", offer.sdp);
  });
}

function receiveOffer(sdp) {
  peer = new RTCPeerConnection();
  peer.ondatachannel = e => {
    channel = e.channel;
    channel.onmessage = msgEvent => {
      const { index, player } = JSON.parse(msgEvent.data);
      board[index] = player;
      updateGrid();
      postMoveCheck(player);
    };
  };
  peer.setRemoteDescription({ type: 'offer', sdp });
  peer.createAnswer().then(answer => {
    peer.setLocalDescription(answer);
    prompt("Copie cette réponse SDP et renvoie-la :", answer.sdp);
  });
}

function receiveAnswer(sdp) {
  peer.setRemoteDescription({ type: 'answer', sdp });
}

function sendMoveLAN(index, player) {
  if (channel && channel.readyState === 'open') {
    channel.send(JSON.stringify({ index, player }));
  }
}
