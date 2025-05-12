import React from "react";

import { useState } from "react";
import { transactionsApi } from "../services/api";
import Alert from "./Alert";

const ReturnRequest = ({ transactionId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReturn = async () => {
    try {
      setLoading(true);
      setError(null);

      await transactionsApi.return(transactionId);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error returning book:", err);
      setError("Failed to process return request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <p className="text-gray-700">
        Are you sure you want to return this book?
      </p>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleReturn}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? "Processing..." : "Confirm Return"}
        </button>
      </div>
    </div>
  );
};

export default ReturnRequest;
