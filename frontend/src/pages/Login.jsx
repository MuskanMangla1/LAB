// src/Login.jsx
import { useState } from "react";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // sirf password check
    if (password === "12345") {
      setError("");
      onLogin(); // parent ko bolega ki login ho gaya
    } else {
      setError("Invalid password!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
