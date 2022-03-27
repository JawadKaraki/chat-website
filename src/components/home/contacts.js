import { goToChat } from "../../functions/home/allFunctions.js";
export function Contacts(props) {
  return (
    <div className="contacts">
      {props.contacts
        .filter((val) => {
          if (props.search == "") {
            return val;
          } else if (
            val.name.toLowerCase().includes(props.search.toLowerCase())
          ) {
            return val;
          }
        })
        .map((contact) => {
          return (
            <div
              onClick={() =>
                goToChat(contact.userid, contact.name, props.navigate)
              }
              className="contact"
            >
              <img src={contact.img} />
              <div className="name-conatiner">
                <p className="contact-name">{contact.name}</p>
                <p className="last-massage">{contact.email}</p>
              </div>
              <div className="num-of-mas">
                <div className="circle">
                  <p className="num"></p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
