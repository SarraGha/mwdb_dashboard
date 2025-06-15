import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
Chart.register(...registerables);

interface MalwareStat {
  type: string;
  count: number;
}

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<MalwareStat[]>([]);

  useEffect(() => {
    fetch("/api/stats/count_by_type")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  const data = {
    labels: stats.map((s) => s.type),
    datasets: [
      {
        label: "Malware Type Count",
        data: stats.map((s) => s.count),
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Malware Type Statistics</h2>
      <Bar data={data} />
    </div>
  );
};

export default DashboardView;
