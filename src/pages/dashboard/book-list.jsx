import booksApi from "@/api/modules/books.api";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import AddBookModal from "@/components/layouts/modals/AddBookModal";
import ConfirmDeleteItemModal from "@/components/layouts/modals/ConfirmDeleteItemModal";
import EditBookModal from "@/components/layouts/modals/EditBookModal";
import AdminPage from "@/components/utils/AdminPage";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BookList() {
  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [onDeleteProcess, setOnDeleteProcess] = useState(false);

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
    if (user) fetchBooksData();
  }, [user]);

  const handleAddBookButtonClicked = () => {
    document.getElementById("add_book_modal").showModal();
  };

  const handleEditBookButtonClicked = (bookId) => {
    setSelectedBookId(bookId);
    document.getElementById("edit_book_modal").showModal();
  };

  const handleDeleteBookIconClicked = (bookId) => {
    setSelectedBookId(bookId);
    document.getElementById("confirm_delete_item_modal").showModal();
  };

  const handleDeleteBook = async () => {
    if (onDeleteProcess || !selectedBookId) return;

    setOnDeleteProcess(true);
    const { response, error } = await booksApi.deleteBook({
      id: selectedBookId,
    });
    if (response) {
      setBooks(books.filter((book) => book.id !== selectedBookId));
      toast.success("Berhasil menghapus buku");
      setOnDeleteProcess(false);
      document.getElementById("confirm_delete_item_modal").close();
    }
    if (error) {
      toast.error(error.message);
      setOnDeleteProcess(false);
      document.getElementById("confirm_delete_item_modal").close();
    }
  };

  return (
    <ProtectedPage>
      <AdminPage>
        {isDataLoaded ? (
          <div className="md:mx-16 md:mt-2">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold">Daftar Buku</h1>

              <button
                onClick={handleAddBookButtonClicked}
                className="text-sm flex items-center bg-amber-500 border-2 border-amber-300 font-semibold text-white px-3 py-2 rounded-md hover:bg-amber-400 hover:border-amber-200 focus:bg-amber-600"
              >
                <IoIosAddCircleOutline className="mr-2 text-2xl" />
                Tambah Buku
              </button>
            </div>

            {books.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="text-base text-black md:text-2xl">
                      <th>No.</th>
                      <th>Sampul</th>
                      <th>Judul</th>
                      <th>Penulis</th>
                      <th>Penerbit</th>
                      <th>Tahun Terbit</th>
                      <th>ISBN</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {books.map((book, index) => (
                      <tr
                        key={book.id}
                        className="text-base text-black md:text-lg"
                      >
                        <td>{index + 1}.</td>
                        <td>
                          <Image
                            width={100}
                            height={100}
                            src={book.image_url}
                            alt={book.title}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher}</td>
                        <td>{book.publication_year}</td>
                        <td>{book.isbn}</td>
                        <td>
                          <button
                            onClick={() => handleEditBookButtonClicked(book.id)}
                            className="btn text-xl btn-circle btn-ghost"
                          >
                            <FaRegEdit className="text-blue-600 text-2xl" />
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteBookIconClicked(book.id);
                            }}
                            className="btn text-xl btn-circle btn-ghost"
                          >
                            <FaRegTrashAlt className="text-red-600 text-2xl" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="md:text-base">
                      <th>No.</th>
                      <th>Sampul</th>
                      <th>Judul</th>
                      <th>Penulis</th>
                      <th>Penerbit</th>
                      <th>Tahun Terbit</th>
                      <th>ISBN</th>
                      <th>Aksi</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : null}

            <AddBookModal />
            <EditBookModal bookId={selectedBookId} />
            <ConfirmDeleteItemModal
              handleDelete={handleDeleteBook}
              onDeleteProcess={onDeleteProcess}
              content="buku"
            />
          </div>
        ) : (
          <GlobalLoading />
        )}
      </AdminPage>
    </ProtectedPage>
  );
}
