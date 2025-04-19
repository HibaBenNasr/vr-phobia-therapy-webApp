import PatientHeader from "./PatientHeader";
import MainLayout from "./Layout/MainLayout";
import PatientSidebar , { PatientSidebarItem }from "./PatientSidebar";
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
    //manage sidebar items
  const [activeItemPatient, setActiveItemPatient] = useState(
    "MainLayout"
  ); // Track active item

  const handlePatientSidebarItemClick = (item) => {
    setActiveItemPatient(item); // Update active item when clicked
  };


  ///end manage sidebar items

  //theme
  const currentTheme = localStorage.getItem("currentTheme");

  const [theme, setTheme] = useState(currentTheme ? currentTheme : "light");

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    localStorage.setItem("currentTheme", theme);
  }, [theme]);
  //end theme

  useEffect(() => {
    if (theme == "light") {
        console.log("inside light",theme)
        document.documentElement.classList.remove("dark");
    } else {

        console.log("inside dark",theme);
        document.documentElement.classList.add("dark");
    }
  }, [theme]);

  return (
    <div>
      <div className="flex">
        <PatientSidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} theme={theme}>
          <PatientSidebarItem
            icon={<FaRegListAlt  />}
            text="Main"
            active={activeItemPatient == "MainLayout"}
            onClick={() => handlePatientSidebarItemClick("MainLayout")}
          />
          <PatientSidebarItem
            icon={<FaCalendarAlt  />}
            text="History"
            active={activeItemPatient == "History"}
            onClick={() => handlePatientSidebarItemClick("History")}
            alert
          />
          <PatientSidebarItem
            icon={<FaNotesMedical  />}
            text="Patient Info"
            active={activeItemPatient == "PatientInfo"}
            onClick={() => handlePatientSidebarItemClick("PatientInfo")}
          />

   
        </PatientSidebar>
        <div className={`w-full ${sidebarExpanded?"ml-16 md:ml-56":"ml-16"}`}>
          <PatientHeader theme={theme} setTheme={setTheme} expanded={sidebarExpanded}/>

          {activeItemPatient == 'MainLayout' ? (<MainLayout  theme={theme}/>) :
                activeItemPatient == 'History' ? (<History theme={theme}/>):
                activeItemPatient == 'PatientInfo' ? (<PatientInfo theme={theme}/>) : (
                    <p>Unknown status</p>
                  )}
          {/* <MainLayout /> */}
        </div>
      </div>
      
    </div>
    
  );
}

export default PatientDashboard