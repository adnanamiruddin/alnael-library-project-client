import booksApi from "@/api/modules/books.api";
import BookCategories from "@/components/layouts/BookCategories";
import BookItem from "@/components/layouts/BookItem";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import NotFound from "@/components/layouts/NotFound";
import SearchBar from "@/components/layouts/SearchBar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Books() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [books, setBooks] = useState([]);

  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    const fetchBooksData = async () => {
      const { response, error } = await booksApi.getBooks();
      if (response) {
        setBooks(response.data);
        setFilteredBooks(response.data);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data buku");
    };
    fetchBooksData();
  }, []);

  useEffect(() => {
    const filterBooks = () => {
      let filtered = books;

      if (searchQuery !== "") {
        filtered = filtered.filter((book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory !== "Semua") {
        filtered = filtered.filter((book) =>
          book.categories.includes(selectedCategory)
        );
      }

      setFilteredBooks(filtered);
    };
    filterBooks();
  }, [searchQuery, selectedCategory, books]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return isDataLoaded ? (
    <div className="md:mx-16 md:mt-2">
      <h1 className="text-3xl font-bold">Daftar Buku</h1>

      <div className="mt-4 w-full flex justify-between flex-col-reverse gap-6">
        <BookCategories
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <div className="mt-6 pb-4 flex flex-wrap gap-4 md:mt-8">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => <BookItem key={book.id} book={book} />)
        ) : (
          <div className="mx-auto -mt-8">
            <NotFound />
          </div>
        )}
      </div>
    </div>
  ) : (
    <GlobalLoading />
  );
}
