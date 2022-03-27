import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./css/signup.css";
import { auth, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

export default function SIGNUP(props) {
  const [newEmail, setnewEmail] = useState("");
  const [newPass, setnewPass] = useState("");
  const [newName, setnewName] = useState("");
  const [button, setbutton] = useState("SIGN UP");
  const [err, seterr] = useState("");
  const navigate = useNavigate();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/home");
    }
  });
  const SignupToFirebase = (email, name, password) => {
    setbutton("CREATING ACCOUNT...");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        user.photoURL =
          "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png";
        user.displayName = name;
        // Add a new document with a generated id.
        addDoc(collection(db, "contacts"), {
          userid: user.uid,
          name: name,
          img:
            "https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png",
          email: email
        });
        localStorage.setItem("id", user.uid);
        localStorage.setItem("email", user.email);
        navigate("/home");
      })
      .catch((error) => {
        setbutton("SIGN UP");
        seterr("SOMETHING WENT WRONG TRY AGAIN");
        if (error == "FirebaseError: Firebase: Error (auth/invalid-email).") {
          seterr("INVALID EMAIL");
        }
        if (
          error ==
          "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password)."
        ) {
          seterr("PASSWORD SHOULD BE AT LEAST 6 CHARACTERS");
        }
      });
  };
  return (
    <div className="SIGNUP">
      <div id="darker"></div>
      <Link to="/" id="login-link">
        YOU ALREADY HAVE AN ACCOUNT <br />
        CLICK HERE
      </Link>
      <h1>SIGN UP</h1>
      {<p className="error">{err}</p>}
      <input
        placeholder="NAME"
        required
        type="text"
        id="NAME"
        onChange={(event) => {
          setnewName(event.target.value);
        }}
      />
      <input
        placeholder="E M A I L"
        required
        type="email"
        id="EMAIL"
        onChange={(event) => {
          setnewEmail(event.target.value);
        }}
      />
      <input
        placeholder="P A S S W O R D"
        required
        type="password"
        id="PASSWORD"
        onChange={(event) => {
          setnewPass(event.target.value);
        }}
      />
      <input
        value={button}
        type="submit"
        id="SUBMIT"
        onClick={
          newName.length < 18
            ? () => SignupToFirebase(newEmail, newName, newPass)
            : () => seterr("NAME MUST BE LESS THAN 18 CHARACTERS")
        }
      />
    </div>
  );
}
