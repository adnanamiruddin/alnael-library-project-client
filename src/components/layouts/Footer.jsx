import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex justify-between items-center bg-gray-900 py-3 px-7">
      <div className="flex gap-5 items-center md:gap-7">
        <Image
          src="/logo-perpus.jpeg"
          alt="Logo Pantai Marina"
          width={500}
          height={500}
          className="w-14 h-14 rounded-md"
        />

        <p className="text-gray-500 text-xs md:text-sm">
          Copyright © 2024 Alnael Library. Developed by Muh. Adnan Putra
          Amiruddin, Al Qadri, Khalizatul Jannah
        </p>
      </div>
    </div>
  );
}
