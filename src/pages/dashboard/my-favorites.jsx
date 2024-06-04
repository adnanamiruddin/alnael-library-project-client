import favoritesApi from "@/api/modules/favorites.api";
import BookItem from "@/components/layouts/BookItem";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import HomeButton from "@/components/layouts/HomeButton";
import NotFound from "@/components/layouts/NotFound";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function MyFavorites() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooksData = async () => {
      const { response, error } = await favoritesApi.getUserFavorites();
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
      <h1 className="text-3xl font-bold">Buku Favorit Saya</h1>

      {books.length > 0 ? (
        <div className="mt-6 pb-4 flex flex-wrap gap-4">
          {books.map((book) => (
            <BookItem key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col">
          <NotFound />

          <p className="mt-6 text-center font-bold text-xl md:text-2xl">
            Kamu belum pernah menambahkan buku ke daftar favorit
          </p>

          <HomeButton href="/books">
            Yuk lihat buku dan berikan komentar
          </HomeButton>
        </div>
      )}
    </div>
  ) : (
    <GlobalLoading />
  );
}
