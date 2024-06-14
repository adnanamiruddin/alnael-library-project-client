import Input from "@/components/functions/Input";
import LoadingButton from "@/components/functions/LoadingButton";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import TextArea from "@/components/functions/TextArea";
import booksApi from "@/api/modules/books.api";
import { storage } from "@/api/config/firebase.config";
import bookCategoriesApi from "@/api/modules/bookCategories.api";
import Select from "react-select";

export default function AddBookModal() {
  const router = useRouter();

  const [isOnRequest, setIsOnRequest] = useState(false);
  const [bookImageUpload, setBookImageUpload] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { response, error } = await bookCategoriesApi.getBookCategories();
      if (response) setCategories(response.data);
      if (error) toast.error("Gagal mengambil data kategori buku");
    };
    fetchCategories();
  }, []);

  const addBookForm = useFormik({
    initialValues: {
      isbn: "",
      title: "",
      author: "",
      publisher: "",
      publication_year: "",
      description: "",
      stock: "",
    },
    validationSchema: Yup.object({
      isbn: Yup.string().required("ISBN harus diisi"),
      title: Yup.string().required("Judul harus diisi"),
      author: Yup.string().required("Penulis harus diisi"),
      publisher: Yup.string().required("Penerbit harus diisi"),
      publication_year: Yup.number()
        .typeError("Tahun Terbit harus berupa angka")
        .min(1000, "Tahun Terbit tidak boleh sebelum tahun 1000")
        .max(new Date().getFullYear(), "Tahun Terbit tidak boleh di masa depan")
        .required("Tahun Terbit harus diisi"),
      description: Yup.string().required("Deskripsi harus diisi"),
      stock: Yup.number()
        .typeError("Stok harus berupa angka")
        .required("Stok harus diisi"),
    }),
    onSubmit: async (values) => {
      if (isOnRequest) return;

      setIsOnRequest(true);
      let bookImageUrl = "";
      if (bookImageUpload) {
        try {
          const storageRef = ref(
            storage,
            `book_images/${bookImageUpload.name + v4()}`
          );
          const upload = await uploadBytes(storageRef, bookImageUpload);
          const downloadUrl = await getDownloadURL(upload.ref);
          bookImageUrl = downloadUrl;
        } catch (error) {
          toast.error("Gagal mengunggah gambar");
          setIsOnRequest(false);
          return;
        }
      }

      const { response, error } = await booksApi.addBook({
        isbn: values.isbn,
        title: values.title,
        image_url: bookImageUrl,
        author: values.author,
        publisher: values.publisher,
        publication_year: values.publication_year,
        description: values.description,
        stock: values.stock,
        category_ids: selectedCategories.map((cat) => cat.value),
      });
      if (response) {
        toast.success(
          "Buku berhasil ditambahkan. Halaman akan dimuat ulang..."
        );
        document.getElementById("add_book_modal").close();
        setTimeout(() => {
          router.reload();
          setIsOnRequest(false);
        }, 3000);
      } else {
        toast.error(error.message);
        document.getElementById("add_book_modal").close();
        setIsOnRequest(false);
      }
    },
  });

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  return (
    <dialog id="add_book_modal" className="modal">
      <div className="modal-box bg-gray-100 hide-scrollbar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl">Tambah Buku</h3>

        <form
          onSubmit={addBookForm.handleSubmit}
          className="mt-3 flex flex-col gap-3"
        >
          <Input
            name="title"
            placeholder="Budaya Indonesia..."
            label="Judul Buku"
            type="text"
            value={addBookForm.values.title}
            onChange={addBookForm.handleChange}
            error={
              addBookForm.touched.title &&
              addBookForm.errors.title !== undefined
            }
            helperText={addBookForm.touched.title && addBookForm.errors.title}
          />

          <Input
            name="isbn"
            placeholder="123-ABC-456-DEF..."
            label="ISBN"
            type="text"
            value={addBookForm.values.isbn}
            onChange={addBookForm.handleChange}
            error={
              addBookForm.touched.isbn && addBookForm.errors.isbn !== undefined
            }
            helperText={addBookForm.touched.isbn && addBookForm.errors.isbn}
          />

          <div className="w-full">
            <label className="label">
              <span className="label-text text-black text-lg">Kategori</span>
            </label>
            <Select
              isMulti
              name="categories"
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleCategoryChange}
              value={selectedCategories}
            />
          </div>

          <Input
            name="author"
            placeholder="John Doe..."
            label="Penulis"
            type="text"
            value={addBookForm.values.author}
            onChange={addBookForm.handleChange}
            error={
              addBookForm.touched.author &&
              addBookForm.errors.author !== undefined
            }
            helperText={addBookForm.touched.author && addBookForm.errors.author}
          />

          <Input
            name="publisher"
            placeholder="Erlangga..."
            label="Penerbit"
            type="text"
            value={addBookForm.values.publisher}
            onChange={addBookForm.handleChange}
            error={
              addBookForm.touched.publisher &&
              addBookForm.errors.publisher !== undefined
            }
            helperText={
              addBookForm.touched.publisher && addBookForm.errors.publisher
            }
          />

          <Input
            name="publication_year"
            placeholder="2024..."
            label="Tahun Terbit"
            type="number"
            value={addBookForm.values.publication_year}
            onChange={addBookForm.handleChange}
            error={
              addBookForm.touched.publication_year &&
              addBookForm.errors.publication_year !== undefined
            }
            helperText={
              addBookForm.touched.publication_year &&
              addBookForm.errors.publication_year
            }
          />

          <Input
            name="stock"
            placeholder="100..."
            label="Stok"
            type="number"
            value={addBookForm.values.stock}
            onChange={addBookForm.handleChange}
            error={
              addBookForm.touched.stock &&
              addBookForm.errors.stock !== undefined
            }
            helperText={addBookForm.touched.stock && addBookForm.errors.stock}
          />

          <div>
            <div className="label">
              <span className="label-text text-black text-lg -mb-3">
                Deskripsi Buku
              </span>
            </div>
            <TextArea
              name="description"
              value={addBookForm.values.description}
              onChange={addBookForm.handleChange}
              placeholder="Deskripsi Buku..."
              rows={5}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-black text-lg">Sampul Buku</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setBookImageUpload(e.target.files[0]);
              }}
              className="file-input file-input-bordered file-input-warning w-full bg-gray-50"
            />
          </div>

          <div className="mt-3">
            <LoadingButton loading={isOnRequest}>Tambah</LoadingButton>
          </div>
        </form>
      </div>
    </dialog>
  );
}
