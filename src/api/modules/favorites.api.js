import privateClient from "../clients/private.client";

const favoritesEndpoint = {
  favorites: "/favorites",
  favoriteByBookId: ({ book_id }) => `/favorites/${book_id}`,
  favoriteById: ({ favorite_id }) => `/favorites/${favorite_id}`,
};

const favoritesApi = {
  addFavorite: async ({ book_id }) => {
    try {
      const response = await privateClient.post(favoritesEndpoint.favorites, {
        book_id,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getUserFavorites: async () => {
    try {
      const response = await privateClient.get(favoritesEndpoint.favorites);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  isFavorite: async ({ book_id }) => {
    try {
      const response = await privateClient.get(
        favoritesEndpoint.favoriteByBookId({ book_id })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  deleteFavorite: async ({ favorite_id }) => {
    try {
      const response = await privateClient.delete(
        favoritesEndpoint.favoriteById({ favorite_id })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default favoritesApi;
