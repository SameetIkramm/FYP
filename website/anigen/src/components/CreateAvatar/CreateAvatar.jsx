import axios from "axios"
import React, { useEffect, useRef, useState } from 'react';
import './avatar.css'
const CreateAvatar = () => {
  const subdomain = 'hallway' // See section about becoming a partner
  const iFrameRef = useRef(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [showIFrame, setShowIFrame] = useState(true)
  const [user, setUser] = useState({
    email: localStorage.getItem('name'),
    avatarUrl: ''
  })
  const email = localStorage.getItem("name");
  useEffect(() => {
    let iFrame = iFrameRef.current
    if(iFrame) {
       iFrame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`
    }
  })
  useEffect(() => {
    window.addEventListener('message', subscribe)
    document.addEventListener('message', subscribe)
    return () => {
      window.removeEventListener('message', subscribe)
      document.removeEventListener('message', subscribe)
    }
  });
  function subscribe(event) {
    const json = parse(event)
    if (json?.source !== 'readyplayerme') {
      return;
    }
    // Subscribe to all events sent from Ready Player Me
    // once frame is ready
    if (json.eventName === 'v1.frame.ready') {
      let iFrame = iFrameRef.current
      if(iFrame && iFrame.contentWindow) {
        iFrame.contentWindow.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**'
          }),
          '*'
        );
      }
    }
    // Get avatar GLB URL
    if (json.eventName === 'v1.avatar.exported') {
      console.log(`Avatar URL: ${json.data.url}`);
      setAvatarUrl(json.data.url);
      alert(json.data.url);
      setShowIFrame(false);
      setUser({
        ...user,
        email: email,
        avatarUrl: json.data.url
      });
      console.log(user);
      axios.post("http://localhost:4000/avatar",user)
        .then(response => {
          alert("posted");
          alert(response.data.message);
          console.log(response.data.message);
        })
        .catch(error => {
          console.error(error);
        });
    }
    // Get user id
    if (json.eventName === 'v1.user.set') {
      console.log(`User with id ${json.data.id} set:
${JSON.stringify(json)}`);
    }
  }
  function parse(event) {
    try {
      return JSON.parse(event.data);
    } catch (error) {
      return null;
    }
  }
  return (
    <div>
    <div className="App">
  <div className="topBar">
    <input
      className="toggleButton"
      onClick={() => setShowIFrame(!showIFrame)}
      type="button"
      value={`${showIFrame ? 'Close': 'Open'} creator`}
    />

  </div>
  <iframe
    allow="camera *; microphone *"
    className="iFrame"
    id="frame"
    ref={iFrameRef}
    style={{
      display: `${showIFrame ? 'block': 'none'}`
    }}
    title={"Ready Player Me"}
  />
</div>
    </div>
  );
}

export default CreateAvatar;
