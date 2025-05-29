import React from "react";
import { BiLogOut, BiLogOutCircle } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { LuLogOut } from "react-icons/lu";
import {
  MdLightMode,
  MdDarkMode,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdLogout,
} from "react-icons/md";
import { doSignOut } from "../../firebase/auth";

const PatientHeader = ({ theme, setTheme, expanded }) => {
  const toggleMode = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <div
      className={`flex top-0 fixed right-0 h-16 justify-between items-center p-1 transition-all duration-300 ${
        theme == "light" ? "bg-white" : "bg-sky-950"
      } ${expanded ? "left-16 md:left-56" : "left-16"}`}>
      <div>
        <h1 className="text-xs">Patient </h1>
        <p className="text-xl font-semibold"> Section</p>
      </div>
      <div className="flex items-center space-x-5">
        <div>
          <button
            onClick={() => {
              toggleMode();
            }}
            className={`cursor-pointer `}>
            {theme == "light" ? (
              <MdOutlineDarkMode size={30} />
            ) : (
              <MdOutlineLightMode size={30} className="text-white" />
            )}
          </button>
          <button
            className="relative  text-black dark:text-white mx-5"
            onClick={() => {
              doSignOut();
            }}>
            <LuLogOut size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
