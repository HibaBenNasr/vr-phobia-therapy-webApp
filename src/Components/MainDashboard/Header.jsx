import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { LuLogOut } from "react-icons/lu";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { doSignOut } from "../../firebase/auth";

const Header = ({ theme, setTheme, expanded }) => {
  const toggleMode = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
  };
  return (
    <div
      className={`flex top-0 fixed right-0 h-16 justify-between items-center p-1 transition-all duration-300 z-50 ${
        theme == "light" ? "bg-white" : "bg-sky-950"
      } ${expanded ? "left-16 md:left-56" : "left-16"}`}>
      <div>
        <h1 className="text-xs">Welcome Back!</h1>
        <p className="text-xl font-semibold">hiba</p>
      </div>
      <div className="flex items-center space-x-5">
        <div>
          <button
            onClick={() => {
              toggleMode();
            }}
            className={`cursor-pointer`}>
            {theme == "light" ? (
              <MdDarkMode size={30} />
            ) : (
              <MdLightMode size={30} className="text-white" />
            )}
          </button>
          <button
            className="relative text-black dark:text-white mx-5 cursor-pointer"
            onClick={() => {
              doSignOut();
            }}>
            <LuLogOut size={28} />
          </button>
          {/* doSignOut */}
        </div>
      </div>
    </div>
  );
};

export default Header;
