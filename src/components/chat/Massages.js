export function Massages(props) {
  const target = localStorage.getItem("target");
  var today = new Date(),
    date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
  return (
    <div className="massages">
      {props.massages.map((m, index, array) => {
        if (index == 0) {
          var first = m.user.date;
        }
        var previous = array[index - 1]
          ? array[index - 1].user.date
          : m.user.date;
        if (m.user.audio) {
          return (
            <div>
              {<p id="date">{first}</p>}
              {m.user.date != previous ? <p id="date">{m.user.date}</p> : ""}
              {m.user.date == date && m.user.date != previous ? (
                <p id="date">TODAY</p>
              ) : (
                ""
              )}
              <div
                className={
                  m.user.sentFrom == target ? "target-text" : "my-text"
                }
              >
                <audio
                  controls
                  ref={(input) => {
                    props.refs.current[index] = input;
                  }}
                  src={m.user.audio}
                />
                <div className="audio-ui">
                  <i
                    onClick={() => {
                      props.refs.current[index].play();
                      var array = [];
                      array[index] = true;
                      props.setaudioPlaying(array);
                    }}
                    className="fa fa-play"
                  ></i>
                  <div className="progress-line">
                    <div
                      className={
                        !props.audioPlaying[index]
                          ? "progress"
                          : "progress-active"
                      }
                    ></div>
                  </div>
                </div>
                <p className="massageTime">{m.user.time}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              {<p id="date">{first}</p>}
              {m.user.date != previous ? <p id="date">{m.user.date}</p> : ""}
              {m.user.date == date && m.user.date != previous ? (
                <p id="date">TODAY</p>
              ) : (
                ""
              )}
              <div
                className={
                  m.user.sentFrom == target ? "target-text" : "my-text"
                }
              >
                {m.user.img != "" ? <img src={m.user.img} /> : <div></div>}
                <p>{m.user.massage}</p>
                <p className="massageTime">{m.user.time}</p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
