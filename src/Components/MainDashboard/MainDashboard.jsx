import Header from "./Header";
import Patients from "./PatientListLayout/Patients";
import Sidebar, { SidebarItem } from "./Sidebar";
import React, { useEffect, useState } from "react";
import {
  FaRegListAlt,
  FaCalendarAlt,
  FaNotesMedical,
  FaUserCircle,
} from "react-icons/fa";
import CalendarLayout from "./CalendarLayout/CalendarLayout";
import ToDo from "./ToDoLayout/ToDo";

const MainDashboard = () => {
  //manage sidebar items
  const currentItem = localStorage.getItem("currentItem");
  const [activeItem, setActiveItem] = useState(
    currentItem ? currentItem : "Patients"
  ); // Track active item

  const handleSidebarItemClick = (item) => {
    setActiveItem(item); // Update active item when clicked
  };

  useEffect(() => {
    localStorage.setItem("currentItem", activeItem);
  }, [activeItem]);

  ///end manage sidebar items

  //theme
  const currentTheme = localStorage.getItem("currentTheme");

  const [theme, setTheme] = useState(currentTheme ? currentTheme : "light");

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    localStorage.setItem("currentTheme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme == "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);
  //end theme

  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-3">
      <div className="flex">
        <Sidebar
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
          theme={theme}>
          <SidebarItem
            icon={<FaRegListAlt />}
            text="Patients"
            active={activeItem == "Patients"}
            onClick={() => handleSidebarItemClick("Patients")}
          />
          <SidebarItem
            icon={<FaCalendarAlt />}
            text="Calendar"
            active={activeItem == "CalendarLayout"}
            onClick={() => handleSidebarItemClick("CalendarLayout")}
          />

          <SidebarItem
            icon={<FaUserCircle />}
            text="Profile"
            active={activeItem == "Profile"}
            onClick={() => handleSidebarItemClick("Profile")}
          />
        </Sidebar>
        <div
          className={`w-full ${sidebarExpanded ? "ml-16 md:ml-56" : "ml-16"}`}>
          <Header
            theme={theme}
            setTheme={setTheme}
            expanded={sidebarExpanded}
          />

          {activeItem == "Patients" ? (
            <Patients theme={theme} />
          ) : activeItem == "CalendarLayout" ? (
            <CalendarLayout />
          ) : activeItem == "Profile" ? (
            <Profile theme={theme} />
          ) : (
            <div className="p-5 mt-16">
              <h1>Unknown status</h1>
            </div>
          )}
          {/* <Patients /> */}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
