import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WorkerReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/report/worker', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        const months = Object.keys(data.monthlyIncome || {});
        setSelectedMonth(months[0] || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading report:', err);
        setLoading(false);
      });
  }, []);

  const downloadPdf = async () => {
    const res = await fetch(`http://localhost:8080/api/report/worker/pdf?month=${selectedMonth}`, {
      credentials: 'include',
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worker_report_${selectedMonth}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const getMonthLabel = (index) =>
    new Date(0, index).toLocaleString('default', { month: 'long' });

  const monthsFullYear = Array.from({ length: 12 }, (_, i) => getMonthLabel(i));

  const incomeData = monthsFullYear.map((month) => report?.monthlyIncome?.[month] || 0);

  const taskData = monthsFullYear.map((month) =>
    month === selectedMonth ? report?.completedTasks || 0 : 0
  );

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-between items-center mb-6 mt-10">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">Worker Performance Report</h1>
            <p className="text-gray-500 mt-1">Summary of monthly and yearly activity</p>
          </div>
          <div className="flex gap-4 items-center">
            <select
              className="border border-gray-300 px-4 py-2 rounded-md"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Object.keys(report?.monthlyIncome || {}).map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
            <button
              onClick={downloadPdf}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 text-blue-800 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold">Worker</h4>
            <p className="text-xl font-bold">{report?.workerName || 'N/A'}</p>
          </div>
          <div className="bg-green-100 text-green-800 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold">Income ({selectedMonth})</h4>
            <p className="text-xl font-bold">
              Rs. {report?.monthlyIncome?.[selectedMonth]?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold">Completed Tasks</h4>
            <p className="text-xl font-bold">{report?.completedTasks}</p>
          </div>
          <div className="bg-purple-100 text-purple-800 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-semibold">Average Rating</h4>
            <p className="text-xl font-bold">{report?.averageRating?.toFixed(1)} ⭐</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Income Chart */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">Monthly Income Overview</h3>
            <Bar
              data={{
                labels: monthsFullYear,
                datasets: [
                  {
                    label: 'Income (LKR)',
                    data: incomeData,
                    backgroundColor: '#6366f1',
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>

          {/* Completed Tasks Chart */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-green-600 mb-2">Completed Tasks (Selected Month)</h3>
            <Bar
              data={{
                labels: monthsFullYear,
                datasets: [
                  {
                    label: 'Completed Tasks',
                    data: taskData,
                    backgroundColor: '#10b981',
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, stepSize: 1 } },
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-right text-sm text-gray-500 mt-10">
          Generated on {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default WorkerReport;
