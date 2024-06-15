import booksApi from "@/api/modules/books.api";
import favoritesApi from "@/api/modules/favorites.api";
import loansApi from "@/api/modules/loans.api";
import reviewsApi from "@/api/modules/reviews.api";
import TextArea from "@/components/functions/TextArea";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import BorrowBookModal from "@/components/layouts/modals/BorrowBookModal";
import ConfirmDeleteItemModal from "@/components/layouts/modals/ConfirmDeleteItemModal";
import TextAvatar from "@/components/utils/TextAvatar";
import { setNotLoggedInModalOpen } from "@/redux/features/notLoggedInModalSlice";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FaRegPaperPlane, FaRegTrashAlt } from "react-icons/fa";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BookDetail() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  const router = useRouter();
  const { id } = router.query;

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOnRequest, setIsOnRequest] = useState(false);

  const [book, setBook] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isOnLoan, setIsOnLoan] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [selectedreviewIdToDelete, setSelectedReviewIdToDelete] =
    useState(null);
  const [onDeleteProcess, setOnDeleteProcess] = useState(false);

  // Fetch book data by id
  useEffect(() => {
    const fetchBookData = async () => {
      const { response, error } = await booksApi.getBookById({ id });
      if (response) {
        setBook(response.data);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data buku");
    };
    if (id) fetchBookData();
  }, [id]);

  // Check if book is favorite
  useEffect(() => {
    const checkIsFavorite = async () => {
      const { response, error } = await favoritesApi.isFavorite({
        book_id: id,
      });
      if (response) {
        setIsFavorite(true);
        setFavoriteId(response.data.id);
      }
      if (error) setIsFavorite(false);
    };
    if (user) checkIsFavorite();
  }, [id, user, isFavorite]);

  // Fetch reviews by book id
  useEffect(() => {
    const fetchreviews = async () => {
      const { response, error } = await reviewsApi.getReviewsByBookId({
        book_id: id,
      });
      if (response) setReviews(response.data);
      if (error) toast.error("Gagal mengambil data komentar");
    };
    if (id) fetchreviews();
  }, [id]);

  // Check if not logged in, then set isOnLoan to false
  useEffect(() => {
    if (!user) setIsOnLoan(false);
  }, [user]);

  // Check if book is on loan
  useEffect(() => {
    const checkIsOnLoan = async () => {
      const { response, error } = await loansApi.isBookOnLoan({ book_id: id });
      if (response) setIsOnLoan(true);
      if (error) setIsOnLoan(false);
    };
    if (id) checkIsOnLoan();
  }, [id]);

  const absoluteDivRef = useRef(null);
  const bottomDivRef = useRef(null);
  const [absoluteDivHeight, setAbsoluteDivHeight] = useState(0);
  useEffect(() => {
    const updateDivHeight = () => {
      if (absoluteDivRef.current) {
        setAbsoluteDivHeight(absoluteDivRef.current.clientHeight);
      }
    };
    updateDivHeight();
    if (isDataLoaded) {
      const timeoutId = setTimeout(updateDivHeight, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [book, reviews, isDataLoaded]);
  useEffect(() => {
    if (isDataLoaded && bottomDivRef.current) {
      bottomDivRef.current.style.height = `${absoluteDivHeight}px`;
    }
  }, [absoluteDivHeight, isDataLoaded]);

  const absoluteDivRefDesktop = useRef(null);
  const bottomDivRefDesktop = useRef(null);
  const [absoluteDivHeightDesktop, setAbsoluteDivHeightDesktop] = useState(0);
  useEffect(() => {
    const updateDivHeight = () => {
      if (absoluteDivRefDesktop.current) {
        setAbsoluteDivHeightDesktop(absoluteDivRefDesktop.current.clientHeight);
      }
    };
    updateDivHeight();
    if (isDataLoaded) {
      const timeoutId = setTimeout(updateDivHeight, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [book, reviews, isDataLoaded]);
  useEffect(() => {
    if (isDataLoaded && bottomDivRefDesktop.current) {
      bottomDivRefDesktop.current.style.height = `${absoluteDivHeightDesktop}px`;
    }
  }, [absoluteDivHeightDesktop, isDataLoaded]);

  const handleAddToFavoriteIconClicked = async () => {
    if (!user) {
      dispatch(setNotLoggedInModalOpen(true));
      return;
    }
    if (isFavorite) {
      const { response, error } = await favoritesApi.deleteFavorite({
        favorite_id: favoriteId,
      });
      if (response) {
        setIsFavorite(false);
        toast.success("Buku berhasil dihapus dari favorit");
      }
      if (error) toast.error("Gagal menghapus buku dari favorit");
    } else {
      const { response, error } = await favoritesApi.addFavorite({
        book_id: id,
      });
      if (response) {
        setIsFavorite(true);
        toast.success("Buku berhasil ditambahkan ke favorit");
      }
      if (error) toast.error("Gagal menambahkan buku ke favorit");
    }
  };

  const handlePostNewReview = async () => {
    if (isOnRequest) return;
    if (!newReview) {
      toast.error(
        "Komentar tidak boleh kosong. Silahkan mengisi komentar terlebih dahulu ^_^"
      );
      return;
    }

    setIsOnRequest(true);
    const { response, error } = await reviewsApi.addReview({
      book_id: id,
      review_comment: newReview,
    });
    if (response) {
      toast.success("Komentar berhasil ditambahkan");
      setNewReview("");
      reviewsApi.getReviewsByBookId({ book_id: id }).then(({ response }) => {
        if (response) setReviews(response.data);
      });
    }
    if (error) toast.error("Gagal menambahkan komentar");
    setIsOnRequest(false);
  };

  const handleDeleteReviewIconClicked = (bookId) => {
    setSelectedReviewIdToDelete(bookId);
    document.getElementById("confirm_delete_item_modal").showModal();
  };

  const handleDeleteReview = async () => {
    if (onDeleteProcess || !selectedreviewIdToDelete) return;

    setOnDeleteProcess(true);
    const { response, error } = await reviewsApi.deleteReview({
      review_id: selectedreviewIdToDelete,
    });
    if (response) {
      toast.success("Komentar berhasil dihapus");
      setReviews(
        reviews.filter((review) => review.id !== selectedreviewIdToDelete)
      );
      setOnDeleteProcess(false);
      document.getElementById("confirm_delete_item_modal").close();
    }
    if (error) {
      toast.error("Gagal menghapus komentar");
      setOnDeleteProcess(false);
    }
  };

  const handleBorrowBookButtonClicked = () => {
    if (user?.count_of_books_borrowed >= 3 || book.stock <= 0) return;
    if (!user) {
      dispatch(setNotLoggedInModalOpen(true));
      return;
    }
    if (isOnLoan) return;
    document.getElementById("borrow_book_modal").showModal();
  };

  return book && isDataLoaded ? (
    <>
      {/* Mobile View START */}
      <div className="md:hidden -mt-8 -mx-6">
        <Image
          src={"/perpustakaan1.jpg"}
          alt={book.title}
          width={1920}
          height={1080}
          className="absolute max-h-screen object-cover overflow-x-hidden"
        />

        <div
          ref={absoluteDivRef}
          className="absolute bg-gradient-to-t from-white from-55% to-transparent min-h-screen w-full pt-28"
        >
          <div className="flex flex-col items-center w-full gap-8">
            <Image
              src={book.image_url}
              alt={book.title}
              width={500}
              height={500}
              className="rounded-lg shadow-lg w-1/2 h-full object-cover"
            />

            <div className="flex flex-col gap-6 px-4">
              <h1 className="font-bold text-3xl leading-tight text-center">
                {book.title}
              </h1>

              <div className="flex justify-center items-center flex-wrap gap-2">
                {book.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-amber-500 text-white font-medium px-4 py-1 rounded-md text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-center">
                {book.author}
              </h3>

              <p className="text-lg text-justify">{book.description}</p>

              <div className="bg-gray-50 w-max py-4 ps-6 pe-10 rounded-lg border-[0.5px] border-gray-400 shadow-lg flex flex-col gap-4 hover:shadow-2xl hover:drop-shadow-2xl hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Penerbit:</span>
                  <span>{book.publisher}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Tahun Terbit:</span>
                  <span>{book.publication_year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">ISBN:</span>
                  <span>{book.isbn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Stok:</span>
                  <span>Tersisa {book.stock}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleBorrowBookButtonClicked}
                  className={`btn text-white font-bold text-base shadow-lg border-2 py-2 px-4 bg-amber-600 border-amber-300 hover:bg-amber-500 hover:border-amber-100 hover:shadow-2xl hover:drop-shadow-2xl ${
                    user?.count_of_books_borrowed >= 3 ||
                    isOnLoan ||
                    book.stock <= 0
                      ? "brightness-75 cursor-not-allowed"
                      : ""
                  } ${user?.role === "admin" ? "hidden" : ""}`}
                >
                  {user?.count_of_books_borrowed >= 3
                    ? "Tidak Dapat Meminjam Lebih Dari 3 Buku"
                    : isOnLoan
                    ? "Buku Sedang Dipinjam"
                    : book.stock <= 0
                    ? "Stok Buku Habis"
                    : "Pinjam Buku Ini"}
                </button>
                {isFavorite ? (
                  <MdFavorite
                    onClick={handleAddToFavoriteIconClicked}
                    className="text-red-600 text-3xl cursor-pointer"
                  />
                ) : (
                  <MdFavoriteBorder
                    onClick={handleAddToFavoriteIconClicked}
                    className="text-red-600 text-3xl cursor-pointer"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen" ref={bottomDivRef}></div>

        <div className="py-12 px-4">
          <h2 className="font-bold text-4xl">Komentar</h2>

          <div className="mt-6 flex flex-col gap-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="flex items-start gap-4">
                  <TextAvatar
                    firstName={review.first_name}
                    lastName={review.last_name}
                  />

                  <div className="w-full">
                    <p className="text-xl font-medium">
                      {review.first_name + " " + review.last_name}
                    </p>
                    <p className="mt-2 text-xs">{review.created_at}</p>
                    <p className="mt-4 text-base text-justify">
                      {review.review_comment}
                    </p>
                    {user?.id === review.user_id ? (
                      <button
                        onClick={() => {
                          handleDeleteReviewIconClicked(review.id);
                        }}
                        className="mt-4 rounded-md flex justify-center items-center gap-1 px-3 py-2 text-white font-bold text-sm shadow-lg border-2 bg-red-600 border-red-300 hover:bg-red-500 hover:border-red-100 hover:shadow-2xl hover:drop-shadow-2xl"
                      >
                        <FaRegTrashAlt className="text-white text-lg me-1" />
                        Hapus
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="ms-1">Belum ada komentar</p>
            )}
          </div>

          {user ? (
            <div className="mt-8">
              <div className="border-t border-gray-300 pt-3 flex items-start gap-3 w-full">
                <TextAvatar
                  firstName={user.first_name}
                  lastName={user.last_name}
                />

                <div className="w-full">
                  <p className="text-xl font-medium mt-1">
                    {user.first_name + " " + user.last_name}
                  </p>
                  <TextArea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Tulis komentar disini..."
                    rows={3}
                  />
                  <button
                    disabled={isOnRequest}
                    onClick={handlePostNewReview}
                    className={`mt-3 p-2.5 flex items-center gap-2 rounded-md bg-amber-500 border-0 text-white font-semibold text-lg ${
                      isOnRequest ? "brightness-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {!isOnRequest ? (
                      <>
                        <FaRegPaperPlane className="me-1" />
                        Tambah
                      </>
                    ) : (
                      <span className="loading loading-bars loading-md mx-8"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* Mobile View END */}

      {/* Tab - Desktop View START */}
      <div className="hidden md:inline-block -mt-6 -mx-6 w-full">
        <Image
          src={"/perpustakaan1.jpg"}
          alt={book.title}
          width={1920}
          height={1080}
          className="absolute max-h-screen object-cover overflow-x-hidden"
        />
        <div
          ref={absoluteDivRefDesktop}
          className="absolute bg-gradient-to-t from-white from-55% to-transparent min-h-screen w-full flex items-center pt-32"
        >
          <div className="flex justify-center items-start w-full gap-16">
            <Image
              src={book.image_url}
              alt={book.title}
              width={500}
              height={500}
              className="rounded-lg shadow-lg w-1/4 h-full object-cover"
            />

            <div className="w-[55%] flex flex-col gap-6">
              <h1 className="font-bold text-6xl leading-tight">{book.title}</h1>

              <div className="flex items-center flex-wrap gap-2">
                {book.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-amber-500 text-white font-medium px-4 py-1 rounded-md"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              <h3 className="text-3xl font-semibold">{book.author}</h3>

              <p className="text-lg text-justify">{book.description}</p>

              <div className="mt-3 flex justify-between items-start flex-wrap">
                <div className="flex items-center gap-4">
                  {isFavorite ? (
                    <MdFavorite
                      onClick={handleAddToFavoriteIconClicked}
                      className="text-red-600 text-3xl cursor-pointer"
                    />
                  ) : (
                    <MdFavoriteBorder
                      onClick={handleAddToFavoriteIconClicked}
                      className="text-red-600 text-3xl cursor-pointer"
                    />
                  )}
                  <button
                    onClick={handleBorrowBookButtonClicked}
                    className={`btn text-white font-bold text-base shadow-lg border-2 py-2 px-4 bg-amber-600 border-amber-300 hover:bg-amber-500 hover:border-amber-100 hover:shadow-2xl hover:drop-shadow-2xl ${
                      user?.count_of_books_borrowed >= 3 ||
                      isOnLoan ||
                      book.stock <= 0
                        ? "brightness-75 cursor-not-allowed"
                        : ""
                    } ${user?.role === "admin" ? "hidden" : ""}`}
                  >
                    {user?.count_of_books_borrowed >= 3
                      ? "Tidak Dapat Meminjam Lebih Dari 3 Buku"
                      : isOnLoan
                      ? "Buku Sedang Dipinjam"
                      : book.stock <= 0
                      ? "Stok Buku Habis"
                      : "Pinjam Buku Ini"}
                  </button>
                </div>

                <div className="bg-gray-50 w-max py-4 ps-6 pe-10 rounded-lg border-[0.5px] border-gray-400 shadow-lg flex flex-col gap-4 hover:shadow-2xl hover:drop-shadow-2xl hover:bg-white transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Penerbit:</span>
                    <span>{book.publisher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Tahun Terbit:</span>
                    <span>{book.publication_year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">ISBN:</span>
                    <span>{book.isbn}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Stok:</span>
                    <span>Tersisa {book.stock}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen" ref={bottomDivRefDesktop}></div>

        <div className="py-12 px-32">
          <h2 className="font-bold text-4xl">Komentar</h2>

          <div className="mt-6 flex flex-col gap-6 mb-4 px-2">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="flex items-start gap-4">
                  <TextAvatar
                    firstName={review.first_name}
                    lastName={review.last_name}
                  />

                  <div className="w-full relative">
                    {user?.id === review.user_id ? (
                      <button
                        onClick={() => {
                          handleDeleteReviewIconClicked(review.id);
                        }}
                        className="absolute right-0 top-0 btn text-white font-bold text-sm shadow-lg border-2 py-2 px-4 bg-red-600 border-red-300 hover:bg-red-500 hover:border-red-100 hover:shadow-2xl hover:drop-shadow-2xl"
                      >
                        <FaRegTrashAlt className="text-white text-lg me-1" />
                        Hapus
                      </button>
                    ) : null}
                    <p className="text-xl font-medium">
                      {review.first_name + " " + review.last_name}
                    </p>
                    <p className="mt-2 text-xs">{review.created_at}</p>
                    <p className="mt-4 text-base text-justify">
                      {review.review_comment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Belum ada komentar</p>
            )}
          </div>

          {user ? (
            <div className="mt-8 flex justify-center items-center px-2">
              <div className="border-t border-gray-300 pt-3 flex items-start gap-3 w-full">
                <TextAvatar
                  firstName={user.first_name}
                  lastName={user.last_name}
                />

                <div className="w-full">
                  <p className="text-lg font-medium">
                    {user.first_name + " " + user.last_name}
                  </p>
                  <TextArea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Tulis komentar disini..."
                    rows={4}
                  />
                  <button
                    disabled={isOnRequest}
                    onClick={handlePostNewReview}
                    className={`mt-3 p-2.5 flex items-center gap-2 rounded-md bg-amber-500 border-0 text-white font-semibold text-lg ${
                      isOnRequest ? "brightness-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {!isOnRequest ? (
                      <>
                        <FaRegPaperPlane className="me-1" />
                        Tambah
                      </>
                    ) : (
                      <span className="loading loading-bars loading-md mx-8"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* Tab - Desktop View END */}

      <ConfirmDeleteItemModal
        handleDelete={handleDeleteReview}
        onDeleteProcess={onDeleteProcess}
        content="komentar"
      />
      <BorrowBookModal book={book} />
    </>
  ) : (
    <GlobalLoading />
  );
}
