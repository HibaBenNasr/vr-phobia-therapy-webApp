import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { GoBell } from 'react-icons/go';
import { MdLightMode, MdDarkMode } from "react-icons/md";


const Header = ({ theme, setTheme, expanded}) => {
    const toggleMode = () => {
        theme == "light" ? setTheme("dark") : setTheme("light");
      };
  return (
    <div className={`flex top-0 fixed right-0 h-16 justify-between items-center p-1 transition-all duration-300 z-50 ${theme =="light" ? "bg-white" : "bg-sky-950"} ${expanded? "left-16 md:left-56":"left-16"}`}>
        <div>
            <h1 className='text-xs'>Welcome Back!</h1>
            <p className='text-xl font-semibold'>hiba</p>
        </div>
        <div className='flex items-center space-x-5'>
            <div>
                <input type="text" placeholder='Search...' className='bg-indigo-100/30 px-4 py-2 rounded-lg focus:outline-0 focus:ring-2 focus:ring-indigo-600'/>
            </div>
            <div className='flex items-center space-x-5'>
                <button className='relative text-2xl text-gray-600'>
                    <GoBell size={32}/>
                    <span className='absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-indigo-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white'>9</span>
                </button>
                <FaUserCircle className='w-8 h-8 rounded-full border-4 border-indigo-400'/>
            </div>
            <div>
            <button
          onClick={() => {
            toggleMode();
          }}
          className={`cursor-pointer`}
        >
          {theme == "light" ? (
            <MdDarkMode size={30} />
          ) : (
            <MdLightMode size={30} />
          )}
        </button>
            </div>
        </div>
    </div>
  )
}

export default Header