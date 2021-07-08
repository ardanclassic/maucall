import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Videos from "./components/Video";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./styles.scss";

function App() {
  const location = (window.location.pathname).split("/")[1];
  const [currentPage, setCurrentPage] = useState("home");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    if (location) {
      setCurrentPage(location)
    }
  }, [currentPage])

  return (
    <div className="App">
      <Router>
        <Switch>
          { currentPage === "home" ? (
            <Route exact path="/" >
              <Menu joinCode={joinCode} setJoinCode={setJoinCode} setPage={setCurrentPage} />
            </Route>
          ) : (
            <Route exact path={`/${currentPage}`} >
              <Videos mode={currentPage} callID={joinCode} setPage={setCurrentPage} />
            </Route>
          )}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
