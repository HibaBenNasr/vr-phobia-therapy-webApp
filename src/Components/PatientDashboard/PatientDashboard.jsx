import PatientHeader from "./PatientHeader";
import MainPatientLayout from "./MainPatientLayout/MainPatientLayout";
import PatientSidebar, { PatientSidebarItem } from "./PatientSidebar";
import React, { useEffect, useState } from "react";
import {
  FaRegListAlt,
  FaCalendarAlt,
  FaNotesMedical,
  FaUserCircle,
  FaRegQuestionCircle,
} from "react-icons/fa";
import History from "./History/History";
import PatientInfo from "./PatientInfo/PatientInfo";

const PatientDashboard = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const item = params.get("interface");
    const Id = params.get("userId");
    if (item == "PatientInfo") {
      handlePatientSidebarItemClick("PatientInfo");
    } else {
      handlePatientSidebarItemClick("MainPatientLayout");
    }
  }, []);

  //manage sidebar items
  const [activeItemPatient, setActiveItemPatient] = useState(""); // Track active item

  const handlePatientSidebarItemClick = (item) => {
    setActiveItemPatient(item); // Update active item when clicked
  };

  ///end manage sidebar items

  //theme
  const currentTheme = localStorage.getItem("currentTheme");

  const [theme, setTheme] = useState(currentTheme ? currentTheme : "light");

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // useEffect(() => {
  //   localStorage.setItem("currentTheme", theme);
  // }, [theme]);
  // //end theme

  // useEffect(() => {
  //   if (theme == "light") {
  //     document.documentElement.classList.remove("dark");
  //   } else {
  //     document.documentElement.classList.add("dark");
  //   }
  // }, [theme]);

  return (
    <div className="bg-gray-100 dark:bg-gray-500 p-3">
      <div className="flex">
        <PatientSidebar
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
          theme={theme}>
          <PatientSidebarItem
            icon={<FaRegListAlt />}
            text="Main"
            active={activeItemPatient == "MainPatientLayout"}
            onClick={() => handlePatientSidebarItemClick("MainPatientLayout")}
          />
          <PatientSidebarItem
            icon={<FaCalendarAlt />}
            text="History"
            active={activeItemPatient == "History"}
            onClick={() => handlePatientSidebarItemClick("History")}
          />
          <PatientSidebarItem
            icon={<FaNotesMedical />}
            text="Patient Info"
            active={activeItemPatient == "PatientInfo"}
            onClick={() => handlePatientSidebarItemClick("PatientInfo")}
          />
        </PatientSidebar>
        <div
          className={`w-full h-dvh  ${
            sidebarExpanded ? "ml-16 md:ml-56" : "ml-16"
          }`}>
          <PatientHeader
            theme={theme}
            setTheme={setTheme}
            expanded={sidebarExpanded}
          />

          {activeItemPatient == "MainPatientLayout" ? (
            <MainPatientLayout theme={theme} />
          ) : activeItemPatient == "History" ? (
            <History theme={theme} />
          ) : activeItemPatient == "PatientInfo" ? (
            <PatientInfo theme={theme} />
          ) : (
            <p>Unknown status</p>
          )}
          {/* <MainPatientLayout /> */}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
