// pages/Reports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function Reports() {
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [range, setRange] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  
  const fetchDaily = async () => {
    try {
      const res = await axios.get("https://lab-c7sj.onrender.com/api/patients/daily");
      setDaily(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchMonthly = async () => {
    try {
      const res = await axios.get("https://lab-c7sj.onrender.com/api/patients/monthly");
      setMonthly(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRange = async () => {
    if (!start || !end) return alert("Select start and end dates");
    try {
      const res = await axios.get(
        `https://lab-c7sj.onrender.com/api/patients/range?start=${start}&end=${end}`
      );
      setRange(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching range");
    }
  };

useEffect(() => {
  fetchDaily();
  fetchMonthly();

  // Print today's date in console and check format
  const today = new Date();
  console.log("Raw Date object:", today);

  const formatted = today.toISOString().slice(0, 10);
  console.log("Formatted (YYYY-MM-DD):", formatted);
}, []);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Reports</h2>

      {/* Today's Report */}
      <div className="bg-white shadow-md rounded-xl p-5 border">
<h3 className="text-lg font-semibold text-blue-600 mb-3">
  Today ({daily?.date || new Date().toISOString().slice(0, 10)})
</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">Revenue</p>
            <p className="text-lg font-bold text-blue-700">
              ₹{daily?.stats?.totalRevenue ?? 0}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium">Paid</p>
            <p className="text-lg font-bold text-green-700">
              ₹{daily?.stats?.totalPaid ?? 0}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="font-medium">Pending</p>
            <p className="text-lg font-bold text-red-700">
              ₹{daily?.stats?.totalPending ?? 0}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="font-medium">Patients / Tests</p>
            <p className="text-lg font-bold text-yellow-700">
              {daily?.stats?.count ?? 0} / {daily?.stats?.totalTestsCount ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Report */}
      <div className="bg-white shadow-md rounded-xl p-5 border">
        <h3 className="text-lg font-semibold text-purple-600 mb-3">
          This Month ({monthly?.month}/{monthly?.year})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">Revenue</p>
            <p className="text-lg font-bold text-blue-700">
              ₹{monthly?.stats?.totalRevenue ?? 0}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium">Paid</p>
            <p className="text-lg font-bold text-green-700">
              ₹{monthly?.stats?.totalPaid ?? 0}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="font-medium">Pending</p>
            <p className="text-lg font-bold text-red-700">
              ₹{monthly?.stats?.totalPending ?? 0}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="font-medium">Patients / Tests</p>
            <p className="text-lg font-bold text-yellow-700">
              {monthly?.stats?.count ?? 0} / {monthly?.stats?.totalTestsCount ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Range */}
      <div className="bg-white shadow-md rounded-xl p-5 border">
        <h3 className="text-lg font-semibold text-indigo-600 mb-3">
          Custom Range
        </h3>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <span>to</span>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={fetchRange}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded"
          >
            Get Report
          </button>
        </div>

        {range && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">Revenue</p>
              <p className="text-lg font-bold text-blue-700">
                ₹{range.stats?.totalRevenue ?? 0}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium">Paid</p>
              <p className="text-lg font-bold text-green-700">
                ₹{range.stats?.totalPaid ?? 0}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium">Pending</p>
              <p className="text-lg font-bold text-red-700">
                ₹{range.stats?.totalPending ?? 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="font-medium">Patients / Tests</p>
              <p className="text-lg font-bold text-yellow-700">
                {range.stats?.count ?? 0} / {range.stats?.totalTestsCount ?? 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
