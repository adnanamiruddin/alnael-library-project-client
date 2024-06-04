import booksApi from "@/api/modules/books.api";
import BookCategories from "@/components/layouts/BookCategories";
import BookItem from "@/components/layouts/BookItem";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import SearchBar from "@/components/layouts/SearchBar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Books() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooksData = async () => {
      const { response, error } = await booksApi.getBooks();
      if (response) {
        setBooks(response.data);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data buku");
    };
    fetchBooksData();
  }, []);

  return isDataLoaded ? (
    <div className="md:mx-16 md:mt-2">
      <h1 className="text-3xl font-bold">Daftar Buku</h1>

      <div className="mt-4 w-full flex justify-between flex-col-reverse gap-6">
        <BookCategories />
        <SearchBar />
      </div>

      <div className="mt-6 pb-4 flex flex-wrap gap-4">
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  ) : (
    <GlobalLoading />
  );
}
