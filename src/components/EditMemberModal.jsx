import React from "react";

import { useState, useEffect } from "react";
import { membersApi } from "../services/api";
import Modal from "./Modal";

const EditMemberModal = ({ isOpen, onClose, member, onSuccess }) => {
  const [currentMember, setCurrentMember] = useState({
    id: "",
    memberId: "",
    name: "",
    email: "",
    status: "ACTIVE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load member data when modal opens or member changes
  useEffect(() => {
    if (member && isOpen) {
      setCurrentMember({
        id: member.id,
        memberId: member.memberId || "",
        name: member.name || "",
        email: member.email || "",
        status: member.status || "ACTIVE",
      });
      setErrors({});
    }
  }, [member, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!currentMember.memberId.trim())
      newErrors.memberId = "Member ID is required";
    if (!currentMember.name.trim()) newErrors.name = "Name is required";
    if (!currentMember.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(currentMember.email))
      newErrors.email = "Email is invalid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMember((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await membersApi.update(currentMember.id, currentMember);

      // Close modal and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error("Error updating member:", err);
      setErrors({
        submit:
          err.response?.data?.message ||
          "Failed to update member. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="memberId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Member ID
          </label>
          <input
            type="text"
            id="memberId"
            name="memberId"
            className={`form-input ${errors.memberId ? "border-red-500" : ""}`}
            value={currentMember.memberId}
            onChange={handleChange}
            placeholder="Enter member ID"
          />
          {errors.memberId && (
            <p className="mt-1 text-sm text-red-600">{errors.memberId}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-input ${errors.name ? "border-red-500" : ""}`}
            value={currentMember.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${errors.email ? "border-red-500" : ""}`}
            value={currentMember.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            className="form-input"
            value={currentMember.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Member"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditMemberModal;
