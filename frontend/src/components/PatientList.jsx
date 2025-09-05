import React from "react";

function PatientList({ patients }) {
  // Aaj ki date nikal lo (yyyy-mm-dd format me)
  const today = new Date().toISOString().split("T")[0];

  // Filter patients jinki date aaj ki ho
  const todaysPatients = patients.filter((p) => {
    const patientDate = new Date(p.date).toISOString().split("T")[0];
    return patientDate === today;
  });

  if (todaysPatients.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">
        No patients today.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-gray-700 mb-4">
        📋 Today’s Patients
      </h3>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Age</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Tests</th>
              <th className="p-2">Total</th>
              <th className="p-2">Paid</th>
              <th className="p-2">Pending</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {todaysPatients.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.age}</td>
                <td className="p-2">{p.mobile}</td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-1">
                    {p.tests?.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                      >
                        {t.testName} - ₹{t.price}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-2 font-semibold">₹{p.totalAmount}</td>
                <td className="p-2 text-blue-600">₹{p.paidAmount}</td>
                <td className="p-2 text-red-600">
                  ₹{p.pendingAmount ?? p.totalAmount - p.paidAmount}
                </td>
                <td className="p-2">{p.paymentMode}</td>
                <td className="p-2 text-sm text-gray-500">
                  {new Date(p.date).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {todaysPatients.map((p) => (
          <div
            key={p._id}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg">{p.name}</h4>
              <span className="text-sm text-gray-500">
                {new Date(p.date).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Age: {p.age} | Phone: {p.mobile}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.tests?.map((t, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                >
                  {t.testName} - ₹{t.price}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-gray-100 rounded">
                Total: <span className="font-bold">₹{p.totalAmount}</span>
              </div>
              <div className="p-2 bg-green-100 rounded">
                Paid: <span className="font-bold">₹{p.paidAmount}</span>
              </div>
              <div className="p-2 bg-red-100 rounded">
                Pending:{" "}
                <span className="font-bold">
                  ₹{p.pendingAmount ?? p.totalAmount - p.paidAmount}
                </span>
              </div>
              <div className="p-2 bg-blue-100 rounded">
                Mode: <span className="font-bold">{p.paymentMode}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientList;
