import React from "react";

import { useState, useEffect } from "react";
import { membersApi } from "../services/api";
import DataTable from "../components/DataTable";
import Alert from "../components/Alert";
import MemberFormModal from "../components/MemberFormModal";
import EditMemberModal from "../components/EditMemberModal";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
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
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await membersApi.delete(id);
        setMembers(members.filter((member) => member.id !== id));
        setAlert({ type: "success", message: "Member deleted successfully" });
      } catch (err) {
        console.error("Error deleting member:", err);
        setAlert({ type: "error", message: "Failed to delete member" });
      }
    }
  };

  const handleAddMemberSuccess = (newMember) => {
    setMembers([...members, newMember]);
    setAlert({ type: "success", message: "Member added successfully" });
  };

  const handleEditMemberSuccess = (updatedMember) => {
    setMembers(
      members.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setAlert({ type: "success", message: "Member updated successfully" });
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
              : member.status === "INACTIVE"
              ? "bg-gray-100 text-gray-800"
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
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Members</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

      <MemberFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddMemberSuccess}
      />

      <EditMemberModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        member={currentMember}
        onSuccess={handleEditMemberSuccess}
      />
    </div>
  );
};

export default Members;
