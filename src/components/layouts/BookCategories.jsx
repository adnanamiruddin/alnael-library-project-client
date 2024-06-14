import bookCategoriesApi from "@/api/modules/bookCategories.api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BookCategories({ selectedCategory, onCategorySelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { response, error } = await bookCategoriesApi.getBookCategories();
      if (response) setCategories(response.data);
      if (error) toast.error("Gagal mengambil data kategori buku");
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h3 className="font-bold text-2xl mb-3">Kategori</h3>

      <div className="flex gap-2 overflow-x-scroll hide-scrollbar">
        <button
          className={`capitalize whitespace-nowrap px-6 py-2 text-sm font-medium border rounded-lg ${
            selectedCategory === "Semua"
              ? "text-white bg-amber-600 border-amber-600"
              : "text-amber-600 bg-white border-amber-600 hover:text-white hover:border-lime-500 hover:bg-amber-600"
          }`}
          onClick={() => onCategorySelect("Semua")}
        >
          Semua
        </button>
        {categories.map((category, i) => (
          <button
            key={i}
            className={`capitalize whitespace-nowrap px-6 py-2 text-sm font-medium border rounded-lg ${
              selectedCategory === category.name
                ? "text-white bg-amber-600 border-amber-600"
                : "text-amber-600 bg-white border-amber-600 hover:text-white hover:border-lime-500 hover:bg-amber-600"
            }`}
            onClick={() => onCategorySelect(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
