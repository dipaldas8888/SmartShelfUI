import React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { booksApi, transactionsApi } from "../services/api";
import Alert from "../components/Alert";
import DataTable from "../components/DataTable";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        const [bookRes, transactionsRes] = await Promise.all([
          booksApi.getById(id),
          transactionsApi.getByBook(id),
        ]);

        setBook(bookRes.data);
        setTransactions(transactionsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details");
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handleBack = () => {
    navigate("/books");
  };

  const handleEdit = () => {
    navigate(`/books/edit/${id}`);
  };

  const transactionColumns = [
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (!book) {
    return <Alert type="error" message="Book not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">{book.title}</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Book Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details about the book.
            </p>
          </div>
          <button onClick={handleEdit} className="btn btn-primary">
            Edit Book
          </button>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {book.title}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Author</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {book.author}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ISBN</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {book.isbn}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Publication Year
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {book.publicationYear || "N/A"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Availability
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {book.availableQuantity} out of {book.quantity} available
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (book.availableQuantity / book.quantity) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        {transactions.length > 0 ? (
          <DataTable columns={transactionColumns} data={transactions} />
        ) : (
          <p className="text-gray-500">No transaction history for this book</p>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
