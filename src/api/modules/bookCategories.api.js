import publicClient from "../clients/public.client";

const bookCategoriesEndpoint = {
  bookCategories: "/books/categories",
};

const bookCategoriesApi = {
  getBookCategories: async () => {
    try {
      const response = await publicClient.get(
        bookCategoriesEndpoint.bookCategories
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default bookCategoriesApi;
