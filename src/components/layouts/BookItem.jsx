import Image from "next/image";
import Link from "next/link";
import { MdFavorite } from "react-icons/md";

export default function BookItem({ book }) {
  const truncateTitle = (text) => {
    const maxLength = 30;
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <Link
      href={`/books/${book.id}`}
      className="bg-gray-100 rounded-md shadow-xl relative border border-gray-400 w-[47%] md:w-[15%]"
    >
      {book.is_favorite ? (
        <MdFavorite className="absolute top-2 right-2 text-red-600 text-3xl" />
      ) : null}
      <Image
        src={book.image_url}
        alt={book.title}
        width={500}
        height={500}
        className="w-full h-48 object-cover rounded-md rounded-b-none md:h-64"
      />
      <h1 className="pt-3 px-2 text-lg font-bold text-center">
        {truncateTitle(book.title)}{" "}
      </h1>

      <p className="p-4 font-medium text-center">{book.author}</p>
    </Link>
  );
}
