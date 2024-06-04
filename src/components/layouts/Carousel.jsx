import CarouselItem from "./CarouselItem";

export default function Carousel() {
  return (
    <div className="carousel relative w-full md:h-screen mt-16 md:mt-0">
      <CarouselItem
        slide={"slide1"}
        title={"Perpustakaan"}
        desc={`Perpustakaan adalah tempat yang menyediakan koleksi buku dan sumber informasi lainnya untuk digunakan oleh masyarakat untuk tujuan pendidikan, penelitian, dan rekreasi.`}
        image="/perpustakaan1.jpg"
        prevSlide={"slide4"}
        nextSlide={"slide2"}
      />

      <CarouselItem
        slide={"slide2"}
        title={"Buku"}
        desc={`Buku adalah kumpulan lembaran yang berisi teks atau gambar, disusun dan dijilid bersama, yang digunakan sebagai sumber informasi, referensi, atau hiburan.`}
        image="/perpustakaan2.jpg"
        prevSlide={"slide1"}
        nextSlide={"slide3"}
      />

      <CarouselItem
        slide={"slide3"}
        title={"Pinjam Buku"}
        desc={`Meminjam buku adalah proses di mana seseorang mengambil buku dari perpustakaan atau institusi lain untuk dibawa pulang dan digunakan selama periode tertentu sebelum mengembalikannya.`}
        image="/perpustakaan3.jpg"
        prevSlide={"slide2"}
        nextSlide={"slide4"}
      />

      <CarouselItem
        slide={"slide4"}
        title={"Berikan Komentar"}
        desc={`Memberikan komentar terhadap buku adalah tindakan mengungkapkan pendapat, ulasan, atau penilaian pribadi mengenai isi, gaya penulisan, tema, atau dampak dari buku tersebut setelah membacanya.`}
        image="/perpustakaan4.jpg"
        prevSlide={"slide3"}
        nextSlide={"slide1"}
      />
    </div>
  );
}
