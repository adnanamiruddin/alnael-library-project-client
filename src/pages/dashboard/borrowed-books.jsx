import { selectUser } from "@/redux/features/userSlice";
import { useSelector } from "react-redux";
import BorrowedBooksAdmin from "@/components/layouts/BorrowedBooksAdmin";
import BorrowedBooksUser from "@/components/layouts/BorrowedBooksUser";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function BorrowedBooks() {
  const { user } = useSelector(selectUser);

  // const router = useRouter();

  // useEffect(() => {
  //   if (!user) router.push("/");
  // }, [user]);

  return user?.role === "admin" ? (
    <BorrowedBooksAdmin />
  ) : (
    <BorrowedBooksUser />
  );
}
