import React, { useState } from "react";
import axios from "axios";

function PatientForm({ onAdded }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    sex: "",
    mobile: "",
    tests: [],
    totalAmount: 0,
    paidAmount: 0,
    paymentMode: "Cash",
  });
  const [testInput, setTestInput] = useState({ testName: "", price: "" });
  const [error, setError] = useState("");

  const addTest = () => {
    if (!testInput.testName || Number(testInput.price) <= 0) return;
    const updated = [...form.tests, { testName: testInput.testName, price: Number(testInput.price) }];
    const total = updated.reduce((s, t) => s + (t.price || 0), 0);
    setForm({ ...form, tests: updated, totalAmount: total });
    setTestInput({ testName: "", price: "" });
  };

  const removeTest = (i) => {
    const updated = form.tests.filter((_, idx) => idx !== i);
    const total = updated.reduce((s, t) => s + (t.price || 0), 0);
    setForm({ ...form, tests: updated, totalAmount: total });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:5000/api/patients", form);
      alert("✅ Patient Added!");
      setForm({
        name: "",
        age: "",
        sex: "",
        mobile: "",
        tests: [],
        totalAmount: 0,
        paidAmount: 0,
        paymentMode: "Cash",
      });
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error adding patient");
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="w-full space-y-3 bg-gray-50 p-4 rounded-lg shadow-md"
>
  <h3 className="text-xl font-bold text-gray-700">➕ Add Patient</h3>

  <div className="grid md:grid-cols-2 gap-3">
    <input
      required
      placeholder="Name"
      className="border rounded-lg p-2 w-full"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
    />
    <input
      required
      type="number"
      placeholder="Age"
      className="border rounded-lg p-2 w-full"
      value={form.age}
      onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
    />
  </div>

  <div className="grid md:grid-cols-2 gap-3">
    <select
      required
      className="border rounded-lg p-2 w-full"
      value={form.sex}
      onChange={(e) => setForm({ ...form, sex: e.target.value })}
    >
      <option value="">Select Sex</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>
    <input
      required
      placeholder="Mobile"
      className="border rounded-lg p-2 w-full"
      value={form.mobile}
      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
    />
  </div>

{/* Tests Section */}
<div className="p-3 border rounded-lg bg-white">
  <h4 className="font-semibold mb-2">🧪 Tests</h4>
  <div className="flex flex-col sm:flex-row gap-2 mb-2">
    <input
      placeholder="Test name"
      className="border rounded-lg p-2 flex-1"
      value={testInput.testName}
      onChange={(e) => setTestInput({ ...testInput, testName: e.target.value })}
    />
    <input
      type="number"
      placeholder="Price"
      className="border rounded-lg p-2 w-full sm:w-24"
      value={testInput.price}
      onChange={(e) => setTestInput({ ...testInput, price: e.target.value })}
    />
    <button
      type="button"
      onClick={addTest}
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg w-full sm:w-auto"
    >
      Add
    </button>
  </div>

  {/* ✅ Added Tests List */}
  {form.tests.length > 0 && (
    <ul className="space-y-1">
      {form.tests.map((t, i) => (
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


  <div className="grid md:grid-cols-2 gap-3">
    <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
      <span className="font-medium">Total:</span>
      <span className="font-bold text-green-600">₹{form.totalAmount}</span>
    </div>
    <input
      type="number"
      placeholder="Paid Amount"
      className="border rounded-lg p-2 w-full"
      value={form.paidAmount}
      onChange={(e) => setForm({ ...form, paidAmount: Number(e.target.value) })}
    />
  </div>

  <select
    className="border rounded-lg p-2 w-full"
    value={form.paymentMode}
    onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
  >
    <option>Cash</option>
    <option>Paytm</option>
    <option>Online</option>
  </select>

  {error && <div className="text-red-600">{error}</div>}

  <button
    type="submit"
    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
  >
    Save Patient
  </button>
</form>

  );
}

export default PatientForm;
