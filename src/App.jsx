import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Welcome from "./components/Welcome";
import Homepage from "./components/Homepage";
import "./App.css";

function App() {

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path="/homepage" element={<Homepage/>} />  
        </Routes>
      </Router>
    </div> 
  );
}

export default App;
