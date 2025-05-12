import React from "react";
import Modal from "./Modal";

const AddEditMemberModal = ({
  showModal,
  setShowModal,
  isEditing,
  handleSubmit,
  currentMember,
  handleChange,
}) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title={isEditing ? "Edit Member" : "Add Member"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="form-input"
            value={currentMember.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="form-input"
            value={currentMember.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="memberId"
            className="block text-sm font-medium text-gray-700"
          >
            Member ID
          </label>
          <input
            type="text"
            id="memberId"
            name="memberId"
            required
            className="form-input"
            value={currentMember.memberId}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
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
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditMemberModal;
