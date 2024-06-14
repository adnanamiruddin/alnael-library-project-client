import { selectUser } from "@/redux/features/userSlice";
import { useSelector } from "react-redux";
import BorrowedBooksAdmin from "@/components/layouts/BorrowedBooksAdmin";
import BorrowedBooksUser from "@/components/layouts/BorrowedBooksUser";

export default function BorrowedBooks() {
  const { user } = useSelector(selectUser);

  return user?.role === "admin" ? (
    <BorrowedBooksAdmin />
  ) : (
    <BorrowedBooksUser />
  );
}
