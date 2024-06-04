import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "@/redux/features/userSlice";
import { toast } from "react-toastify";
import { IoMenu } from "react-icons/io5";
import { FaHome, FaRegAddressBook, FaBook, FaSwatchbook, FaRegCommentDots } from "react-icons/fa";
import { FaBookBookmark } from "react-icons/fa6";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { MdAccountCircle, MdFavorite } from "react-icons/md";
import { GiBookPile } from "react-icons/gi";

const generalLinks = [
  {
    href: "/",
    label: "Beranda",
    icon: <FaHome className="text-2xl me-1" />,
  },
  {
    href: "/books",
    label: "Buku",
    icon: <FaBook className="text-2xl me-1" />,
  },
];

const categoriesLinks = ["Fiksi", "Non-Fiksi", "Komik", "Novel", "Puisi"];

const notLoggedInLinks = [
  {
    href: "/login",
    label: "Login",
    icon: <FiLogIn className="text-2xl me-1" />,
  },
  {
    href: "/register",
    label: "Register",
    icon: <FaRegAddressBook className="text-2xl me-1" />,
  },
];

const userLinks = [
  {
    href: "/dashboard/profile",
    label: "Profil",
    icon: <MdAccountCircle className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/my-favorites",
    label: "Buku Favorit",
    icon: <MdFavorite className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/borrowed-books",
    label: "Buku yang Dipinjam",
    icon: <FaBookBookmark className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/my-reviews",
    label: "Komentar Saya",
    icon: <FaRegCommentDots className="text-2xl me-1" />,
  },
];

const adminLinks = [
  {
    href: "/dashboard/profile",
    label: "Profil",
    icon: <MdAccountCircle className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/my-favorites",
    label: "Buku Favorit",
    icon: <MdFavorite className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/book-list",
    label: "Daftar Buku",
    icon: <GiBookPile className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/borrowed-books",
    label: "Daftar Peminjaman",
    icon: <FaSwatchbook className="text-2xl me-1" />,
  },
];

export default function Navbar({ isCarouselPassed }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  const router = useRouter();

  const handleDrawerClose = () => {
    document.getElementById("navbar_drawer").checked = false;
  };

  const handleLogout = async () => {
    try {
      dispatch(setUser(null));
      document.getElementById("navbar_drawer").checked = false;
      toast.info("Bye bye 👋");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Mobile View START */}
      <div className="md:hidden navbar fixed z-[999] transition-all ease-in duration-300 bg-gradient-to-br from-amber-400 to-amber-700">
        <input id="navbar_drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="navbar_drawer"
            className="ms-1 flex justify-center items-center"
          >
            <IoMenu className="w-9 h-9 text-white" />
          </label>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="navbar_drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-white text-black gap-3">
            <li className="-ms-2 mb-2">
              <div class="shine">Alnael Library</div>
            </li>

            {generalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={handleDrawerClose}
                  className={`text-lg font-semibold ${
                    router.pathname === link.href ? "bg-amber-400" : ""
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="mt-auto"></li>
            {!user ? (
              <>
                {notLoggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleDrawerClose}
                      className={`text-lg font-semibold ${
                        router.pathname === link.href ? "bg-amber-400" : ""
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <>
                {user.role === "admin" ? (
                  <>
                    {adminLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={handleDrawerClose}
                          className={`text-lg font-semibold ${
                            router.pathname === link.href ? "bg-amber-400" : ""
                          }`}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </>
                ) : (
                  <>
                    {userLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={handleDrawerClose}
                          className={`text-lg font-semibold ${
                            router.pathname === link.href ? "bg-amber-400" : ""
                          }`}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </>
                )}
                <li className="mt-4">
                  <button
                    onClick={handleLogout}
                    className="text-lg font-semibold bg-red-600 text-white"
                  >
                    <FiLogOut className="text-2xl me-1" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <h1 className="text-3xl text-white font-bold ms-4 mb-0.5 italic">
          Alnael Library
        </h1>

        {!user ? (
          <Link
            href="/login"
            className="ms-auto btn bg-amber-500 hover:bg-amber-400 hover:border-amber-200 text-white shadow-lg border-2 border-amber-300"
          >
            MASUK
          </Link>
        ) : (
          <Link
            href="/dashboard/profile"
            className="ms-auto btn bg-amber-500 hover:bg-amber-400 hover:border-amber-200 text-white shadow-lg border-2 border-amber-300 p-2"
          >
            <MdAccountCircle className="text-2xl" />
            {user.first_name}
          </Link>
        )}
      </div>
      {/* Mobile View END */}

      {/* Tab - Desktop View START */}
      <div
        className={`hidden md:navbar fixed z-[999] transition-all ease-in-out duration-300 ${
          isCarouselPassed || router.asPath !== "/"
            ? "bg-gradient-to-br from-amber-500 to-amber-800"
            : "bg-transparent"
        }`}
      >
        <div className="navbar-start">
          <h1 className="text-3xl text-white font-bold ms-4 mb-0.5 italic">
            Alnael Library
          </h1>

          <ul className="ms-4 menu menu-horizontal gap-2 text-base font-semibold">
            {generalLinks.map((link) => (
              <li
                key={link.href}
                className={`rounded-md border-2 border-transparent hover:bg-amber-600 hover:border-amber-400 focus:bg-amber-400 ${
                  router.pathname === link.href
                    ? "bg-amber-500 border-amber-300"
                    : ""
                }`}
              >
                <Link href={link.href} className="text-white focus:text-white">
                  {link.label}
                </Link>
              </li>
            ))}

            <li
              tabIndex={0}
              className={`transition-all delay-300 ${
                router.pathname === "/blogs" ? "opacity-0" : ""
              }`}
            >
              <details>
                <summary>Kategori</summary>
                <ul className="p-2 border-2 border-gray-100 w-max">
                  {categoriesLinks.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/blogs?category=${category}`}
                        className="text-white text-sm hover:bg-amber-500 hover:text-white"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <div className="navbar-end me-2">
          {!user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn text-white font-bold text-base shadow-lg border-2 py-2 px-4 bg-amber-600 border-amber-300 hover:bg-amber-700 hover:border-amber-100"
              >
                Login
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-amber-500"
              >
                {notLoggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-semibold hover:bg-amber-300"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`btn text-white font-bold text-lg shadow-lg border-2 p-2 hover:bg-amber-600 hover:border-amber-100 ${
                  isCarouselPassed || router.asPath !== "/"
                    ? "bg-amber-500 border-amber-300"
                    : "bg-transparent border-transparent"
                }`}
              >
                <MdAccountCircle className="text-2xl" />
                {user.first_name}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-amber-500"
              >
                {userLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-semibold hover:bg-amber-300"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white font-semibold mt-2 bg-red-600 hover:bg-red-500 focus:bg-red-700"
                  >
                    <FiLogOut className="text-2xl me-1" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Tab - Desktop View END */}
    </>
  );
}
