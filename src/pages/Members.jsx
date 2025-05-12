import React from "react";
import AddEditMemberModal from "../components/AddEditMemberModal";

import { useState, useEffect } from "react";
import { membersApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Alert from "../components/Alert";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMember, setCurrentMember] = useState({
    memberId: "",
    name: "",
    email: "",
    status: "ACTIVE",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await membersApi.getAll();
      setMembers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load members");
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentMember({
      memberId: "",
      name: "",
      email: "",
      status: "ACTIVE",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await membersApi.delete(id);
        setMembers(members.filter((member) => member.id !== id));
        setAlert({ type: "success", message: "Member deleted successfully" });
      } catch (err) {
        console.error("Error deleting member:", err);
        setAlert({
          type: "error",
          message: `Failed to delete book: ${
            err.response?.data?.message || err.message
          }`,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const response = await membersApi.update(
          currentMember.id,
          currentMember
        );
        const updatedMember = response.data;
        setMembers(
          members.map((member) =>
            member.id === updatedMember.id ? updatedMember : member
          )
        );
        setAlert({ type: "success", message: "Member updated successfully" });
      } else {
        const response = await membersApi.create(currentMember);
        const newMember = response.data;
        setMembers([...members, newMember]);
        setAlert({ type: "success", message: "Member added successfully" });
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving member:", err);
      setAlert({ type: "error", message: "Failed to save member" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMember((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    { key: "memberId", header: "Member ID" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "registrationDate",
      header: "Registration Date",
      render: (member) =>
        new Date(member.registrationDate).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (member) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            member.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {member.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Members</h1>
        <button
          onClick={handleAdd}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Member
        </button>
      </div>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      {error ? (
        <Alert type="error" message={error} />
      ) : (
        <DataTable
          columns={columns}
          data={members}
          linkPath="/members"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddEditMemberModal
        showModal={showModal}
        setShowModal={setShowModal}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        currentMember={currentMember}
      />
    </div>
  );
};

export default Members;
