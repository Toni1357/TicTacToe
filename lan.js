let peer, channel, localName;

function startLAN() {
  localName = document.getElementById('lan-name').value.trim();
  if(!localName) return alert('Entre un pseudo');
  document.getElementById('peer-list').innerHTML = '';
  document.getElementById('lan-peers').classList.remove('hidden');

  // On se « découvre » mutuellement via signalisation manuelle QR/prompt
  // Ici, on ne peut pas scanner automatiquement sans serveur
  // On se positionne en hôte ou en client
  let host = confirm('Tu es l’hôte ? OK = offrir, Annuler = rejoindre');
  peer = new RTCPeerConnection();
  if (host) {
    channel = peer.createDataChannel('game');
    setupChannel();
    peer.createOffer().then(o=>{
      peer.setLocalDescription(o);
      prompt('Copie cette offre SDP à ton adversaire :', o.sdp);
    });
  } else {
    let offer = prompt('Colle l’offre SDP reçue :');
    peer.ondatachannel = e=>{ channel=e.channel; setupChannel(); };
    peer.setRemoteDescription({ type:'offer', sdp:offer });
    peer.createAnswer().then(a=>{
      peer.setLocalDescription(a);
      prompt('Renvoie cette réponse SDP à ton hôte :', a.sdp);
    });
  }
}

function setupChannel() {
  channel.onopen = ()=>addPeer(localName, true);
  channel.onmessage = e=>{
    let msg=JSON.parse(e.data);
    if(msg.type==='join-request') {
      addPeer(msg.name, false);
    } else if(msg.type==='move') {
      onPeerMove(msg.index, msg.player);
    }
  };
}

// Affiche un nouveau peer
function addPeer(name, isSelf) {
  if (isSelf) return; // on ignore soi-même
  const ul = document.getElementById('peer-list');
  ul.innerHTML = `<li>
    ${name} 
    <button onclick="requestGame('${name}')">Jouer</button>
  </li>`;
}

// Envoi demande de partie
function requestGame(name) {
  channel.send(JSON.stringify({ type:'join-request', name:localName }));
  startGame('lan');
}

// Envoi coup
function sendLAN(index, player) {
  channel.send(JSON.stringify({ type:'move', index, player }));
}

function onPeerMove(index, player) {
  // hook dans script.js
  handleRemoteMove(index, player);
}
