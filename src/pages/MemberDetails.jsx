import React from "react";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { membersApi, transactionsApi } from "../services/api";
import Alert from "../components/Alert";
import DataTable from "../components/DataTable";

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        setLoading(true);
        const [memberRes, transactionsRes] = await Promise.all([
          membersApi.getById(id),
          transactionsApi.getByMember(id),
        ]);

        setMember(memberRes.data);
        setTransactions(transactionsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching member details:", err);
        setError("Failed to load member details");
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id]);

  const handleBack = () => {
    navigate("/members");
  };

  const handleEdit = () => {
    navigate(`/members/edit/${id}`);
  };

  const transactionColumns = [
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

  if (!member) {
    return <Alert type="error" message="Member not found" />;
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
        <h1 className="text-2xl font-bold">{member.name}</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Member Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details about the member.
            </p>
          </div>
          <button onClick={handleEdit} className="btn btn-primary">
            Edit Member
          </button>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Member ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {member.memberId}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {member.name}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {member.email}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Registration Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(member.registrationDate).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {member.status}
                </span>
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
          <p className="text-gray-500">
            No transaction history for this member
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
