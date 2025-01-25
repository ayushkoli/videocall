const socket = io('/');
const peer = new Peer({
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' } // Google's free STUN server
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

