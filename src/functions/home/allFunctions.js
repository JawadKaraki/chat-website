import { signOut } from "firebase/auth";
import { db, auth, realdb } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { set, ref } from "firebase/database";

export const SignoutUser = () => {
  const statusRef = ref(realdb, "online/" + localStorage.getItem("id"));
  signOut(auth).then(() => {
    set(statusRef, "OFFLINE");
  });
};

//get collection from firebase
export const getContacts = async (setcontacts) => {
  const contactsRef = collection(db, "contacts");
  const qu = query(
    contactsRef,
    where("userid", "!=", localStorage.getItem("id"))
  );
  var data = await getDocs(qu);
  setcontacts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
};

export const goToChat = (id, name, navigate) => {
  localStorage.setItem("target", id);
  localStorage.setItem("targetName", name);
  navigate("/chat");
};
