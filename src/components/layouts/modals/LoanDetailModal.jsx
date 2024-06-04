import loansApi from "@/api/modules/loans.api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale/id";
import ConfirmReturnBookModal from "./ConfirmReturnBookModal";

export default function LoanDetailModal({ loanId }) {
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    const fetchLoanData = async () => {
      const { response, error } = await loansApi.getLoanById({ id: loanId });
      if (response) {
        setLoan(response.data);
      }
      if (error) toast.error("Gagal mengambil data peminjaman");
    };
    if (loanId) fetchLoanData();
  }, [loanId]);

  const handleReturnBookClick = () => {
    if (!loan) return;
    if (loan.date_of_return) {
      toast.error("Buku telah dikembalikan");
      return;
    }
    document.getElementById("confirm_return_book_modal").showModal();
  };

  return (
    <dialog id="loan_detail_modal" className="modal">
      <div className="modal-box bg-gray-100">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl">Detail Peminjaman</h3>

        {loan ? (
          <>
            <div className="bg-gray-50 py-6 ps-4 pe-8 mt-5 rounded-lg border-[0.5px] border-gray-400 shadow-lg flex flex-col gap-4 hover:shadow-2xl hover:drop-shadow-2xl hover:bg-white transition-all duration-300">
              <div className="flex flex-col gap-1">
                <span className="font-bold">Judul:</span>
                <span>{loan.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">ISBN:</span>
                <span>{loan.isbn}</span>
              </div>
              {/*  */}
              <div className="divider divider-warning -my-0.5"></div>
              {/*  */}
              <div className="flex items-center gap-2">
                <span className="font-bold">Id Peminjaman:</span>
                <span>{loan.id}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold">Kode Buku:</span>
                <span>{loan.book_code}</span>
              </div>
              {/*  */}
              <div className="divider divider-warning -my-0.5"></div>
              {/*  */}
              <div className="flex flex-col gap-1">
                <span className="font-bold">Tanggal Peminjaman:</span>
                <span>
                  {formatDate(new Date(loan.loan_date), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Status:</span>
                <span>
                  {loan.status === "borrowed" ? "Dipinjam" : "Dikembalikan"}
                </span>
              </div>
            </div>

            <button
              onClick={handleReturnBookClick}
              className={`mt-5 btn bg-amber-500 w-full border-0 text-white text-lg hover:bg-amber-700 ${
                loan.date_of_return
                  ? "btn-lg brightness-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {loan.date_of_return
                ? `Buku telah dikembalikan pada ${formatDate(
                    new Date(loan.loan_date),
                    "dd MMMM yyyy",
                    {
                      locale: id,
                    }
                  )}`
                : "Konfirmasi Pengembalian"}
            </button>

            <ConfirmReturnBookModal loanId={loanId} bookCode={loan.book_code} />
          </>
        ) : null}
      </div>
    </dialog>
  );
}
