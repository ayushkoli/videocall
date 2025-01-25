const socket = io('/');
const peer = new Peer(undefined, {
  config: {
    iceServers: [
      {
        urls: ['stun:bn-turn2.xirsys.com']
      },
      {
        username: 'CmuzOjzz6rF22e532rDyWG9xztn5VOiJHosrUUavii_Q1-E39RNdjDEG5AVuX4aFAAAAAGb7iKRBeXVzaA==',
        credential: '14f0eaac-7fb6-11ef-a4eb-0242ac140004',
        urls: [
          'turn:bn-turn2.xirsys.com:80?transport=udp',
          'turn:bn-turn2.xirsys.com:3478?transport=udp',
          'turn:bn-turn2.xirsys.com:80?transport=tcp',
          'turn:bn-turn2.xirsys.com:3478?transport=tcp',
          'turns:bn-turn2.xirsys.com:443?transport=tcp',
          'turns:bn-turn2.xirsys.com:5349?transport=tcp'
        ]
      }
    ]
  }
});

let myVideoStream;
let myId;
const videoGrid = document.getElementById('videoDiv');
const myVideo = document.createElement('video');
myVideo.muted = true;
const peerConnections = {};

// Get user media
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    myVideoStream = stream;
    addVideo(myVideo, stream);

    // Handle incoming calls
    peer.on('call', (call) => {
      call.answer(stream);
      const video = document.createElement('video');
      call.on('stream', (userStream) => {
        addVideo(video, userStream);
      });
      call.on('close', () => {
        video.remove();
      });
      peerConnections[call.peer] = call;
    });
  })
  .catch((err) => {
    alert(`Error: ${err.message}`);
  });

// PeerJS connection open
peer.on('open', (id) => {
  myId = id;
  console.log(`Connected to Peer server with ID: ${id}`);
  socket.emit('newUser', id, roomID);
});

// Handle peer errors
peer.on('error', (err) => {
  alert(`Peer error: ${err.type}`);
});

// New user joined the room
socket.on('userJoined', (id) => {
  console.log(`User joined: ${id}`);
  const call = peer.call(id, myVideoStream);
  const video = document.createElement('video');
  call.on('stream', (userStream) => {
    addVideo(video, userStream);
  });
  call.on('close', () => {
    video.remove();
  });
  peerConnections[id] = call;
});

// User disconnected
socket.on('userDisconnect', (id) => {
  console.log(`User disconnected: ${id}`);
  if (peerConnections[id]) {
    peerConnections[id].close();
  }
});

// Add video stream to the grid
function addVideo(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}
