# videocall

---

# 📹 Video Chat Application Documentation

## 🧩 Overview

This documentation explains the process of creating, deploying, and testing a **video chat application** using **WebRTC**, **PeerJS**, and a **TURN server** for network traversal.
The project allows users to join a room and communicate via video and audio streams.

---

## 🛠️ Technologies Used

* **HTML/CSS:** Frontend structure and styling
* **JavaScript:** Client-side logic
* **Node.js:** Backend server
* **Socket.IO:** Real-time communication between server and clients
* **PeerJS:** WebRTC abstraction for peer-to-peer communication
* **Xirsys:** TURN/STUN server for NAT traversal
* **Render:** For deployment

---

## 📁 Folder Structure

```
index.html      → Main HTML file containing the video grid and layout
index.js        → Client-side JavaScript for handling video streams and peer connections
server.js       → Node.js server managing WebSocket connections and signaling
package.json    → Dependencies and scripts
public/         → Contains static assets (JavaScript and CSS files)
```

---

## ✨ Features

* Join a room using a **unique room ID**
* Real-time **video and audio streaming** between participants
* Handles **multiple participants** with dynamic video grid resizing
* Works across **different networks** using a TURN server

---

## ⚙️ Setting Up the Application

### 🧾 Prerequisites

1. **Node.js** installed on your system
2. A **GitHub account** for version control and deployment
3. A **free Xirsys account** to get TURN/STUN credentials

---

### 🚀 Step-by-Step Guide

#### 1. Clone the Repository

```bash
git clone https://github.com/ayushkoli/videocall.git
cd videocall
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure TURN/STUN Server

1. Sign up at [Xirsys](https://xirsys.com) and create a new **ICE configuration**
2. Retrieve your **TURN/STUN credentials** from the Xirsys dashboard
3. Update your `index.js` file with the credentials as follows:

```javascript
iceServers: [
  { urls: ['stun:your_stun_server_url'] },
  {
    username: 'your_username',
    credential: 'your_credential',
    urls: [
      'turn:your_turn_server_url:80?transport=udp',
      'turn:your_turn_server_url:3478?transport=udp',
      'turn:your_turn_server_url:80?transport=tcp',
      'turn:your_turn_server_url:3478?transport=tcp',
      'turns:your_turn_server_url:443?transport=tcp',
      'turns:your_turn_server_url:5349?transport=tcp'
    ]
  }
]
```

#### 4. Run the Application Locally

```bash
node server.js
```

Access the app at 👉 `http://localhost:3000`

#### 5. Deploy to Render

1. Push your project to GitHub:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
2. Log in to **Render** and create a **new web service**
3. Connect your GitHub repository and **deploy**
4. Update the deployed app URL in your client-side code

---

## 🧪 Testing the Application

1. Open the application on **two different devices**
2. Use the **same room ID** to join the same room
3. Ensure both **video and audio** streams are visible

---

## 🐞 Troubleshooting

### ❌ Problem: Not working on different networks

* Ensure the **TURN server credentials** are valid
* Check that your app is **deployed correctly** and accessible online

### ❌ Problem: Video grid not displaying

* Verify that `index.js` is correctly linked in `index.html`
* Check the **browser console** for JavaScript errors

---




