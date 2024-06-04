import { IoMdSearch, IoMdClose } from "react-icons/io";

export default function SearchBar() {
  return (
    <form className="form relative">
      <button
        type="button"
        className="absolute left-2 -translate-y-1/2 top-1/2 p-1"
      >
        <IoMdSearch className="text-gray-700 text-xl" />
      </button>
      <input
        className="input rounded-md px-10 py-3 border-2 border-transparent focus:outline-none bg-gray-100 focus:border-blue-500 placeholder-gray-400 transition-all duration-300 shadow-md w-full"
        placeholder="Cari buku..."
        type="text"
      />
      <button
        type="reset"
        className="absolute right-3 -translate-y-1/2 top-1/2 p-1"
      >
        <IoMdClose className="text-gray-700 text-2xl" />
      </button>
    </form>
  );
}
