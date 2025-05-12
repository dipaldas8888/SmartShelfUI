import React from "react";

import { useState, useEffect } from "react";
import { booksApi } from "../services/api";
import DataTable from "../components/DataTable";
import Alert from "../components/Alert";
import BookFormModal from "../components/BookFormModal";
import EditBookModal from "../components/EditBookModal";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksApi.getAll();
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books");
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = searchQuery
        ? await booksApi.search(searchQuery)
        : await booksApi.getAll();
      setBooks(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error searching books:", err);
      setError("Failed to search books");
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setCurrentBook(book);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksApi.delete(id);
        setBooks(books.filter((book) => book.id !== id));
        setAlert({ type: "success", message: "Book deleted successfully" });
      } catch (err) {
        console.error("Error deleting book:", err);
        setAlert({ type: "error", message: "Failed to delete book" });
      }
    }
  };

  const handleAddBookSuccess = (newBook) => {
    setBooks([...books, newBook]);
    setAlert({ type: "success", message: "Book added successfully" });
  };

  const handleEditBookSuccess = (updatedBook) => {
    setBooks(
      books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
    setAlert({ type: "success", message: "Book updated successfully" });
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "title", header: "Title" },
    { key: "author", header: "Author" },
    { key: "isbn", header: "ISBN" },
    { key: "publicationYear", header: "Year" },
    {
      key: "quantity",
      header: "Quantity",
      render: (book) => (
        <span>
          {book.availableQuantity} / {book.quantity}
        </span>
      ),
    },
  ];

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
        <h1 className="text-2xl font-bold">Books</h1>
        <button
          onClick={() => setShowAddBookModal(true)}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Book
        </button>
      </div>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search books..."
          className="form-input flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {error ? (
        <Alert type="error" message={error} />
      ) : (
        <DataTable
          columns={columns}
          data={books}
          linkPath="/books"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Book Modal */}
      <BookFormModal
        isOpen={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        onSuccess={handleAddBookSuccess}
      />

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        book={currentBook}
        onSuccess={handleEditBookSuccess}
      />
    </div>
  );
};

export default Books;
