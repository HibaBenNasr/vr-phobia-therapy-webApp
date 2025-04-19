import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase/firebase";
import React, { useEffect, useState } from "react";

import LoginPage from "./Components/LoginRegister/LoginPage";
import MainDashboard from "./Components/MainDashboard/MainDashboard";
import PatientDashboard from "./Components/PatientDashboard/PatientDashboard";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={
                  user ? <Navigate to="/MainDashboard" /> : <LoginPage />
                }
              />
              {/* <Route
                path="/Profile"
                element={<Profile />}
              /> */}
              <Route
                path="/MainDashboard"
                element={<MainDashboard />}
              />
              <Route
                path="/PatientDashboard"
                element={<PatientDashboard />}
              />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
