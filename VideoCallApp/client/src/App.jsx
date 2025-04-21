import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const App = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnection = useRef(null);

  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [remoteUser, setRemoteUser] = useState(null);
  const [started, setStarted] = useState(false);

  // Single Method for Peer Connection
  const createPeerConnection = async (remoteId) => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
      }]
    })

    peerConnection.current.remoteUserId = remoteId;

    // listen to remote stream and add to peer connection
    peerConnection.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    }

    // listen for ICE candidate
    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current.emit("icecandidate", { candidate: e.candidate.toJSON(), to: peerConnection.current.remoteUserId });
      }
    }

    // add local stream to peer connection
    localVideoRef.current.srcObject.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, localVideoRef.current.srcObject)
    });
  }

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localVideoRef.current.srcObject = stream;
    }
    catch (err) {
      console.log("Local Video Error:", err);
    }
  }

  const handleOffer = async ({ from, to, offer }) => {
    if (peerConnection.current) {
      socketRef.current.emit('remote-busy', { from: to, to: from });
      return;
    }
    else {
      await startLocalVideo();
      await createPeerConnection(from);
      setRemoteUser(from);
    }

    const pc = peerConnection.current;
    pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit('answer', { from: to, to: from, answer: pc.localDescription.toJSON() });
  }

  useEffect(() => {
    socketRef.current = io('http://localhost:8000');

    startLocalVideo();

    socketRef.current.on('user-joined', async (users) => {
      setUsers(Object.values(users).filter(user => user.id !== socketRef.current.id));
    });

    socketRef.current.on('offer', handleOffer);

    socketRef.current.on('answer', async ({ answer }) => {
      peerConnection.current.setRemoteDescription(answer);
    })

    socketRef.current.on('icecandidate', async ({ candidate }) => {
      if (peerConnection.current) await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      else console.warn('Peer connection is null. Ignoring ICE candidate.');
    });

    socketRef.current.on('remote-busy', () => {
      console.log('Remote user is busy');
      endCall();
    });

    socketRef.current.on('user-left', () => {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== socketRef.current.id));
    });

    socketRef.current.on('call-ended', ({ from }) => {
      // if (from === remoteUser)
      endCall();
    });
  }, []);

  const joinUser = (e) => {
    e.preventDefault();
    if (name) {
      socketRef.current.emit('join-user', name);
      setStarted(true);
    }
  }

  const leaveUser = () => {
    socketRef.current.emit('leave-user');
    setStarted(false);
  }

  const startCall = async (user) => {
    await startLocalVideo();
    await createPeerConnection(user);

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socketRef.current.emit('offer', { from: socketRef.current.id, to: user, offer: peerConnection.current.localDescription });

    setRemoteUser(user);
  }

  const endCall = () => {
    if (localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setRemoteUser(null);
  }

  return (
    <>
      <Navbar started={started} joinUser={joinUser} leaveUser={leaveUser} name={name} setName={setName} />

      <div className="users-container">
        {remoteUser && (
          <button onClick={() => { endCall(); socketRef.current.emit('end-call', { from: socketRef.current.id, to: remoteUser }); }} className='call-button'>End Call</button>
        )}
        {!remoteUser && users.map(user => (
          <button key={user.id} onClick={() => startCall(user.id)} className='call-button'>Call {user.name}</button>
        ))}
      </div>

      <div className="video-container">
        <div>
          <video ref={remoteVideoRef} autoPlay className='video'></video>
          <h1>{remoteUser ? users.find(user => user.id === remoteUser).name || remoteUser : "Remote User"}</h1>
        </div>

        <div>
          <video ref={localVideoRef} autoPlay muted className="video"></video>
          <h1>You (Local)</h1>
        </div>
      </div>
    </>
  )
}

const Navbar = ({ started, joinUser, leaveUser, name, setName }) => {

  return (
    <nav>
      <div className="logo-container">
        <img src="/video-camera.png" alt="Video logo" className="logo" />
        <h1>iMeet - Video Call App using WebRTC</h1>
      </div>

      {started ? <button onClick={leaveUser} style={{ backgroundColor: 'red' }}>Stop</button> :
        <form className='name-form' onSubmit={joinUser}>
          <input type="text" className='name-input' value={name} placeholder='Enter your name' onChange={(e) => setName(e.target.value)} />
          <button type='submit' style={{ backgroundColor: 'green' }}>Start</button>
        </form>
      }
    </nav>
  )
}

export default App;
