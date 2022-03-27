import { useState, useEffect, useRef, createRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Chat.css";
import { realdb, checkAuth } from "./firebase";
import { ref, set, onDisconnect, onValue } from "firebase/database";
import { handleUpload } from "./functions/chat/handleUpload.js";
import { handleRec } from "./functions/chat/handleRecord.js";
import { sendMass } from "./functions/chat/sendMassage.js";
import { getMass } from "./functions/chat/getMassages.js";
import { Massages } from "./components/chat/Massages.js";

export default function Chat(props) {
  const navigate = useNavigate();
  checkAuth(navigate);
  const [massages, setmassages] = useState([]);
  const [loaded, setloaded] = useState(1);
  const [imageloaded, setimageloaded] = useState(0);
  const [InputImg, setInputImg] = useState();
  const [status, setstatus] = useState("OFFLINE");
  const [inputMass, setinputMass] = useState("");
  const [uid] = useState(localStorage.getItem("id"));
  const [isRecording, setisRecording] = useState(0);
  const [audioPlaying, setaudioPlaying] = useState([]);
  const [recordTime, setrecordTime] = useState("");

  const refs = useRef([]);
  const statusRef = ref(realdb, "online/" + uid);
  const ChatRef = useRef(null);
  refs.current = massages.map((_, i) => refs.current[i] ?? createRef());

  //set my status to online
  set(statusRef, "ONLINE");
  onDisconnect(statusRef).set("OFFLINE");

  //load massages from realtime database and call on new value
  useEffect(() => {
    getMass(setmassages, setloaded, ChatRef);
    const target = localStorage.getItem("target");
    const statusRef = ref(realdb, "online/" + target);
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data == "ONLINE") {
        setstatus("ONLINE");
      }
    });
  }, []);

  //return html
  return (
    <div className="Chat">
      <div id="darker"></div>
      <div className={loaded ? "active" : "loading"}>
        <p></p>
      </div>
      <div className="chat-info">
        <Link to="/home">
          <i className="fa fa-arrow-left"></i>
        </Link>
        <img src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" />
        <div className="target">
          <p className="target-name">{localStorage.getItem("targetName")}</p>
          <p className={status == "ONLINE" ? "online" : "offline"}>{status}</p>
        </div>
        <div id="rec-btn">
          <i
            id={isRecording ? "send-voice-active" : "send-voice"}
            onClick={() =>
              handleRec(setrecordTime, setisRecording, setimageloaded)
            }
            class="fa fa-microphone"
          ></i>
          <p className={isRecording ? "recordTime-active" : "recordTime"}>
            {recordTime}
          </p>
        </div>
        <input
          id="inputImage"
          type="file"
          onChange={(e) => setInputImg(e.target.files[0])}
        />
        <i id="send-Image" className="fa fa-plus"></i>
      </div>
      <div className="chatbox" ref={ChatRef}>
        <Massages
          massages={massages}
          refs={refs}
          setaudioPlaying={setaudioPlaying}
          audioPlaying={audioPlaying}
        />
        <div className={imageloaded ? "activeImg" : "loadingImg"}>
          <p></p>
        </div>
        {InputImg ? (
          <div class="add-image-container">
            <div className="add-image">
              <img
                id="uploadImg"
                src={URL.createObjectURL(InputImg)}
                alt="THIS FILE IS NOT SUPPORTED"
              />
              <i
                id="cancel"
                className="fa fa-times"
                onClick={() => setInputImg()}
              ></i>
              <i
                id="add"
                className="fa fa-paper-plane"
                onClick={() =>
                  handleUpload(
                    InputImg.name,
                    InputImg,
                    inputMass,
                    setimageloaded,
                    setInputImg,
                    setinputMass
                  )
                }
              ></i>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <form id="form" onSubmit={(e) => sendMass(e, inputMass, setinputMass)}>
        <input
          className="typing-input"
          placeholder="M A S S A G E"
          value={inputMass}
          onChange={(event) => setinputMass(event.target.value)}
        />
        {InputImg ? (
          <div className="send-icon">
            <i className="fa fa-ban"></i>
          </div>
        ) : (
          <button type="submit" className="send-icon">
            <i className="fa fa-paper-plane"></i>
          </button>
        )}
      </form>
    </div>
  );
}
