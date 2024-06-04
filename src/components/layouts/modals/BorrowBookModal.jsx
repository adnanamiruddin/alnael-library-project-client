import booksApi from "@/api/modules/books.api";
import loansApi from "@/api/modules/loans.api";
import { selectUser } from "@/redux/features/userSlice";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BorrowBookModal({ book }) {
  const { user } = useSelector(selectUser);
  const router = useRouter();

  const [isOnRequest, setIsOnRequest] = useState(false);
  const [bookItems, setBookItems] = useState([]);
  const [selectedBookItemCode, setSelectedBookItemCode] = useState(null);

  useEffect(() => {
    const fetchBookItems = async () => {
      setIsOnRequest(true);
      const { response, error } = await booksApi.getBookItemsByBookId({
        id: book.id,
      });
      if (response) {
        setBookItems(response.data);
      }
      if (error) toast.error("Gagal mengambil data buku");
      setIsOnRequest(false);
    };
    if (user && book.id) fetchBookItems();
  }, [user, book.id]);

  const handleBookItemsSelectedChange = (e) => {
    setSelectedBookItemCode(e.target.value);
  };

  const handleBorrowBookSubmit = async () => {
    if (isOnRequest || !selectedBookItemCode) return;

    setIsOnRequest(true);
    const { response, error } = await loansApi.borrowBook({
      book_id: book.id,
      book_code: selectedBookItemCode,
    });
    if (response) {
      toast.success("Berhasil meminjam buku");
      document.getElementById("borrow_book_modal").close();
      setTimeout(() => {
        router.reload();
        setIsOnRequest(false);
      }, 3000);
    }
    if (error) {
      toast.error("Gagal meminjam buku");
      setIsOnRequest(false);
    }
  };

  return (
    <dialog id="borrow_book_modal" className="modal">
      <div className="modal-box bg-gray-100">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl">Konfirmasi Buku</h3>

        <div className="bg-gray-50 py-4 ps-4 pe-8 mt-5 rounded-lg border-[0.5px] border-gray-400 shadow-lg flex flex-col gap-4 hover:shadow-2xl hover:drop-shadow-2xl hover:bg-white transition-all duration-300">
          <div className="flex flex-col gap-1">
            <span className="font-bold">Judul:</span>
            <span>{book.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">ISBN:</span>
            <span>{book.isbn}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Penulis:</span>
            <span>{book.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Penerbit:</span>
            <span>{book.publisher}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">Stok:</span>
            <span>Tersisa {book.stock}</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="label">
            <span className="label-text text-black text-lg">Kode Buku</span>
          </label>
          <select
            disabled={isOnRequest}
            onChange={handleBookItemsSelectedChange}
            className="select select-warning w-full bg-gray-50"
          >
            <option disabled selected>
              Pilih Kode Buku
            </option>
            {bookItems.map((bookItem) => (
              <option
                key={bookItem.id}
                value={bookItem.book_code}
                disabled={bookItem.status === "borrowed"}
              >
                {bookItem.book_code}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleBorrowBookSubmit}
          className={`mt-5 btn bg-amber-500 w-full border-0 text-white text-lg hover:bg-amber-700 ${
            isOnRequest ? "brightness-75" : ""
          }`}
        >
          {isOnRequest ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            "Pinjam Buku"
          )}
        </button>
      </div>
    </dialog>
  );
}
