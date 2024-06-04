import { useEffect, useRef } from "react";
import {
  selectNotLoggedInModal,
  setNotLoggedInModalOpen,
} from "@/redux/features/notLoggedInModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function NotLoggedInModal() {
  const dispatch = useDispatch();
  const { notLoggedInModalOpen } = useSelector(selectNotLoggedInModal);

  const router = useRouter();

  useEffect(() => {
    const dialog = document.getElementById("not_logged_in_modal");
    if (notLoggedInModalOpen) dialog.showModal();
    else dialog.close();
  }, [notLoggedInModalOpen]);

  const handleLoginButtonClicked = () => {
    dispatch(setNotLoggedInModalOpen(false));
    router.push("/login");
  };

  return (
    <dialog id="not_logged_in_modal" className="modal">
      <div className="modal-box bg-white">
        <h1 className="shine">Alnael Library</h1>

        <h4 className="mt-4 mb-6 text-lg text-black">
          Untuk mengakses fitur ini, silahkan login terlebih dahulu
        </h4>

        <div className="modal-action mt-8">
          <button
            onClick={handleLoginButtonClicked}
            className="text-white font-bold text-base shadow-lg border-2 rounded-md py-2 px-4 bg-amber-600 border-amber-300 hover:bg-amber-500 hover:border-amber-100 hover:shadow-2xl hover:drop-shadow-2xl"
          >
            Klik di Sini Untuk Login
          </button>
        </div>
      </div>

      <form
        method="dialog"
        onClick={() => dispatch(setNotLoggedInModalOpen(false))}
        className="modal-backdrop"
      >
        <button>close</button>
      </form>
    </dialog>
  );
}
