import publicClient from "../clients/public.client";
import privateClient from "../clients/private.client";

const booksEndpoint = {
  books: "/books",
  bookById: ({ id }) => `/books/${id}`,
  bookItemsByBookId: ({ id }) => `/books/${id}/book-items`,
};

const booksApi = {
  addBook: async ({
    isbn,
    title,
    image_url,
    author,
    publisher,
    publication_year,
    description,
    stock,
    category_ids,
  }) => {
    try {
      const response = await privateClient.post(booksEndpoint.books, {
        isbn,
        title,
        image_url,
        author,
        publisher,
        publication_year,
        description,
        stock,
        category_ids,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getBooks: async () => {
    try {
      const response = await publicClient.get(booksEndpoint.books);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getBookById: async ({ id }) => {
    try {
      const response = await publicClient.get(booksEndpoint.bookById({ id }));
      return { response };
    } catch (error) {
      return { error };
    }
  },

  editBook: async ({
    id,
    isbn,
    title,
    image_url,
    author,
    publisher,
    publication_year,
    description,
    stock,
  }) => {
    try {
      const response = await privateClient.put(booksEndpoint.bookById({ id }), {
        isbn,
        title,
        image_url,
        author,
        publisher,
        publication_year,
        description,
        stock,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  deleteBook: async ({ id }) => {
    try {
      const response = await privateClient.delete(
        booksEndpoint.bookById({ id })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getBookItemsByBookId: async ({ id }) => {
    try {
      const response = await publicClient.get(
        booksEndpoint.bookItemsByBookId({ id })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default booksApi;
