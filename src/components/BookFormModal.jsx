import React from "react";

import { useState } from "react";
import { booksApi } from "../services/api";
import Modal from "./Modal";

const BookFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentBook, setCurrentBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
    quantity: "",
    availableQuantity: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!currentBook.title.trim()) newErrors.title = "Title is required";
    if (!currentBook.author.trim()) newErrors.author = "Author is required";
    if (!currentBook.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!currentBook.quantity) newErrors.quantity = "Quantity is required";
    if (!currentBook.availableQuantity)
      newErrors.availableQuantity = "Available quantity is required";

    if (
      Number.parseInt(currentBook.availableQuantity) >
      Number.parseInt(currentBook.quantity)
    ) {
      newErrors.availableQuantity =
        "Available quantity cannot exceed total quantity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook((prev) => ({ ...prev, [name]: value }));

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
      const response = await booksApi.create(currentBook);

      // Reset form
      setCurrentBook({
        title: "",
        author: "",
        isbn: "",
        publicationYear: "",
        quantity: "",
        availableQuantity: "",
      });

      // Close modal and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error("Error adding book:", err);
      setErrors({
        submit:
          err.response?.data?.message ||
          "Failed to add book. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Book">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={`form-input ${errors.title ? "border-red-500" : ""}`}
            value={currentBook.title}
            onChange={handleChange}
            placeholder="Enter book title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className={`form-input ${errors.author ? "border-red-500" : ""}`}
            value={currentBook.author}
            onChange={handleChange}
            placeholder="Enter author name"
          />
          {errors.author && (
            <p className="mt-1 text-sm text-red-600">{errors.author}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="isbn"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            className={`form-input ${errors.isbn ? "border-red-500" : ""}`}
            value={currentBook.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
          />
          {errors.isbn && (
            <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="publicationYear"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            placeholder="Enter publication year"
          />
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="0"
            className={`form-input ${errors.quantity ? "border-red-500" : ""}`}
            value={currentBook.quantity}
            onChange={handleChange}
            placeholder="Enter total quantity"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="availableQuantity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Available Quantity
          </label>
          <input
            type="number"
            id="availableQuantity"
            name="availableQuantity"
            min="0"
            max={currentBook.quantity || 0}
            className={`form-input ${
              errors.availableQuantity ? "border-red-500" : ""
            }`}
            value={currentBook.availableQuantity}
            onChange={handleChange}
            placeholder="Enter available quantity"
          />
          {errors.availableQuantity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.availableQuantity}
            </p>
          )}
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
            {isSubmitting ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookFormModal;
