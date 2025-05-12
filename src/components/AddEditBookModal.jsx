import React from "react";
import Modal from "../components/Modal";

const AddEditBookModal = ({
  showModal,
  setShowModal,
  isEditing,
  handleSubmit,
  currentBook,
  handleChange,
}) => {
  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditing ? "Edit Book" : "Add Book"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="form-input"
              value={currentBook.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              className="form-input"
              value={currentBook.author}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="isbn"
              className="block text-sm font-medium text-gray-700"
            >
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              required
              className="form-input"
              value={currentBook.isbn}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="publicationYear"
              className="block text-sm font-medium text-gray-700"
            >
              Publication Year
            </label>
            <input
              type="number"
              id="publicationYear"
              name="publicationYear"
              className="form-input"
              value={currentBook.publicationYear}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              required
              min="0"
              className="form-input"
              value={currentBook.quantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="availableQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Available Quantity
            </label>
            <input
              type="number"
              id="availableQuantity"
              name="availableQuantity"
              required
              min="0"
              max={currentBook.quantity}
              className="form-input"
              value={currentBook.availableQuantity}
              onChange={handleChange}
            />
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
    </>
  );
};

export default AddEditBookModal;
