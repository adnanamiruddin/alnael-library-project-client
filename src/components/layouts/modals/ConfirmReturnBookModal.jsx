import loansApi from "@/api/modules/loans.api";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export default function ConfirmReturnBookModal({ loanId, bookCode }) {
  const router = useRouter();

  const [isOnRequest, setIsOnRequest] = useState(false);

  const handleConfirmReturnBook = async () => {
    if (!loanId || isOnRequest) return;

    setIsOnRequest(true);
    const dateOfReturn = new Date().toISOString();
    const { response, error } = await loansApi.returnBook({
      id: loanId,
      date_of_return: dateOfReturn,
    });
    if (response) {
      toast.success(
        "Konfirmasi pengembalian buku berhasil. Halaman akan dimuat ulang..."
      );
      document.getElementById("loan_detail_modal").close();
      document.getElementById("confirm_return_book_modal").close();
      setTimeout(() => {
        router.reload();
        setIsOnRequest(false);
      }, 3000);
    }
    if (error) {
      toast.error("Gagal mengonfirmasi pengembalian buku");
      setIsOnRequest(false);
    }
  };

  return (
    <dialog id="confirm_return_book_modal" className="modal">
      <div className="modal-box bg-white">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <IoWarningOutline className="text-center w-full text-6xl" />

        <h4 className="mt-4 text-center text-lg">
          Apakah buku dengan kode{" "}
          <span className="badge badge-accent badge-outline">{bookCode}</span>{" "}
          ini benar-benar sudah dikembalikan?
        </h4>

        <div className="mt-4 flex justify-center items-center gap-5">
          <form method="dialog" className="w-1/3">
            <button className="w-full py-2.5 text-gray-900 font-medium text-center bg-gray-100 hover:bg-gray-300 rounded-lg border border-gray-300">
              {!isOnRequest ? (
                "Tidak"
              ) : (
                <span className="loading loading-bars loading-md"></span>
              )}
            </button>
          </form>

          <button
            onClick={handleConfirmReturnBook}
            disabled={isOnRequest}
            className={`w-1/3 py-2.5 text-white font-medium text-center bg-red-600 hover:bg-red-800 rounded-lg border border-red-700 ${
              isOnRequest ? "brightness-75" : ""
            }`}
          >
            {!isOnRequest ? (
              "Ya"
            ) : (
              <span className="loading loading-bars loading-md"></span>
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
