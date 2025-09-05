import { useState } from "react";
import Login from "./pages/Login"; 
import PatientsPage from "./pages/Patients";
import Reports from "./pages/Reports";
import Navbar from "./components/NavBar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentTab, setCurrentTab] = useState("list"); // default Today’s Patients

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="p-6 max-w-6xl mx-auto">
        {currentTab === "add" && <PatientsPage showFormOnly />} 
        {currentTab === "reports" && <Reports />}
        {currentTab === "list" && <PatientsPage showListOnly />} 
      </main>
    </div>
  );
}

export default App;
