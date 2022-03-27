import { getDownloadURL, uploadBytes, ref as ex } from "firebase/storage";
import { realdb, storageRef } from "../../firebase";
import { push, ref } from "firebase/database";

var getFileBlob = function (url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.addEventListener("load", function () {
    cb(xhr.response);
  });
  xhr.send();
};

export const handleRec = async (
  setrecordTime,
  setisRecording,
  setimageloaded
) => {
  var today = new Date(),
    time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

  const uid = localStorage.getItem("id");
  const target = localStorage.getItem("target");
  const big = uid > target ? uid : target;
  const small = uid < target ? uid : target;
  const massagesRef = ref(realdb, "massages/" + big + "/" + small);

  setrecordTime("5");
  setTimeout(() => setrecordTime("4"), 1000);
  setTimeout(() => setrecordTime("3"), 2000);
  setTimeout(() => setrecordTime("2"), 3000);
  setTimeout(() => setrecordTime("1"), 4000);
  setTimeout(() => setrecordTime(""), 5000);
  navigator.mediaDevices
    .getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        sampleSize: 16,
        volume: 1
      }
    })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      setisRecording(1);
      const audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        getFileBlob(audioUrl, (blob) => {
          const audioRef = ex(storageRef, "Voice/" + audioUrl);
          uploadBytes(audioRef, blob).then(async (snapshot) => {
            await getDownloadURL(audioRef).then((url) => {
              push(massagesRef, {
                time: time,
                date: date,
                sentFrom: uid,
                sentTo: target,
                audio: url
              });
            });
            setimageloaded(0);
          });
        });
      });
      setTimeout(() => {
        setimageloaded(1);
        setisRecording(0);
        mediaRecorder.stop();
      }, 5000);
    });
};
