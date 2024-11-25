import React, { useState } from 'react';
import './App.css'; // Assuming your CSS is in App.css

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle the search functionality
  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setBooks([]);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${searchTerm}`);
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        setBooks(data.docs);
      } else {
        setError('No books found.');
      }
    } catch (err) {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="App">
        {/* Header Section */}
        <header className="App-header">
          <h1 className="text-3xl font-bold mb-6">Book Finder</h1>

          {/* Search Input */}
          <div className="flex justify-center mb-4">
            <input
                type="text"
                placeholder="Search for a book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-l-md w-2/3"
            />
            <button
                onClick={handleSearch}
                className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              Search
            </button>
          </div>

          {/* Loading Spinner */}
          {loading && <p className="text-center text-gray-500">Loading...</p>}

          {/* Error Message */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Book Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => {
              const coverUrl = book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                  : 'https://via.placeholder.com/128x192?text=No+Cover';

              return (
                  <div key={book.key} className="border p-4 rounded-lg shadow-lg">
                    <img
                        src={coverUrl}
                        alt={book.title}
                        className="w-full h-auto rounded-md mb-4"
                    />
                    <h2 className="text-xl font-semibold">{book.title}</h2>
                    <p className="text-gray-600">{book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
                    <p className="text-sm text-gray-500">{book.first_publish_year || 'Unknown Year'}</p>
                    <p className="text-sm text-gray-500">Publisher: {book.publisher ? book.publisher.join(', ') : 'Unknown Publisher'}</p>
                  </div>
              );
            })}
          </div>
        </header>
      </div>
  );
}

export default App;
