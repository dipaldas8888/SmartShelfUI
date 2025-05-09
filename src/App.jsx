import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Transactions from "./pages/Transactions";
import BookDetails from "./pages/BookDetails";
import MemberDetails from "./pages/MemberDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import React from "react";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
      />

      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/members" element={<Members />} />
        <Route path="/members/:id" element={<MemberDetails />} />
        <Route path="/transactions" element={<Transactions />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
