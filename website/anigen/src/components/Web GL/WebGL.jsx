import React, { useEffect,useState,Fragment } from "react";
import {Unity ,useUnityContext } from "react-unity-webgl";
import axios from "axios";

const WebGL=() => {
  const [filenames, setFilenames] = useState([]);
  const [filename, setFilename] = useState([]);
  const [filenameValue, setFilenameValue] = useState('');
  var [recorder, setRecorder] = useState(null);
  var [data, setData] = useState([]);
  const [avatarURL, setAvatarUrl] = useState([]);
  const [script, setScript] = useState('');
  const { unityProvider , sendMessage , unload, loadingProgression, isLoaded} = useUnityContext({
    loaderUrl: "/build/WebGLBuilds.loader.js",
    dataUrl: "/build/WebGLBuilds.data.unityweb",
    frameworkUrl: "/build/WebGLBuilds.framework.js.unityweb",
    codeUrl: "/build/WebGLBuilds.wasm.unityweb",
  });


  const handleFilenameChange = (event) => {
    setFilenameValue(event.target.value);
  };


  useEffect(() => {
      const fetchAvatarUrl = async () => {
        try {
          const email = localStorage.getItem('name');
          const response = await axios.get(`http://localhost:4000/WebGL/${email}/avatarURL`);
          setAvatarUrl(response.data.avatarURL);
          localStorage.setItem("avatar",response.data.avatarURL);
        } catch (error) {
          console.error(error);
        }
      };
      fetchAvatarUrl();
    }, []);

    useEffect(() => {
      const fetchFilenames = async () => {
        try {
          const email = localStorage.getItem('name');
          const response = await axios.get(`http://localhost:4000/TTS/${email}/filenames`);
          setFilenames(response.data.filenames);
        } catch (error) {
          console.error(error);
        }
      };
      fetchFilenames();
    }, []);


    function GetUrl(){

    // sendMessage("Runtime Example","setString","https://api.readyplayer.me/v1/avatars/632d65e99b4c6a4352a9b8db.glb");
      const avatar=localStorage.getItem("avatar");
      // alert(avatar);
      // sendMessage("Runtime Example","setString",`${avatar}`);
      // sendMessage("Runtime Example","setString","https://models.readyplayer.me/63df4c591f25f849e5e4ffbd.glb");

      sendMessage("Runtime Example","setString","https://models.readyplayer.me/643829b86d8f6158d37ebe5e.glb");

    }



  async function generateVideo() {
    const scriptData = document.getElementById('script').value;
    setScript(scriptData);
    alert(scriptData);
    const canvas = document.querySelector("canvas");
      const stream = canvas.captureStream(30);
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = async (event) => {
        data.push(event.data);
      };
      recorder.start();
      console.log("recording started");
      await new Promise((resolve) => setTimeout(resolve, 6000));
      recorder.stop();
      const blob = new Blob(data, { type: "video/webm" });
      if (blob.size === 0) {
        console.log("No data recorded");
        return;
      }
      //Getting text data of the script
      console.log(blob)
      console.log("recording stopped");
      // r.getSeekableBlob(blob, async function (seekableBlob) {
      //   blob = seekableBlob;
      // });

      var url = URL.createObjectURL(blob);
      var video = document.querySelector("video");
      video.src = url;
      var formData = new FormData();
      formData.append("video_file", blob, "input_video.webm");
      alert(script);
      var query = "http://localhost:5000/generateVideo?text=" + script + "&speaker=VCTK_old_17I-0338@nu.edu.pk&email=17I-0338@nu.edu.pk";
      let response = await axios.post(query, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType:"blob"
      });
      console.log(response);
      if (response.data.type !== "video/mp4") {
        console.error("Response is not a video file");
        return;
      }
      url = URL.createObjectURL(response.data);
      video.src = url;
  }


  async function handleClickBack() {

    await unload();
    // Ready to navigate to another page.
  }


  return (
    <Fragment>
     {!isLoaded && (
        <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
      )}
      <div className="d-flex justify-content-center">
        <div className="row">
          <div className="col-md-8">
            <textarea id="script" placeholder="Enter Script" className="form-control mb-3" style={{height:"10vh",marginTop:"2vh"}}></textarea>
		<select
        className="form-select"
        style={{ width: "27vh", height: "5vh", margin:"0 0 1vh 0" }}
        value={filenameValue}
        onChange={handleFilenameChange}
      >
        <option value="">Select a voicename</option>
        {filenames.map((filename, index) => (
          <option key={index} value={filename}>
            {filename}
          </option>
        ))}
      </select>
          </div>
          <div className="col-md-4">
            <button onClick={generateVideo} className="btn btn-primary btn-lg" style={{height:"10vh",marginTop:"2vh"}}>Generate Video</button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin:"0 0 2vh 0"  }}>
      <Unity unityProvider={unityProvider} style={{ width: "42%", height: "42%" ,visibility: isLoaded ? "visible" : "hidden", margin:"auto", display:"block"}} />
      <video id="video" width="42%" height="42%" controls style={{display:"block", margin:"0 auto"}}></video>
    </div>
    <button onClick={GetUrl()} style={{display:"none"}}>Spawn Enemies</button>
    </Fragment>
  );

}

export default WebGL
