import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/stories.css";
import { storageRef, db } from "./firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  doc
} from "firebase/firestore";
export default function stories(props) {
  const [inputImg, setInputImg] = useState();
  const [loaded, setloaded] = useState(1);
  const [ImagesData, setImagesData] = useState([]);
  const [err, seterr] = useState("");
  const imagesdb = collection(db, "images");
  var n = 0;
  var today = new Date(),
    time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds(),
    date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
  const getimages = async () => {
    const qu = query(imagesdb);
    const data = await getDocs(qu);
    setImagesData(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id, oddOrEven: n++ }))
    );
  };
  useEffect(() => {
    getimages().then(() => {
      setloaded(0);
    });
  }, [inputImg]);

  const handleUpload = async (name, image) => {
    if (
      image.type == "image/png" ||
      image.type == "image/jpg" ||
      image.type == "image/jpeg"
    ) {
      setloaded(1);
      const imagesRef = ref(storageRef, "images/" + name);
      uploadBytes(imagesRef, image)
        .catch((err) => {
          seterr("TRY AGAIN AN ERROR HAPPENED");
          setloaded(0);
          setInputImg();
        })
        .then(async (snapshot) => {
          setloaded(0);
          seterr("UPLOADED");
          await getDownloadURL(imagesRef).then((url) => {
            addDoc(collection(db, "images"), {
              userid: localStorage.getItem("id"),
              email: localStorage.getItem("email"),
              imageUrl: url,
              date: date,
              time: time
            });
          });
          setInputImg();
        });
    } else {
      alert("file type is not supported, you can upload png or jpeg or jpg");
    }
  };
  const handledelete = async (id) => {
    var docRef = doc(db, "images", id);
    await deleteDoc(docRef);
    setloaded(1);
    getimages().then(() => {
      setloaded(0);
    });
  };

  return (
    <div className="stories">
      <div id="darker"></div>
      <div className={loaded ? "active" : "loading"}>
        <p></p>
      </div>
      <div className="storyHeader">
        <Link to="/home">
          <i className="fa fa-arrow-left"></i>
        </Link>
        <div id="plus">
          <i className="fa fa-plus"></i>
          <input type="file" onChange={(e) => setInputImg(e.target.files[0])} />
        </div>
      </div>
      {inputImg ? (
        <div className="add-image">
          <img
            id="uploadImg"
            src={URL.createObjectURL(inputImg)}
            alt="THIS FILE IS NOT SUPPORTED"
          />
          <i
            id="cancel"
            className="fa fa-times"
            onClick={() => setInputImg()}
          ></i>
          <i
            id="add"
            className="fa fa-upload"
            onClick={() => handleUpload(inputImg.name, inputImg)}
          ></i>
        </div>
      ) : (
        <div></div>
      )}
      {err}
      <div className="images">
        <div className="left">
          {ImagesData.map((img) => {
            if (img.oddOrEven % 2 == 0) {
              return (
                <div className="img-container">
                  {img.userid == localStorage.getItem("id") ? (
                    <p id="delete" onClick={() => handledelete(img.id)}>
                      <i className="fa fa-trash-o"></i>
                    </p>
                  ) : (
                    <p></p>
                  )}
                  <img src={img.imageUrl} />
                  <div className="imageData">
                    <p id="email">BY {img.email}</p>
                    <p id="date">ON {img.date}</p>
                    <p id="time">AT {img.time}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="right">
          {ImagesData.map((img) => {
            if (img.oddOrEven % 2 != 0) {
              return (
                <div className="img-container">
                  {img.userid == localStorage.getItem("id") ? (
                    <p id="delete">
                      <i className="fa fa-trash-o"></i>
                    </p>
                  ) : (
                    <p></p>
                  )}
                  <img src={img.imageUrl} />
                  <div className="imageData">
                    <p id="email">BY {img.email}</p>
                    <p id="date">ON {img.date}</p>
                    <p id="time">AT {img.time}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="space"></div>
    </div>
  );
}
