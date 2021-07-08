import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./style.scss";

const Menu = ({ joinCode, setJoinCode, setPage }) => {
  let history = useHistory();
  const [callID, setCallID] = useState("");

  const inputChange = (e) => {
    setCallID(e.target.value);
    setJoinCode(e.target.value);
  };

  const handlePage = (type) => {
    if (type === "join") {
      if (callID) {
        setPage("join");
        history.push("/join");
      }
    } else {
      setPage("create");
      history.push("/create");
    }
  }

  return (
    <div className="home">
      <div className="box">
        <button className="create" onClick={() => handlePage("create")}>
          Create Call
        </button>
        <div className="divider"></div>
        <form>
          <input
            required
            type="text"
            value={joinCode}
            onChange={(e) => inputChange(e)}
            placeholder="join with code ... "
          />
          <div className="err-message">fill the join code!</div>
          <button className="answer" onClick={() => handlePage("join")}>
            Answer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Menu;
