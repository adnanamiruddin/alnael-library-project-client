import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";
import { useRouter } from "next/router";

export default function AdminPage({ children }) {
  const router = useRouter();
  const { user } = useSelector(selectUser);

  useEffect(() => {
    if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  return user ? children : null;
}
