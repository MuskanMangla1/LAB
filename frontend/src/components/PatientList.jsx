import React, { useState, useEffect } from "react";
import axios from "axios";

function PatientList({ onUpdated }) {
  const [patients, setPatients] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [testInput, setTestInput] = useState({ testName: "", price: "" });

  useEffect(() => {
    fetchPatients(selectedDate);
  }, [selectedDate]);

  const fetchPatients = async (date) => {
    try {
      const res = await axios.get(
        `https://lab-c7sj.onrender.com/api/patients/range?start=${date}&end=${date}`
      );
      setPatients(res.data.patients);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`https://lab-c7sj.onrender.com/api/patients/${id}`);
      alert("❌ Patient Deleted");
      fetchPatients(selectedDate);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      alert("Error deleting patient");
    }
  };

  // Edit Modal open
  const handleEditClick = (patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setTestInput({ testName: "", price: "" });
  };

  // Form change with auto calculation
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (["age", "totalAmount", "paidAmount"].includes(name)) {
        updated[name] = Number(value);
      }
      if (name === "date") {
        updated.date = value; // ✅ handle datetime-local string
      }
      updated.pendingAmount =
        (updated.totalAmount || 0) - (updated.paidAmount || 0);
      return updated;
    });
  };

  // Add test
  const addTest = () => {
    if (!testInput.testName || Number(testInput.price) <= 0) return;
    const updatedTests = [
      ...(formData.tests || []),
      { ...testInput, price: Number(testInput.price) },
    ];
    const total = updatedTests.reduce((s, t) => s + (t.price || 0), 0);
    setFormData({
      ...formData,
      tests: updatedTests,
      totalAmount: total,
      pendingAmount: total - (formData.paidAmount || 0),
    });
    setTestInput({ testName: "", price: "" });
  };

  const removeTest = (i) => {
    const updatedTests = formData.tests.filter((_, idx) => idx !== i);
    const total = updatedTests.reduce((s, t) => s + (t.price || 0), 0);
    setFormData({
      ...formData,
      tests: updatedTests,
      totalAmount: total,
      pendingAmount: total - (formData.paidAmount || 0),
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://lab-c7sj.onrender.com/api/patients/${editingPatient._id}`,
        formData
      );
      alert("✅ Patient Updated");
      setEditingPatient(null);
      fetchPatients(selectedDate);
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
      alert("Error updating patient");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-700">📋 Patients</h3>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {patients.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No patients for selected date.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Age</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Total</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Pending</th>
                <th className="p-2">Mode</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.age}</td>
                  <td className="p-2">{p.mobile}</td>
                  <td className="p-2 font-semibold">₹{p.totalAmount}</td>
                  <td className="p-2 text-blue-600">₹{p.paidAmount}</td>
                  <td className="p-2 text-red-600">
                    ₹{p.pendingAmount ?? p.totalAmount - p.paidAmount}
                  </td>
                  <td className="p-2">{p.paymentMode}</td>
                  <td className="p-2 text-sm text-gray-500">
                    {new Date(p.date).toLocaleString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(p)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">✏️ Edit Patient</h2>

            {/* Name, Age, Mobile */}
            <div className="space-y-2 mb-4">
              <label className="font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />

              <label className="font-medium">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age || ""}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />

              <label className="font-medium">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile || ""}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Tests Section */}
            <div className="p-3 border rounded-lg bg-gray-50 mb-4">
              <h4 className="font-semibold mb-2">🧪 Tests</h4>

              {/* Input Row */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={testInput.testName}
                  onChange={(e) =>
                    setTestInput({ ...testInput, testName: e.target.value })
                  }
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  value={testInput.price}
                  onChange={(e) =>
                    setTestInput({ ...testInput, price: e.target.value })
                  }
                  className="border p-2 rounded w-24"
                />
              </div>
              <button
                type="button"
                onClick={addTest}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded w-full"
              >
                ➕ Add
              </button>

              {/* Tests List */}
              {formData.tests?.length > 0 && (
                <ul className="space-y-1">
                  {formData.tests.map((t, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    >
                      <span>
                        {t.testName} - ₹{t.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTest(i)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Amounts */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span className="font-medium">Total Amount</span>
                <span className="font-bold text-green-600">
                  ₹{formData.totalAmount}
                </span>
              </div>

              <label className="font-medium">Paid Amount</label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount || 0}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />

              <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span className="font-medium">Pending Amount</span>
                <span className="font-bold text-red-600">
                  ₹{formData.pendingAmount}
                </span>
              </div>
            </div>

            {/* Payment Mode & Date */}
            <div className="space-y-2 mb-4">
              <label className="font-medium">Payment Mode</label>
              <select
                name="paymentMode"
                value={formData.paymentMode || ""}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>

              {/* ✅ Date-Time field */}
              <label className="font-medium">Date & Time</label>
              <input
                type="datetime-local"
                name="date"
                value={
                  formData.date
                    ? new Date(formData.date).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingPatient(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientList;
