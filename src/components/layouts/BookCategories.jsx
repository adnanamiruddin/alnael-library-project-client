const categories = ["Semua", "Fiksi", "Non-Fiksi", "Komik", "Novel", "Puisi"];

export default function BookCategories() {
  return (
    <div className="">
      <h3 className="font-bold text-2xl mb-3">Kategori</h3>

      <div className="flex gap-2 overflow-scroll">
        {categories.map((category, i) => (
          <button
            key={i}
            className="capitalize whitespace-nowrap px-6 py-2 text-sm font-medium text-amber-600 bg-white border rounded-lg border-amber-600 hover:text-white hover:border-lime-500 hover:bg-amber-600 focus:text-white focus:border-white focus:bg-amber-600"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
