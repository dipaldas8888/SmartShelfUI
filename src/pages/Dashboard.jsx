import React from "react";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { booksApi, membersApi, transactionsApi } from "../services/api";
import StatsCard from "../components/StatsCard";
import Alert from "../components/Alert";
import BookFormModal from "../components/BookFormModal";
import MemberFormModal from "../components/MemberFormModal";
import TransactionFormModal from "../components/TransactionFormModal";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalTransactions: 0,
    overdueBooks: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [booksRes, membersRes, transactionsRes, overdueRes] =
        await Promise.all([
          booksApi.getAll(),
          membersApi.getAll(),
          transactionsApi.getAll(),
          transactionsApi.getOverdue(),
        ]);

      setStats({
        totalBooks: booksRes.data.length,
        totalMembers: membersRes.data.length,
        totalTransactions: transactionsRes.data.length,
        overdueBooks: overdueRes.data.length,
      });

      // Get the most recent 5 transactions
      const sortedTransactions = transactionsRes.data
        .sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate))
        .slice(0, 5);

      setRecentTransactions(sortedTransactions);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const handleAddBookSuccess = (newBook) => {
    // Update stats
    setStats((prev) => ({
      ...prev,
      totalBooks: prev.totalBooks + 1,
    }));

    // Show success message
    setAlert({
      type: "success",
      message: `Book "${newBook.title}" has been added successfully.`,
    });

    // Clear alert after 5 seconds
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 5000);
  };

  const handleAddMemberSuccess = (newMember) => {
    // Update stats
    setStats((prev) => ({
      ...prev,
      totalMembers: prev.totalMembers + 1,
    }));

    // Show success message
    setAlert({
      type: "success",
      message: `Member "${newMember.name}" has been added successfully.`,
    });

    // Clear alert after 5 seconds
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 5000);
  };

  const handleAddTransactionSuccess = (newTransaction) => {
    // Update stats
    setStats((prev) => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
    }));

    // Update recent transactions
    const bookTitle = newTransaction.book?.title || "Book";
    const memberName = newTransaction.member?.name || "Member";

    // Show success message
    setAlert({
      type: "success",
      message: `"${bookTitle}" has been borrowed by ${memberName} successfully.`,
    });

    // Refresh dashboard data to get updated transactions
    fetchDashboardData();

    // Clear alert after 5 seconds
    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 5000);
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
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={stats.totalBooks}
          icon={
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          }
          bgColor="bg-blue-500"
        />

        <StatsCard
          title="Total Members"
          value={stats.totalMembers}
          icon={
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          bgColor="bg-green-500"
        />

        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          }
          bgColor="bg-purple-500"
        />

        <StatsCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          bgColor="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <Link
              to="/transactions"
              className="text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Book
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Member
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Borrow Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/books/${transaction.book.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {transaction.book.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/members/${transaction.member.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {transaction.member.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(transaction.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.returnDate ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Returned
                          </span>
                        ) : new Date(transaction.dueDate) < new Date() ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Overdue
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Borrowed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => setShowAddBookModal(true)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="h-6 w-6 text-blue-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add New Book</span>
            </button>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="h-6 w-6 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Register New Member</span>
            </button>
            <button
              onClick={() => setShowAddTransactionModal(true)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg
                className="h-6 w-6 text-purple-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Record New Transaction</span>
            </button>
          </div>
        </div>
      </div>

      <BookFormModal
        isOpen={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        onSuccess={handleAddBookSuccess}
      />

      <MemberFormModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSuccess={handleAddMemberSuccess}
      />

      <TransactionFormModal
        isOpen={showAddTransactionModal}
        onClose={() => setShowAddTransactionModal(false)}
        onSuccess={handleAddTransactionSuccess}
      />
    </div>
  );
};

export default Dashboard;
