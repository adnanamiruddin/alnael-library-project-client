import reviewsApi from "@/api/modules/reviews.api";
import ConfirmDeleteItemModal from "@/components/layouts/modals/ConfirmDeleteItemModal";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import HomeButton from "@/components/layouts/HomeButton";
import NotFound from "@/components/layouts/NotFound";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function MyReviews() {
  const router = useRouter();

  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOnRequest, setIsOnRequest] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedReviewIdToDelete, setSelectedReviewIdToDelete] =
    useState(null);

  useEffect(() => {
    const fetchUserReviews = async () => {
      const { response, error } = await reviewsApi.getUserReviews();
      if (response) {
        setReviews(response.data);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data komentar");
    };
    if (user) fetchUserReviews();
  }, [user]);

  const handleDeleteReviewIconClicked = (reviewId) => {
    setSelectedReviewIdToDelete(reviewId);
    document.getElementById("confirm_delete_item_modal").showModal();
  };

  const handleDeleteReview = async () => {
    if (isOnRequest) return;

    setIsOnRequest(true);
    const { response, error } = await reviewsApi.deleteReview({
      review_id: selectedReviewIdToDelete,
    });
    if (response) {
      toast.success("Komentar berhasil dihapus");
      setReviews(
        reviews.filter((review) => review.id !== selectedReviewIdToDelete)
      );
      document.getElementById("confirm_delete_item_modal").close();
    }
    if (error) toast.error("Gagal menghapus komentar");

    setIsOnRequest(false);
  };

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <div className="md:mx-16 md:mt-2">
          <h1 className="text-3xl font-bold mt-1">Komentar Saya</h1>

          {reviews.length > 0 ? (
            <div className="flex flex-col gap-6 mt-6 md:flex-row">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white shadow-lg border-2 rounded-md p-4 md:w-[32%]"
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={review.image_url}
                      alt="Gambar Blog"
                      width={100}
                      height={100}
                      className="w-1/4 object-contain"
                      onClick={() => {
                        router.push(`/blogs/${review.id}`);
                      }}
                    />

                    <div className="w-full relative">
                      <button
                        onClick={() => handleDeleteReviewIconClicked(review.id)}
                        className="absolute right-0 top-0"
                      >
                        <FaRegTrashAlt className="text-red-600 text-lg" />
                      </button>
                      <Link href={`/books/${review.book_id}`}>
                        <p className="text-xl font-semibold">
                          {review.review_comment}
                        </p>
                        <p className="text-xs">{review.created_at}</p>
                        <p className="mt-3 text-sm text-justify">
                          {review.text}
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <NotFound />

              <p className="mt-6 text-center font-bold text-xl md:text-2xl">
                Kamu belum pernah memberikan komentar pada Alnael Library
              </p>

              <HomeButton href="/books">
                Yuk lihat buku dan berikan komentar
              </HomeButton>
            </div>
          )}

          <ConfirmDeleteItemModal
            handleDelete={handleDeleteReview}
            onDeleteProcess={isOnRequest}
            type="komentar"
          />
        </div>
      ) : (
        <GlobalLoading />
      )}
    </ProtectedPage>
  );
}
