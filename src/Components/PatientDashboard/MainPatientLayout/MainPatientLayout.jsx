import React, { useEffect, useState } from "react";
import { auth, db, RTdatabase } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onValue, ref, update } from "firebase/database";
import StartSessionModal from "./StartSessionModal";
import SessionControls from "./SessionControls";
import { startNewSession, endSessionData } from "./utils/sessionHelpers";
import Charts from "./Charts";
import { useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { CgUnavailable } from "react-icons/cg";

const MainPatientLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    searchParams.set("interface", "MainPatientLayout");
    setSearchParams(searchParams);
  }, []);

  const [patientData, setPatientData] = useState([]);
  const [newSession, setNewSession] = useState({
    Scene: "",
    InitialLevel: -2,
    Mode: "",
  });
  const [modelVisible, setModelVisible] = useState(false);
  const [patientID, setPatientID] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [equipStat, setEquipStat] = useState([]);
  const [sessionStat, setSessionStat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(-2);
  const [currentMode, setCurrentMode] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);

  const phobias = ["Glossophobia 1", "Acrophobia"];
  const levels = [0, 1, 2, 3, 4, 5];

  // Fetch patient data
  const fetchPatientData = async (ID) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const docRef = doc(db, "Users", user.uid, "Patients", ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPatientData(docSnap.data());
      }
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const Id = params.get("userId");
    if (Id) {
      setPatientID(Id);
      fetchPatientData(Id);
    }

    if (!modelVisible) {
      setNewSession({ Scene: "", InitialLevel: -2, Mode: "" });
    }
  }, [modelVisible]);

  // Equipment and session validation
  useEffect(() => {
    const equipRef = ref(RTdatabase, "pre_session_validation/equipment_ready/");
    const sessionRef = ref(RTdatabase, "pre_session_validation/session/");

    const unsubscribe = onValue(equipRef, (snapshot) => {
      setEquipStat(snapshot.val());
      setLastOnline(snapshot.val().sensors_ready.last_online);
      setLoading(false);
    });

    const unsubscribe2 = onValue(sessionRef, (snapshot) => {
      setSessionStat(snapshot.val());
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  const isRecentlyOnline = (lastOnlineTimestamp) => {
    const now = Date.now();
    const lastOnlineMs = Number(lastOnlineTimestamp) * 1000;
    return now - lastOnlineMs < 20000;
  };

  // Poll every second to check freshness
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastOnline) {
        const status = isRecentlyOnline(lastOnline);
        setIsOnline(status);
        if (!status && sessionID && currentMode === "auto") {
          onToggleMode("manual");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastOnline]);

  //set session id
  useEffect(() => {
    if (sessionStat?.start_session && sessionStat?.session_id) {
      setSessionID(sessionStat.session_id);
    } else {
      setSessionID(""); // Optional: clear sessionID if session ends
    }
  }, [sessionStat]);

  useEffect(() => {
    if (sessionStat?.start_session === false) {
      handleEndSession(); // Reuse logic, handles errors
    }
  }, [sessionStat?.start_session]);

  // Fetch session details (sessionID, currentLevel, mode) from DB continuously
  useEffect(() => {
    if (!sessionID) return;

    const sessionRef = ref(RTdatabase, `sessions/${sessionID}`);

    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentLevel(data.current_level);
        setCurrentMode(data.mode); // Sync mode from Firebase
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [sessionID]);

  useEffect(() => {
    if (!sessionID) return;

    const modeRef = ref(RTdatabase, `sessions/${sessionID}/mode`);

    const unsubscribe = onValue(modeRef, (snapshot) => {
      const modeFromDB = snapshot.val();
      if (modeFromDB === "manual" || modeFromDB === "auto") {
        setCurrentMode(modeFromDB);
      }
    });

    return () => unsubscribe(); // cleanup when sessionID changes or component unmounts
  }, [sessionID]);

  // Start session
  const handleStartSession = async () => {
    if (newSession.Scene && newSession.InitialLevel !== -2) {
      setCurrentMode(newSession.Mode);
      setModelVisible(false);
      setTimeout(async () => {
        try {
          await startNewSession(
            patientID,
            newSession,
            setSessionID,
            setCurrentLevel,
            newSession.Mode
          );
          // console.log("newSession.Mode", newSession.Mode);
          setCurrentMode(newSession.Mode);
          setNewSession({ Scene: "", InitialLevel: -2, Mode: "" });
        } catch (err) {
          console.error("Failed to start session", err);
        }
      }, 100);
    } else {
      console.log("Invalid session data");
    }
  };

  // End session
  const handleEndSession = async () => {
    if (patientID && sessionID) {
      try {
        await endSessionData(patientID, sessionID, currentLevel);
        setNewSession({ Scene: "", InitialLevel: -2, Mode: "" });
        // setPatientID("");
        setSessionID("");
        setCurrentLevel(-2);
      } catch (err) {
        console.error("Failed to end session", err);
      }
    } else {
      // console.log("Missing patient or session ID");
    }
  };

  // Update current level in DB
  const updateCurrentLevelInDB = (newLevel) => {
    if (newLevel < 0 || newLevel > 5) return;
    if (!sessionID) return;

    const levelRef = ref(RTdatabase, `sessions/${sessionID}`);
    const timestamp = Math.floor(Date.now() / 1000);

    const updateData = {
      current_level: newLevel,
      last_updated: timestamp,
    };

    updateData[`level_transitions/${timestamp}`] = {
      mode: currentMode,
      level: newLevel,
    };

    update(levelRef, updateData)
      .then(() => {
        console.log("Updated current level to:", newLevel);
      })
      .catch((err) => {
        console.error("Error updating current level:", err);
      });
  };

  // Update mode in DB
  const updateModeInDB = (newMode) => {
    if (!sessionID) return;

    const sessionRef = ref(RTdatabase, `sessions/${sessionID}`);
    update(sessionRef, {
      mode: newMode,
    })
      .then(() => {
        console.log("Mode updated in the database:", newMode);
      })
      .catch((err) => {
        console.error("Error updating mode in database:", err);
      });
  };

  useEffect(() => {
    if (!sessionID) return;

    const checkHeadsetStatus = () => {
      if (equipStat?.headset_ready === false) {
        console.log("Headset disconnected. Ending session...");
        handleEndSession(); // Call your session-ending logic
      }
    };

    checkHeadsetStatus(); // Check immediately when sessionID or equipStat changes
  }, [sessionID, equipStat?.headset_ready]);

  // Handle mode toggle
  const onToggleMode = (modeChosen) => {
    setCurrentMode(isRecentlyOnline(lastOnline) ? modeChosen : "manual"); // Update local state
    updateModeInDB(isRecentlyOnline(lastOnline) ? modeChosen : "manual"); // Update Firebase
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-1 mt-14">
      <SessionControls
        sessionStat={sessionStat}
        onStartClick={() => setModelVisible(true)}
        onEndClick={handleEndSession}
        onLevelUp={() => {
          if (currentLevel < 5) updateCurrentLevelInDB(currentLevel + 1);
        }}
        onLevelDown={() => {
          if (currentLevel > 0) updateCurrentLevelInDB(currentLevel - 1);
        }}
        currentLevel={currentLevel}
        onToggleMode={onToggleMode}
        sensorsOn={isRecentlyOnline(lastOnline)}
        mode={currentMode}
      />

      <StartSessionModal
        isVisible={modelVisible}
        onClose={() => setModelVisible(false)}
        onConfirm={handleStartSession}
        newSession={newSession}
        setNewSession={setNewSession}
        headStat={equipStat.headset_ready}
        sensorStat={isRecentlyOnline(lastOnline)}
        phobias={phobias}
        levels={levels}
        onModeToggle={onToggleMode}
      />
      <div className="mb-3">
        {" "}
        <Charts sessionStat={sessionStat} />
      </div>

      <div className="flex flex-row mb-3">
        <div className="pt-1 px-1 basis-1/3 flex flex-col bg-white dark:bg-gray-800 shadow-xs rounded-xl mr-3">
          <div className="text-center p-2 mb-1">Equipment Availability</div>
          <div className="p-2 mb-1">
            <p className="text-center flex items-center justify-between">
              VR Headset:{" "}
              <span>
                {equipStat.headset_ready ? (
                  <FaCheckCircle size={20} color="green" />
                ) : (
                  <CgUnavailable size={20} color="red" />
                )}
              </span>
            </p>
            <hr />
            <p className="text-center flex items-center justify-between">
              Sensors:{" "}
              <span>
                {isRecentlyOnline(lastOnline) ? (
                  <FaCheckCircle size={20} color="green" />
                ) : (
                  <CgUnavailable size={20} color="red" />
                )}
              </span>
            </p>
          </div>
        </div>
        <div className="pt-2 basis-2/3 bg-white flex flex-col dark:bg-gray-800 shadow-xs rounded-xl mr-3"></div>
      </div>
    </div>
  );
};

export default MainPatientLayout;
