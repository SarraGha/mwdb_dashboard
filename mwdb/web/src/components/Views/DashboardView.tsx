import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { Bar, Pie, Line, Radar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface MalwareStat {
  type: string;
  count: number;
}

interface TagStat {
  tag: string;
  count: number;
}

interface UploadTimelineStat {
  date: string;
  count: number;
}

interface UserStat {
  user: string;
  count: number;
}

const DashboardView: React.FC = () => {
  const [typeStats, setTypeStats] = useState<MalwareStat[]>([]);
  const [tagStats, setTagStats] = useState<TagStat[]>([]);
  const [timelineStats, setTimelineStats] = useState<UploadTimelineStat[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([]);

  useEffect(() => {
    async function safeFetch<T>(
      url: string,
      setter: React.Dispatch<React.SetStateAction<T[]>>
    ) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        const data = await res.json();
        if (Array.isArray(data)) setter(data);
        else if (data.data && Array.isArray(data.data)) setter(data.data);
        else {
          console.error(`Unexpected data format from ${url}`, data);
          setter([]);
        }
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        setter([]);
      }
    }
    safeFetch<MalwareStat>("/api/stats/count_by_type", setTypeStats);
    safeFetch<TagStat>("/api/stats/count_by_tag", setTagStats);
    safeFetch<UploadTimelineStat>("/api/stats/upload_timeline", setTimelineStats);
    safeFetch<UserStat>("/api/stats/count_by_user", setUserStats);
  }, []);

  const safeTypeStats = Array.isArray(typeStats) ? typeStats : [];
  const safeTagStats = Array.isArray(tagStats) ? tagStats : [];
  const safeTimelineStats = Array.isArray(timelineStats) ? timelineStats : [];
  const safeUserStats = Array.isArray(userStats) ? userStats : [];

  const pastelColors = (count: number) =>
    Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 60%, 75%)`);

  const typeData = {
    labels: safeTypeStats.map((s) => s.type),
    datasets: [
      {
        label: "Samples Count",
        data: safeTypeStats.map((s) => s.count),
        backgroundColor: pastelColors(safeTypeStats.length),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const typeOptions: ChartOptions<"bar"> = {
    responsive: true,
    animation: { duration: 700, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Malware Type Distribution",
        font: { size: 20, weight: 600 },
        padding: { bottom: 10 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) =>
            `${ctx.label}: ${ctx.parsed.y} samples`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 30, minRotation: 15, maxTicksLimit: 8, font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#eee" },
        ticks: { stepSize: 1, font: { size: 12 } },
      },
    },
  };

  const tagData = {
    labels: safeTagStats.map((s) => s.tag),
    datasets: [
      {
        label: "Tags Count",
        data: safeTagStats.map((s) => s.count),
        backgroundColor: pastelColors(safeTagStats.length),
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const tagOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 14, padding: 8, font: { size: 12 } },
      },
      title: {
        display: true,
        text: "Top Tags Distribution",
        font: { size: 20, weight: 600 },
        padding: { bottom: 10 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"pie">) =>
            `${ctx.label}: ${ctx.parsed} occurrences`,
        },
      },
    },
  };

  const timelineData = {
    labels: safeTimelineStats.map((s) => s.date),
    datasets: [
      {
        label: "Uploads Per Day",
        data: safeTimelineStats.map((s) => s.count),
        fill: true,
        backgroundColor: "rgba(102, 126, 234, 0.15)",
        borderColor: "rgba(102, 126, 234, 0.7)",
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const timelineOptions: ChartOptions<"line"> = {
    responsive: true,
    animation: { duration: 600 },
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
      title: {
        display: true,
        text: "Upload Timeline",
        font: { size: 20, weight: 600 },
        padding: { bottom: 10 },
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        type: "category",
        grid: { display: false },
        ticks: { maxRotation: 30, minRotation: 15, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#f8f8f8" },
        ticks: { stepSize: 1, font: { size: 11 } },
      },
    },
  };

  const userData = {
    labels: safeUserStats.map((s) => s.user),
    datasets: [
      {
        label: "Uploads Per User",
        data: safeUserStats.map((s) => s.count),
        backgroundColor: pastelColors(safeUserStats.length),
        borderRadius: 5,
      },
    ],
  };

  const userOptions: ChartOptions<"bar"> = {
    responsive: true,
    animation: { duration: 600 },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Uploads Per User",
        font: { size: 20, weight: 600 },
        padding: { bottom: 10 },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) =>
            `${ctx.label}: ${ctx.parsed.y} uploads`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 45, minRotation: 30, font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#eee" },
        ticks: { stepSize: 1, font: { size: 12 } },
      },
    },
  };

  const radarData = {
    labels: safeUserStats.map((s) => s.user),
    datasets: [
      {
        label: "User Upload Patterns",
        data: safeUserStats.map((s) => s.count),
        backgroundColor: "rgba(255, 99, 132, 0.15)",
        borderColor: "rgba(255, 99, 132, 0.7)",
        pointBackgroundColor: "rgba(255, 99, 132, 0.8)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255, 99, 132, 0.9)",
      },
    ],
  };

  const radarOptions: ChartOptions<"radar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { font: { size: 13 } } },
      title: {
        display: true,
        text: "User Upload Radar Chart",
        font: { size: 20, weight: 600 },
        padding: { bottom: 10 },
      },
      tooltip: { enabled: true },
    },
    scales: {
      r: {
        angleLines: { color: "#ccc" },
        grid: { color: "#f0f0f0" },
        pointLabels: { font: { size: 13, weight: 600 } },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          backdropColor: "transparent",
        },
      },
    },
  };

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-14 bg-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-semibold text-gray-900 mb-10 text-center">
        MWDB Advanced Dashboard
      </h1>

      <section className="mb-10">
        <Bar data={typeData} options={typeOptions} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="shadow p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
          {safeTagStats.length > 0 ? (
            <Pie data={tagData} options={tagOptions} />
          ) : (
            <p className="text-center text-gray-500 mt-5">No tags available.</p>
          )}
        </div>

        <div className="shadow p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <Line data={timelineData} options={timelineOptions} />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="shadow p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
          <Radar data={radarData} options={radarOptions} />
        </div>

        <div className="shadow p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100">
          <Bar data={userData} options={userOptions} />
        </div>
      </section>
    </main>
  );
};

export default DashboardView;
