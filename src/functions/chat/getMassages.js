import { ref, onValue } from "firebase/database";
import { realdb } from "../../firebase";

export const getMass = (setmassages, setloaded, ChatRef) => {
  var uid = localStorage.getItem("id");
  var target = localStorage.getItem("target");
  const big = uid > target ? uid : target;
  const small = uid < target ? uid : target;
  const massagesRef = ref(realdb, "massages/" + big + "/" + small);
  onValue(massagesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const result = Object.keys(data).map((key) => {
        return { user: data[key] };
      });
      setmassages(result);
      if (ChatRef.current != null) {
        setTimeout(() => ChatRef.current.scrollTo(0, 1000000), 200);
      }
    }
    setloaded(0);
  });
};
