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
import Select from "react-select";
import bookCategoriesApi from "@/api/modules/bookCategories.api";

export default function EditBookModal({ bookId }) {
  const router = useRouter();

  const [isOnRequest, setIsOnRequest] = useState(false);
  const [bookImageUrl, setBookImageUrl] = useState(null);
  const [bookImageUpload, setBookImageUpload] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchBookData = async () => {
      const { response, error } = await booksApi.getBookById({ id: bookId });
      if (response) {
        editBookForm.setValues({
          isbn: response.data.isbn,
          title: response.data.title,
          author: response.data.author,
          publisher: response.data.publisher,
          publication_year: response.data.publication_year,
          description: response.data.description,
          stock: response.data.stock,
        });
        setBookImageUrl(response.data.image_url);
        setSelectedCategories(
          response.data.categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      }
      if (error) toast.error("Gagal mengambil data buku");
    };
    if (bookId) fetchBookData();
  }, [bookId]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { response, error } = await bookCategoriesApi.getBookCategories();
      if (response) setCategories(response.data);
      if (error) toast.error("Gagal mengambil data kategori buku");
    };
    fetchCategories();
  }, []);

  const editBookForm = useFormik({
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
      let newImageUrl = bookImageUrl;
      if (bookImageUpload) {
        try {
          const storageRef = ref(
            storage,
            `book_images/${bookImageUpload.name + v4()}`
          );
          const upload = await uploadBytes(storageRef, bookImageUpload);
          newImageUrl = await getDownloadURL(upload.ref);
        } catch (error) {
          toast.error("Gagal mengunggah gambar");
          setIsOnRequest(false);
          return;
        }
      }

      const { response, error } = await booksApi.editBook({
        id: bookId,
        isbn: values.isbn,
        title: values.title,
        image_url: newImageUrl,
        author: values.author,
        publisher: values.publisher,
        publication_year: values.publication_year,
        description: values.description,
        stock: values.stock,
        category_ids: selectedCategories.map((cat) => cat.value),
      });
      if (response) {
        toast.success(
          "Data buku berhasil diperbarui. Halaman akan dimuat ulang..."
        );
        document.getElementById("edit_book_modal").close();
        setTimeout(() => {
          router.reload();
          setIsOnRequest(false);
        }, 3000);
      } else {
        toast.error(error.message);
        document.getElementById("edit_book_modal").close();
        setIsOnRequest(false);
      }
    },
  });

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  return (
    <dialog id="edit_book_modal" className="modal">
      <div className="modal-box bg-gray-100 hide-scrollbar">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl">Edit Buku</h3>

        <form
          onSubmit={editBookForm.handleSubmit}
          className="mt-3 flex flex-col gap-3"
        >
          <Input
            name="title"
            placeholder="Budaya Indonesia..."
            label="Judul Buku"
            type="text"
            value={editBookForm.values.title}
            onChange={editBookForm.handleChange}
            error={
              editBookForm.touched.title &&
              editBookForm.errors.title !== undefined
            }
            helperText={editBookForm.touched.title && editBookForm.errors.title}
          />

          <Input
            name="isbn"
            placeholder="123-ABC-456-DEF..."
            label="ISBN"
            type="text"
            value={editBookForm.values.isbn}
            onChange={editBookForm.handleChange}
            error={
              editBookForm.touched.isbn &&
              editBookForm.errors.isbn !== undefined
            }
            helperText={editBookForm.touched.isbn && editBookForm.errors.isbn}
            disabled={true}
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
            value={editBookForm.values.author}
            onChange={editBookForm.handleChange}
            error={
              editBookForm.touched.author &&
              editBookForm.errors.author !== undefined
            }
            helperText={
              editBookForm.touched.author && editBookForm.errors.author
            }
          />

          <Input
            name="publisher"
            placeholder="Erlangga..."
            label="Penerbit"
            type="text"
            value={editBookForm.values.publisher}
            onChange={editBookForm.handleChange}
            error={
              editBookForm.touched.publisher &&
              editBookForm.errors.publisher !== undefined
            }
            helperText={
              editBookForm.touched.publisher && editBookForm.errors.publisher
            }
          />

          <Input
            name="publication_year"
            placeholder="2024..."
            label="Tahun Terbit"
            type="number"
            value={editBookForm.values.publication_year}
            onChange={editBookForm.handleChange}
            error={
              editBookForm.touched.publication_year &&
              editBookForm.errors.publication_year !== undefined
            }
            helperText={
              editBookForm.touched.publication_year &&
              editBookForm.errors.publication_year
            }
          />

          <Input
            name="stock"
            placeholder="100..."
            label="Stok"
            type="number"
            value={editBookForm.values.stock}
            onChange={editBookForm.handleChange}
            error={
              editBookForm.touched.stock &&
              editBookForm.errors.stock !== undefined
            }
            helperText={editBookForm.touched.stock && editBookForm.errors.stock}
            disabled={true}
          />

          <div>
            <div className="label">
              <span className="label-text text-black text-lg -mb-3">
                Deskripsi Buku
              </span>
            </div>
            <TextArea
              name="description"
              value={editBookForm.values.description}
              onChange={editBookForm.handleChange}
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
            <LoadingButton loading={isOnRequest}>Simpan</LoadingButton>
          </div>
        </form>
      </div>
    </dialog>
  );
}
