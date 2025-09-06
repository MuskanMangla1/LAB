import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";

function PatientsPage({ showListOnly = false, showFormOnly = false }) {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("https://lab-c7sj.onrender.com/api/patients"  );
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!showFormOnly) {
      fetchPatients();
    }
  }, [showFormOnly]);

  return (
    <div className="space-y-6">
      {/* Sirf form dikhe agar add patient hai */}
      {showFormOnly && (
        <div className="w-full">
          <PatientForm onAdded={fetchPatients} />
        </div>
      )}

      {/* Sirf list dikhe agar today’s patient hai */}
      {showListOnly && <PatientList patients={patients} />}
    </div>
  );
}

export default PatientsPage;
