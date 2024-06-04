import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import usersApi from "@/api/modules/users.api";
import Navbar from "./layouts/Navbar";
import { selectUser, setUser } from "@/redux/features/userSlice";
import { ToastContainer, toast } from "react-toastify";
import Footer from "@/components/layouts/Footer";
import Carousel from "./layouts/Carousel";
import NotLoggedInModal from "./layouts/modals/NotLoggedInModal";

import "react-toastify/dist/ReactToastify.css";

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isCarouselPassed, setIsCarouselPassed] = useState(false);

  useEffect(() => {
    const authUser = async () => {
      const { response, error } = await usersApi.getProfile();
      if (response) dispatch(setUser(response.user));
      if (error) dispatch(setUser(null));
    };
    authUser();
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setIsCarouselPassed(true);
      } else {
        setIsCarouselPassed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Config React Toastify START */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        z-index="9999"
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        limit={1}
      />
      {/* Config React Toastify END */}

      <NotLoggedInModal />

      <div>
        <Navbar isCarouselPassed={isCarouselPassed} />
      </div>

      {router.asPath === "/" ? (
        <>
          <Carousel />

          <div className="bg-white text-black p-6 min-h-screen">{children}</div>
        </>
      ) : (
        <div className="bg-white text-black p-6 pt-24 min-h-screen">
          {children}
        </div>
      )}

      <Footer />
    </>
  );
}
