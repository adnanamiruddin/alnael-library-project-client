import MotionDiv from "@/components/functions/MotionDiv";
import HomeButton from "@/components/layouts/HomeButton";
import HomeCard from "@/components/layouts/HomeCard";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector(selectUser);

  return (
    <div className="md:mx-24">
      <h3 className="font-bold text-3xl text-center md:text-4xl">
        Alnael Library
      </h3>

      <MotionDiv x={-100}>
        <p className="mt-6 text-justify md:mt-8">
          Alnael Library adalah aplikasi modern yang menyediakan solusi digital
          untuk kebutuhan perpustakaan. Dengan Alnael Library, pengguna dapat
          dengan mudah mengakses katalog buku, meminjam buku secara online, dan
          mengelola peminjaman mereka dengan efisien. Aplikasi ini dirancang
          untuk memberikan pengalaman perpustakaan yang nyaman dan terpadu.
        </p>
      </MotionDiv>

      <MotionDiv x={-100}>
        <p className="mt-6 text-justify">
          Alnael Library juga menyedikan berbagai fitur menarik, seperti
          rekomendasi buku berdasarkan minat, notifikasi pengembalian buku, dan
          statistik peminjaman. Dengan Alnael Library, pengguna dapat menikmati
          pengalaman membaca yang lebih menyenangkan dan teratur. Jelajahi dunia
          buku dengan Alnael Library dan temukan buku-buku yang menginspirasi
          dan menghibur.
        </p>
      </MotionDiv>

      <MotionDiv x={-100}>
        <p className="mt-6 text-justify">
          Alnael Library adalah aplikasi yang dirancang untuk memudahkan
          pengguna dalam mengakses dan mengelola koleksi buku mereka. Dengan
          Alnael Library, pengguna dapat dengan mudah mencari buku yang mereka
          inginkan, meminjam buku secara online, dan mengelola peminjaman mereka
          dengan efisien.
        </p>
      </MotionDiv>

      <div className="mt-6 md:flex">
        <div class="card-container">
          <div class="card">
            <div class="img-content">
              <Image
                src="/logo-perpus.jpeg"
                alt="Logo Pantai Marina"
                width={100}
                height={100}
                className="w-1/3"
              />
            </div>
            <div class="content">
              <p class="heading text-xl">Alnael</p>
              <p className="font-semibold text-justify text-base mt-1">
                Alnael Library, aplikasi modern yang menyediakan solusi digital
                untuk kebutuhan perpustakaan.
              </p>
            </div>
          </div>
        </div>

        <MotionDiv x={-100}>
          <div className="mt-6 md:mt-0 md:ms-6">
            <p className="text-justify">
              Alnael Library juga menyedikan berbagai fitur menarik, seperti
              rekomendasi buku berdasarkan minat, notifikasi pengembalian buku,
              dan statistik peminjaman. Dengan Alnael Library, pengguna dapat
              menikmati pengalaman membaca yang lebih menyenangkan dan teratur.
              Jelajahi dunia buku dengan Alnael Library dan temukan buku-buku
              yang menginspirasi dan menghibur.
            </p>

            <div className="hidden md:inline-block">
              <HomeButton href="/books">
                Yuk Baca Buku-Buku yang Tersedia
              </HomeButton>
            </div>
          </div>
        </MotionDiv>
      </div>

      <MotionDiv x={-100} optionalStyling="md:hidden">
        <div className="mt-2"></div>
        <HomeButton href="/books">Yuk Baca Buku-Buku yang Tersedia</HomeButton>
      </MotionDiv>

      {!user ? (
        <div className="md:flex md:justify-center md:items-start md:gap-8">
          <MotionDiv x={-100}>
            <HomeCard
              title="Daftar"
              description="Ingin menjadi bagian dari Alnael Library? Yuk buat akun Alnael Library kamu terlebih dahulu"
              buttonLink="/register"
            />
          </MotionDiv>

          <MotionDiv x={-100} optionalStyling="md:hidden">
            <p className="mt-4">atau</p>
          </MotionDiv>

          <MotionDiv x={-100}>
            <HomeCard
              title="Login"
              description="Sudah punya akun? Yuk langsung login untuk mengakses berbagai fitur menarik"
              buttonLink="/login"
            />
          </MotionDiv>
        </div>
      ) : null}
    </div>
  );
}
