import { realdb } from "../../firebase";
import { push, ref } from "firebase/database";

//send massage to database
export const sendMass = (e, inputMass, setinputMass) => {
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
  e.preventDefault();
  if (inputMass != "") {
    push(massagesRef, {
      time: time,
      date: date,
      sentFrom: uid,
      sentTo: target,
      massage: inputMass,
      img: ""
    });
    setinputMass("");
  }
};
