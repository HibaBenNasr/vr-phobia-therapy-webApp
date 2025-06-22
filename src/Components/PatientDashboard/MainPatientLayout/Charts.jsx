import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { RTdatabase } from "../../../firebase/firebase";
import { onValue, ref } from "firebase/database";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const stressColorMap = {
  neutral: "#87CEFA", // Light Sky Blue
  high: "#FFD700", // Yellow
  "very high": "#FF4500", // Red
};

const Charts = ({ sessionStat }) => {
  const [timestamps, setTimestamps] = useState([]);
  const [bpmValues, setBpmValues] = useState([]);
  const [bpmColors, setBpmColors] = useState([]);

  const [levelTimestamps, setLevelTimestamps] = useState([]);
  const [levelData2, setLevelData] = useState([]);
  const [levelColors, setLevelColors] = useState([]);

  // Fetch BPM and stress_level
  useEffect(() => {
    if (!sessionStat?.start_session || !sessionStat?.session_id) return;

    const sensorRef = ref(
      RTdatabase,
      `sessions/${sessionStat.session_id}/sensorData/`
    );

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sortedKeys = Object.keys(data).sort();
        const labels = [];
        const bpm = [];
        const colors = [];

        sortedKeys.forEach((timestamp) => {
          const { BPM, stress_level } = data[timestamp];
          const timeLabel = formatTime(timestamp);
          labels.push(timeLabel);
          bpm.push(BPM);
          colors.push(stressColorMap[stress_level] || "#87CEFA");
        });

        setTimestamps(labels);
        setBpmValues(bpm);
        setBpmColors(colors);
      }
    });

    return () => unsubscribe();
  }, [sessionStat?.start_session, sessionStat?.session_id]);

  useEffect(() => {
    if (sessionStat && sessionStat.start_session === false) {
      setTimestamps([]);
      setBpmValues([]);
      setBpmColors([]);
      setLevelTimestamps([]);
      setLevelData([]);
      setLevelColors([]);
    }
  }, [sessionStat?.start_session]);

  // Fetch level_transitions
  useEffect(() => {
    if (!sessionStat?.start_session || !sessionStat?.session_id) return;

    const transitionRef = ref(
      RTdatabase,
      `sessions/${sessionStat.session_id}/level_transitions/`
    );

    const unsubscribe = onValue(transitionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const timestamps = [];
        const levels = [];
        const colors = [];

        Object.entries(data)
          .sort(([a], [b]) => Number(a) - Number(b)) // sort by timestamp
          .forEach(([ts, { level, mode }]) => {
            const label = formatTime(ts);
            timestamps.push(label);
            levels.push(level);
            colors.push(mode === "manual" ? "#FFA500" : "#4C51BF"); // orange vs blue
          });

        setLevelTimestamps(timestamps);
        setLevelData(levels);
        setLevelColors(colors);
      }
    });

    return () => unsubscribe();
  }, [sessionStat?.start_session, sessionStat?.session_id]);

  const transitionChartOptions = {
    responsive: true,
    animation: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    scales: {
      y: {
        min: 0,
        max: 5,
        beginAtZero: true,
        title: { display: true, text: "Exposure Level" },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const mode = levelColors[index] === "#FFA500" ? "Manual" : "Auto";
            return `Level: ${context.raw}, Mode: ${mode}`;
          },
        },
      },
    },
  };

  // Convert timestamps to readable format
  const formatTime = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString([], {
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const bpmData = {
    labels: timestamps,
    datasets: [
      {
        label: "BPM",
        data: bpmValues,
        borderColor: "#87CEFA",
        backgroundColor: bpmColors,
      },
    ],
  };

  const levelData = {
    labels: levelTimestamps,
    datasets: [
      {
        label: "Stress Level",
        data: levelData2,
        borderColor: "#FFA07A",
        backgroundColor: levelColors,
      },
    ],
  };

  const bpmChartOptions = {
    responsive: true,
    animation: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: "Beats Per Minute" },
      },
    },
  };
  //   console.log("BPM Data:", bpmData);
  //   console.log("Level Data:", levelData);
  return (
    <div className="flex flex-row gap-4 h-full">
      <div className="flex flex-col w-1/2 bg-white mr-2  justify-center dark:bg-gray-800 shadow-xs rounded-xl h-[300px] px-4 py-3">
        <h2 className="text-lg font-semibold mb-4">BPM Over Time</h2>
        <div className="w-full h-4/5">
          <Line data={bpmData} options={bpmChartOptions} />
        </div>
      </div>

      <div className="flex flex-col w-1/2 bg-white mr-2  justify-center dark:bg-gray-800 shadow-xs rounded-xl h-[300px] px-4 py-3">
        <h2 className="text-lg font-semibold mb-4">Level Transitions</h2>
        <div className="w-full h-4/5">
          <div className="flex gap-4 ">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#4C51BF] rounded-sm"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Auto Mode
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#FFA500] rounded-sm"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Manual Mode
              </span>
            </div>
          </div>
          <Bar data={levelData} options={transitionChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
