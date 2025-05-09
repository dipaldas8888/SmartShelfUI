import React from "react";

// import EditMember from "./pages/EditMember";
import "./index.css";

// Protected route component

function App() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            Tailwind CSS Test
          </h1>
          <p className="text-gray-600">This is a test of Tailwind C</p>
        </div>
      </div>
    </div>
  );
}

// Layout component for authenticated routes

export default App;
