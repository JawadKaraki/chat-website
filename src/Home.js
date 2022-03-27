import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Home.css";
import { realdb, checkAuth } from "./firebase";
import { set, ref, onDisconnect } from "firebase/database";
import { Contacts } from "./components/home/contacts.js";
import { SignoutUser, getContacts } from "./functions/home/allFunctions.js";
import { Svg } from "./svg/svgLogo";

export default function Home(props) {
  const navigate = useNavigate();
  checkAuth(navigate);
  let [pressed, setpressed] = useState(false);
  let [loaded, setloaded] = useState(1);
  let [contacts, setcontacts] = useState([]);
  let [search, setsearch] = useState("");
  const statusRef = ref(realdb, "online/" + localStorage.getItem("id"));

  //get contacts
  useEffect(() => {
    getContacts(setcontacts).then(() => {
      setloaded(0);
    });
  }, []);

  //manage online offline of current user
  set(statusRef, "ONLINE");
  onDisconnect(statusRef).set("OFFLINE");

  return (
    <div className="Home">
      <div id="darker"></div>
      <div className={loaded ? "active" : "loading"}>
        <p></p>
      </div>
      <div className="header-container">
        <p className="header">
          <Svg />
        </p>
        {pressed ? (
          <input
            className="search"
            name="search"
            placeHolder="S  E  A  R  C  H"
            onChange={(event) => setsearch(event.target.value)}
          />
        ) : (
          <i
            id="searchIcon"
            onClick={() => setpressed(true)}
            className="fa fa-search"
          ></i>
        )}
      </div>
      <div className="contacts-container" onClick={() => setpressed(false)}>
        <Contacts contacts={contacts} search={search} navigate={navigate} />
      </div>
      <div className="space"></div>
      <div className="links">
        <Link to="/stories">
          <p className="storiesLink">IMAGES</p>
        </Link>
        <div onClick={() => SignoutUser()}>
          <p className="storiesLink">SIGNOUT</p>
        </div>
      </div>
    </div>
  );
}
export { Home };
