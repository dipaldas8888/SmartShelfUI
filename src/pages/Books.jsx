import React from "react";

import { useState, useEffect } from "react";
import { booksApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import AddEditBookModal from "../components/AddEditBookModal";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
    quantity: "",
    availableQuantity: "",
  });
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setCurrentBook({
      title: "",
      author: "",
      isbn: "",
      publicationYear: "",
      quantity: "",
      availableQuantity: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await booksApi.delete(id);
        setBooks(books.filter((book) => book.id !== id));
        setAlert({ type: "success", message: "Book deleted successfully" });
      } catch (err) {
        console.error("Error deleting book:", err);
        setAlert({
          type: "error",
          message: `Failed to delete book: ${
            err.response?.data?.message || err.message
          }`,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const response = await booksApi.update(currentBook.id, currentBook);
        const updatedBook = response.data;
        setBooks(
          books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        setAlert({ type: "success", message: "Book updated successfully" });
      } else {
        const response = await booksApi.create(currentBook);
        const newBook = response.data;
        setBooks([...books, newBook]);
        setAlert({ type: "success", message: "Book added successfully" });
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving book:", err);
      setAlert({ type: "error", message: "Failed to save book" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBook((prev) => ({ ...prev, [name]: value }));
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
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Books</h1>
        <button
          onClick={handleAdd}
          className="mt-3 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

      <AddEditBookModal
        showModal={showModal}
        setShowModal={setShowModal}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        currentBook={currentBook}
      />

      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default Books;
