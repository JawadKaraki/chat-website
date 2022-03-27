import { getDownloadURL, uploadBytes, ref as ex } from "firebase/storage";
import { storageRef, realdb } from "../../firebase";
import { push, ref } from "firebase/database";

export const handleUpload = async (
  name,
  image,
  inputMass,
  setimageloaded,
  setInputImg,
  setinputMass
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
  if (
    image.type == "image/png" ||
    image.type == "image/jpg" ||
    image.type == "image/jpeg"
  ) {
    setimageloaded(1);
    setInputImg();
    const imagesRef = ex(storageRef, "images/" + name);
    uploadBytes(imagesRef, image)
      .catch(() => {
        setimageloaded(0);
      })
      .then(async () => {
        setimageloaded(0);
        await getDownloadURL(imagesRef).then((url) => {
          push(massagesRef, {
            time: time,
            date: date,
            sentFrom: uid,
            sentTo: target,
            massage: inputMass,
            img: url
          });
          setinputMass("");
        });
      });
  } else {
    alert("file type is not supported, you can upload png or jpeg or jpg");
  }
};
