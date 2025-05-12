import React from "react";

import { useState, useEffect } from "react";
import { transactionsApi, booksApi, membersApi } from "../services/api";
import Modal from "./Modal";

const TransactionFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTransaction, setCurrentTransaction] = useState({
    bookId: "",
    memberId: "",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 14 days from now
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [booksRes, membersRes] = await Promise.all([
        booksApi.getAll(),
        membersApi.getAll(),
      ]);

      setBooks(booksRes.data.filter((book) => book.availableQuantity > 0));
      setMembers(
        membersRes.data.filter((member) => member.status === "ACTIVE")
      );
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setErrors({
        submit: "Failed to load books and members. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!currentTransaction.bookId) newErrors.bookId = "Book is required";
    if (!currentTransaction.memberId) newErrors.memberId = "Member is required";
    if (!currentTransaction.dueDate) newErrors.dueDate = "Due date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTransaction((prev) => ({ ...prev, [name]: value }));

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
      const response = await transactionsApi.borrow({
        ...currentTransaction,
        dueDate: new Date(currentTransaction.dueDate).toISOString(),
      });

      // Reset form
      setCurrentTransaction({
        bookId: "",
        memberId: "",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });

      // Close modal and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
      setErrors({
        submit:
          err.response?.data?.message ||
          "Failed to borrow book. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Borrow Book">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-4 text-center">
            <div className="loader mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading books and members...</p>
          </div>
        ) : (
          <>
            <div>
              <label
                htmlFor="bookId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Book
              </label>
              <select
                id="bookId"
                name="bookId"
                className={`form-input ${
                  errors.bookId ? "border-red-500" : ""
                }`}
                value={currentTransaction.bookId}
                onChange={handleChange}
              >
                <option value="">Select Book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} by {book.author} ({book.availableQuantity}{" "}
                    available)
                  </option>
                ))}
              </select>
              {errors.bookId && (
                <p className="mt-1 text-sm text-red-600">{errors.bookId}</p>
              )}
              {books.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  No books available for borrowing.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="memberId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Member
              </label>
              <select
                id="memberId"
                name="memberId"
                className={`form-input ${
                  errors.memberId ? "border-red-500" : ""
                }`}
                value={currentTransaction.memberId}
                onChange={handleChange}
              >
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.memberId})
                  </option>
                ))}
              </select>
              {errors.memberId && (
                <p className="mt-1 text-sm text-red-600">{errors.memberId}</p>
              )}
              {members.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  No active members available.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className={`form-input ${
                  errors.dueDate ? "border-red-500" : ""
                }`}
                min={new Date().toISOString().split("T")[0]}
                value={currentTransaction.dueDate}
                onChange={handleChange}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Processing..." : "Borrow Book"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionFormModal;
