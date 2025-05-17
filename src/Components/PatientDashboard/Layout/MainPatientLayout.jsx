import React, { useEffect, useState } from "react";
import { auth, db, RTdatabase } from "../../../firebase/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { onValue, ref } from "firebase/database";

const MainPatientLayout = () => {
  const [patientData, setPatientData] = useState([]);

  const fetchPatientData = async (ID) => {
    auth.onAuthStateChanged(async (user) => {
      const docRef = doc(db, "Users", user.uid, "Patients", ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        setPatientData(docSnap.data());

        // console.log(patientData);
      } else {
        console.log("user not logged in");
      }
    });
  };

  // const [Equip, setEquip] = useState([]);
  const [loading, setLoading] = useState(true);

  // const SnapshotEquipStatus = async () => {
  //   auth.onAuthStateChanged(async (user) => {
  //     const unsubscribe = onSnapshot(
  //       doc(db, "Users", user.uid),
  //       (docSnapshot) => {
  //         if (docSnapshot.exists()) {
  //           // console.log(docSnapshot.data().EquipmentAvailability.Sensors);
  //           setEquip(docSnapshot.data().EquipmentAvailability);
  //           setLoading(false);
  //         } else {
  //           console.log("No such document!");
  //         }
  //       }
  //     );
  //     return () => unsubscribe();
  //   });
  // };

  const [equipStat, setEquipStat] = useState([]);

  useEffect(() => {
    const dataRef = ref(
      RTdatabase,
      "equipment_status/THep9E8wPXPPP2n2PThnd2wAsO33/device_001/"
    );

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      setEquipStat(value);
      setLoading(false);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Get query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const Id = params.get("userId");
    fetchPatientData(Id);
    // SnapshotEquipStatus();
  }, []);

  // console.log(Equip.Sensors);

  // Select Proborty
  const [phobiaValue, setPhobiaValue] = useState("");

  const phobias = ["Glossophobia"];

  const handleSelectedPhobia = (e) => {
    setPhobiaValue(e.target.value);
  };
  // Select Proborty

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-5 mt-16">
      <div className="flex flex-row mb-3">
        <div className="p-2 basis-1/3 bg-white flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl mr-3">
          <div className="text-center p-2 mb-5">Equipment Availability</div>
          <div className="p-2 mb-3">
            <div className="p-1 ">
              <p className="text-center flex items-center justify-between">
                VR Headset:{" "}
                <span> {equipStat.headset_ready ? "Ready" : "Not Ready"}</span>
              </p>
            </div>
            <hr />
            <div className="p-1">
              <p className="text-center flex items-center justify-between">
                Sensors:{" "}
                <span> {equipStat.esp32_ready ? "Ready" : "Not Ready"}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-2 basis-2/3 bg-white flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl mr-3">
          <div className="text-center p-2 mb-5">New Session</div>
          <div className="p-2 mb-3 flex flex-col items-center">
            <select
              name="phobia"
              onChange={handleSelectedPhobia}
              className="bg-white border border-gray-300 text-gray-900  rounded-lg focus:bg-gray-50 focus:ring-blue-500 focus:border-blue-500 block w-4/5 p-2.5 "
              required>
              <option value="">Phobia</option>
              {phobias.map((phobia, index) => (
                <option
                  key={phobia}
                  value={phobia}>
                  {phobia}
                </option>
              ))}
            </select>
            <div className="pt-3">
              <button className="mx-2 text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-2/5 sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-800">
                Start Session
              </button>
              <button className="mx-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-2/5 sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                End Session
              </button>
            </div>
          </div>
        </div>

        <div className="p-2 basis-1/3 bg-white flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl mr-3">
          <div className="text-center p-2">Total Number Of Sessions</div>
          <div className="p-2 mb-3 ">
            <p className="text-[5vw] text-center w-full h-full flex items-center justify-center">
              {patientData.NumberOfSessions}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-row mb-3 h-full">
        <div className="basis-1/3 bg-white mr-2">01</div>
        <div className="basis-2/3 bg-white">02</div>
      </div>
    </div>
  );
};

export default MainPatientLayout;
