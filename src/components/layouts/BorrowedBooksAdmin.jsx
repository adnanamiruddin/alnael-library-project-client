import loansApi from "@/api/modules/loans.api";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MdReadMore } from "react-icons/md";
import LoanDetailModal from "./modals/LoanDetailModal";

export default function BorrowedBooksAdmin() {
  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  useEffect(() => {
    const fetchBorrowedBooksData = async () => {
      const { response, error } = await loansApi.getLoans();
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

  const handleDetailLoanClick = (id) => {
    setSelectedLoanId(id);
    document.getElementById("loan_detail_modal").showModal();
  };

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <div className="md:mx-16 md:mt-2">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold leading-snug">
              Daftar Peminjaman Buku
            </h1>
          </div>

          {books.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-base text-black md:text-2xl">
                    <th>No.</th>
                    <th>Kode Buku</th>
                    <th>Id Peminjaman</th>
                    <th>Nama Peminjam</th>
                    <th>Sampul</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Detail Peminjaman</th>
                  </tr>
                </thead>

                <tbody>
                  {books
                    .sort((a, b) => b.id - a.id)
                    .map((book, index) => (
                      <tr
                        key={book.id}
                        className="text-base text-black md:text-lg"
                      >
                        <td>{index + 1}.</td>
                        <td>{book.book_code}</td>
                        <td>
                          <p className="ms-2">{book.id}</p>
                        </td>
                        <td>{book.user_name}</td>
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
                          <button
                            onClick={() => {
                              handleDetailLoanClick(book.id);
                            }}
                            className="text-sm flex items-center bg-amber-500 border-2 border-amber-300 font-semibold text-white px-3 py-2 rounded-md hover:bg-amber-400 hover:border-amber-200 focus:bg-amber-600"
                          >
                            <MdReadMore className="mr-2 text-2xl" />
                            Lihat
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>

                <tfoot>
                  <tr className="md:text-base">
                    <th>No.</th>
                    <th>Kode Buku</th>
                    <th>Id Peminjaman</th>
                    <th>Nama Peminjam</th>
                    <th>Sampul</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Detail Peminjaman</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : null}

          <LoanDetailModal loanId={selectedLoanId} />
        </div>
      ) : (
        <GlobalLoading />
      )}
    </ProtectedPage>
  );
}
