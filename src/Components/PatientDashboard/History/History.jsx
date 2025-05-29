import React from "react";

const History = () => {
  return (
    <div className="p-5 mt-16">
      <div className="p-1 basis-1/3 bg-white flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl ">
        <div className="text-center p-2">Total Number Of Sessions</div>
        <div className="p-1 mb-1 ">
          <p className="text-[5vw] text-center w-full h-full flex items-center justify-center">
            {/* {patientData.NumberOfSessions} */}0
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;
