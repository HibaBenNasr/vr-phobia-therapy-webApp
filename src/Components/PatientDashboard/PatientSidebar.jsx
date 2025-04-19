import React, { createContext, useContext, useEffect, useState } from "react";
import { FaBackspace, FaUserCircle } from "react-icons/fa";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { FaSignOutAlt } from "react-icons/fa";

import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { BsBack } from "react-icons/bs";
import { GrReturn } from "react-icons/gr";

const PatientSidebarContext = createContext();


export default function PatientSidebar  ({ expanded, setExpanded, theme, children }) {
    const [userDetails, setUserDetails] = useState(null);

    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists) {
          setUserDetails(docSnap.data());
        } else {
          toast.info("user not logged in", {
            position: "top-center",
          });
        }
      });
    };
    useEffect(() => {
      fetchUserData();
    }, []);
  
    async function handleLogout() {
      try {
        await auth.signOut();
        window.location.href = "/";
      } catch (error) {
        toast.error(error.message, {
          position: "top-center",
        });
      }
    }

    function handleBackToMainDashboard(){
        console.log("clicked")
window.location.href="/MainDashboard"
    }
  
    return (
      <div
        className={`fixed left-0 top-0 z-10 h-screen border-r pt-4 px-4 transition-all duration-300 ${
          expanded ? "w-16 md:w-56" : "w-16"
        } ${theme == "light" ? "bg-white" : "bg-sky-950"} `}
      >
        {/* logo */}
        <div className="mb-8x">
          {expanded ? (
            <>
              <div className="md:flex justify-between">
                <img src="/logo.png" alt="logo" className="w-32 hidden md:flex" />
                <img
                  src="/mini-logo.png"
                  alt="logo"
                  className="w-8 flex md:hidden"
                />{" "}
                <button
                  onClick={() => setExpanded((curr) => !curr)}
                  className="mt-3  p-2 rounded-lg bg-white hover:bg-gray-100"
                >
                  {expanded ? <LuChevronFirst /> : <LuChevronLast />}
                </button>
              </div>
            </>
          ) : (
            <div>
              <img src="/mini-logo.png" alt="logo" className="w-8 flex" />
              <button
                onClick={() => setExpanded((curr) => !curr)}
                className="p-2 rounded-lg bg-blue-500 mt-2 hover:bg-gray-100"
              >
                {expanded ? <LuChevronFirst /> : <LuChevronLast />}
              </button>
            </div>
          )}
        </div>
        {/* logo */}
  
        {/* after logo */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Menu
          </h1>
        </div>
  
        {/* Navigation */}
  
        <PatientSidebarContext.Provider value={{ expanded }}>
          <ul className="mt-6 space-y-6">{children}</ul>
        </PatientSidebarContext.Provider>
  
        {/* Navigation */}
  
        <div className="w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center">
          
            {" "}
            {expanded ? (
              <>
              <button onClick={handleBackToMainDashboard}><p className="flex justify-between items-center  text-xs text-white py-2 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full">
                <span className="hidden md:flex">Back To Main Dashboard</span>
                <span><GrReturn size={20}/></span> </p></button>
              
              </>
            ) : (

                <button onClick={handleBackToMainDashboard}><span><p className="text-center text-white py-2 px-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full"><GrReturn size={20}/></p></span></button>
              
            )}
         
        </div>
      </div>
    );
}


export function PatientSidebarItem({ icon, text, active, alert, onClick }) {
    const { expanded } = useContext(PatientSidebarContext);
    return (
      <li
        className={`font-medium rounded-md py-2  hover:bg-gray-100 hover:text-indigo-500 cursor-pointer group${
          active ? "bg-indigo-100 text-indigo-500 " : ""
        } ${expanded ? "px-2 md:px-5" : "ml-2"}`}
        onClick={onClick}
      >
        <div className="flex">
          <a className="flex justify-center md:justify-start items-center md:space-x-5">
            <span>{icon}</span>
            <span
              className={`overflow-hidden transition-all text-sm text-gray-500 hidden md:flex ${
                expanded ? "w-52 ml-3 text-left" : "w-0"
              }`}
            >
              {text}
            </span>
          </a>
  
          {!expanded && (
            <div
              className={`
            absolute left-full rounded-md px-2 mt-0 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
            >
              {text}
            </div>
          )}
        </div>
  
       
      </li>
    );
  }
  