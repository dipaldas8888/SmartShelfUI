import React from "react";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { transactionsApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import TransactionFormModal from "../components/TransactionFormModal";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [returnId, setReturnId] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [filter, setFilter] = useState("all"); // 'all', 'borrowed', 'returned', 'overdue'
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const transactionsRes = await transactionsApi.getAll();
      setTransactions(transactionsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleViewDetails = (transaction) => {
    setCurrentTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleReturn = (transactionId) => {
    setReturnId(transactionId);
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Call the updated API method with just the ID
      await transactionsApi.return(returnId);

      // After successful return, refresh the data
      await fetchData();

      setAlert({ type: "success", message: "Book returned successfully" });
      setShowReturnModal(false);
    } catch (err) {
      console.error("Error returning book:", err);
      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Failed to return book. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTransactionSuccess = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
    setAlert({ type: "success", message: "Book borrowed successfully" });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    if (filter === "borrowed") return !transaction.returnDate;
    if (filter === "returned") return transaction.returnDate;
    if (filter === "overdue")
      return (
        !transaction.returnDate && new Date(transaction.dueDate) < new Date()
      );
    return true;
  });

  const columns = [
    {
      key: "book",
      header: "Book",
      render: (transaction) => (
        <Link
          to={`/books/${transaction.book.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          {transaction.book.title}
        </Link>
      ),
    },
    {
      key: "member",
      header: "Member",
      render: (transaction) => (
        <Link
          to={`/members/${transaction.member.id}`}
          className="text-blue-600 hover:text-blue-900"
        >
          {transaction.member.name}
        </Link>
      ),
    },
    {
      key: "borrowDate",
      header: "Borrow Date",
      render: (transaction) =>
        new Date(transaction.borrowDate).toLocaleDateString(),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (transaction) =>
        new Date(transaction.dueDate).toLocaleDateString(),
    },
    {
      key: "returnDate",
      header: "Return Date",
      render: (transaction) =>
        transaction.returnDate
          ? new Date(transaction.returnDate).toLocaleDateString()
          : "Not returned",
    },
    {
      key: "status",
      header: "Status",
      render: (transaction) => {
        if (transaction.returnDate) {
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Returned
            </span>
          );
        } else if (new Date(transaction.dueDate) < new Date()) {
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Overdue
            </span>
          );
        } else {
          return (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
              Borrowed
            </span>
          );
        }
      },
    },
  ];

  const renderActions = (transaction) => {
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewDetails(transaction)}
          className="text-blue-600 hover:text-blue-900"
        >
          Details
        </button>
        {!transaction.returnDate && (
          <button
            onClick={() => handleReturn(transaction.id)}
            className="text-green-600 hover:text-green-900"
          >
            Return
          </button>
        )}
      </div>
    );
  };

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
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => setShowBorrowModal(true)}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Borrow Book
        </button>
      </div>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="flex items-center">
        <label
          htmlFor="filter"
          className="mr-2 text-sm font-medium text-gray-700"
        >
          Filter:
        </label>
        <select
          id="filter"
          className="form-input w-auto"
          value={filter}
          onChange={handleFilterChange}
        >
          <option value="all">All Transactions</option>
          <option value="borrowed">Currently Borrowed</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {error ? (
        <Alert type="error" message={error} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredTransactions}
          actions={renderActions}
        />
      )}

      {/* Borrow Modal */}
      <TransactionFormModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onSuccess={handleAddTransactionSuccess}
      />

      {/* Return Modal */}
      <Modal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        title="Return Book"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to return this book?
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowReturnModal(false)}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleReturnSubmit}
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Return"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Transaction Details"
      >
        {currentTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Book Information
                </h3>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">{currentTransaction.book.title}</p>
                  <p className="text-sm text-gray-600">
                    Author: {currentTransaction.book.author}
                  </p>
                  <p className="text-sm text-gray-600">
                    ISBN: {currentTransaction.book.isbn}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Member Information
                </h3>
                <div className="mt-2 bg-gray-50 p-3 rounded-md">
                  <p className="font-medium">
                    {currentTransaction.member.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    ID: {currentTransaction.member.memberId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {currentTransaction.member.email}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Transaction Details
              </h3>
              <div className="mt-2 bg-gray-50 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID:</p>
                    <p className="font-medium">{currentTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status:</p>
                    <p className="font-medium">
                      {currentTransaction.returnDate
                        ? "Returned"
                        : new Date(currentTransaction.dueDate) < new Date()
                        ? "Overdue"
                        : "Borrowed"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Borrow Date:</p>
                    <p className="font-medium">
                      {new Date(
                        currentTransaction.borrowDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date:</p>
                    <p className="font-medium">
                      {new Date(
                        currentTransaction.dueDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Return Date:</p>
                    <p className="font-medium">
                      {currentTransaction.returnDate
                        ? new Date(
                            currentTransaction.returnDate
                          ).toLocaleDateString()
                        : "Not returned"}
                    </p>
                  </div>
                  {!currentTransaction.returnDate &&
                    new Date(currentTransaction.dueDate) < new Date() && (
                      <div>
                        <p className="text-sm text-gray-600">Days Overdue:</p>
                        <p className="font-medium text-red-600">
                          {Math.floor(
                            (new Date() -
                              new Date(currentTransaction.dueDate)) /
                              (1000 * 60 * 60 * 24)
                          )}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              {!currentTransaction.returnDate && (
                <button
                  onClick={() => {
                    setReturnId(currentTransaction.id);
                    setShowDetailsModal(false);
                    setShowReturnModal(true);
                  }}
                  className="btn btn-primary mr-2"
                >
                  Return Book
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Transactions;
