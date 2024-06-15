import loansApi from "@/api/modules/loans.api";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MdReadMore } from "react-icons/md";
import Link from "next/link";

export default function BorrowedBooksUser() {
  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBorrowedBooksData = async () => {
      const { response, error } = await loansApi.getUserLoans();
      if (response) {
        setBooks(response.data);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data buku");
    };
    if (user) fetchBorrowedBooksData();
  }, [user]);

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <div className="md:mx-16 md:mt-2">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold leading-snug">
              Riwayat Peminjaman Buku
            </h1>
          </div>

          {books.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-base text-black md:text-2xl">
                    <th>No.</th>
                    <th>Kode Buku</th>
                    <th>Id</th>
                    <th>Sampul</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Detail Buku</th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book, index) => (
                    <tr
                      key={book.id}
                      className="text-base text-black md:text-lg"
                    >
                      <td>{index + 1}.</td>
                      <td>{book.book_code}</td>
                      <td>{book.book_id}</td>
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
                      <td>
                        <p
                          className={`badge capitalize text-white p-3 rounded-md border-0 ${
                            book.status === "borrowed"
                              ? "bg-blue-600"
                              : "bg-red-600"
                          }`}
                        >
                          {book.status === "borrowed"
                            ? "Dipinjam"
                            : "Dikembalikan"}
                        </p>
                      </td>
                      <td>
                        <button className="text-sm flex items-center bg-amber-500 border-2 border-amber-300 font-semibold text-white px-3 py-2 rounded-md hover:bg-amber-400 hover:border-amber-200 focus:bg-amber-600">
                          <Link
                            href={`/books/${book.book_id}`}
                            className="flex items-center"
                          >
                            <MdReadMore className="mr-2 text-2xl" />
                            Lihat
                          </Link>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="md:text-base">
                    <th>No.</th>
                    <th>Kode Buku</th>
                    <th>Id</th>
                    <th>Sampul</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Detail Buku</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : null}
        </div>
      ) : (
        <GlobalLoading />
      )}
    </ProtectedPage>
  );
}
