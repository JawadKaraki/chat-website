import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/login.css";
import { auth, db } from "./firebase";
import { collection, addDoc, where, query, getDocs } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "firebase/auth";
import Svg from "./svg/svgComponent.js";

if (navigator.userAgent.match(/samsung/i)) {
  alert(
    "YOU ARE USING SAMSUNG INTERNET THAT MAY CHANGE \n" +
      "THIS WEBSITE COLORS IF YOU ARE \n" +
      "USING DARK MODE \n" +
      "PLEASE SWITCH TO LIGHT MODE IF YOU HAVE IT TO PREVENT THIS"
  );
}

export default function Login(props) {
  const [anim, setanim] = useState(false);
  const [newEmail, setnewEmail] = useState("");
  const [newPass, setnewPass] = useState("");
  const [button, setbutton] = useState("LOGIN");
  const [err, seterr] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  setTimeout(() => {
    setanim(true);
  }, 7000);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/home");
    }
  });
  const loginwithGoogle = () => {
    setbutton("LOGGING IN...");
    signInWithPopup(auth, provider)
      .then(async (result) => {
        localStorage.setItem("id", result.user.uid);
        localStorage.setItem("email", result.user.email);
        //cehck if user has logged in using google before
        const qu = query(
          collection(db, "contacts"),
          where("userid", "==", result.user.uid)
        );
        var data = await getDocs(qu);

        if (data.docs.length == 0) {
          addDoc(collection(db, "contacts"), {
            userid: result.user.uid,
            name: result.user.displayName,
            img:
              "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png",
            email: result.user.email
          });
        }
        navigate("/home");
      })
      .catch((err) => {
        setbutton("LOGIN");
        seterr("SOMETHING WENT WRONG");
      });
  };

  const loginToFirebase = (email, password) => {
    setbutton("LOGGING IN...");
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        localStorage.setItem("id", user.user.uid);
        localStorage.setItem("email", user.user.email);
        navigate("/home");
      })
      .catch((err) => {
        setbutton("LOGIN");
        seterr("ERROR TRY AGAIN ");
        if (err == "FirebaseError: Firebase: Error (auth/invalid-email).") {
          seterr("INVALID EMAIL");
        }
        if (err == "FirebaseError: Firebase: Error (auth/wrong-password).") {
          seterr("WRONG PASSWORD");
        }
        if (err == "FirebaseError: Firebase: Error (auth/user-not-found).") {
          seterr("NO USER WITH THIS EMAIL");
        }
      });
  };
  return (
    <div className="Login">
      <div id="darker"></div>
      {anim == false ? <Svg /> : <p></p>}
      <Link to="/signup" id="signup-link">
        YOU DONT HAVE AN ACCOUNT <br />
        CLICK HERE
      </Link>
      <h1>LOGIN</h1>
      <p className="error">{err}</p>
      <button id="google" onClick={() => loginwithGoogle()}>
        <img src="https://img.icons8.com/ios-glyphs/30/ffffff/google-logo--v1.png" />
        <p>CONTINUE WITH GOOGLE</p>
        <div id="cover"></div>
      </button>
      <p id="or">OR</p>
      <input
        placeholder="E M A I L"
        type="email"
        id="email"
        required
        onChange={(event) => {
          setnewEmail(event.target.value);
        }}
      />
      <input
        placeholder="P A S S W O R D"
        type="password"
        id="password"
        required
        onChange={(event) => {
          setnewPass(event.target.value);
        }}
      />
      <input
        value={button}
        type="submit"
        id="submit"
        onClick={() => loginToFirebase(newEmail, newPass)}
      />
    </div>
  );
}
