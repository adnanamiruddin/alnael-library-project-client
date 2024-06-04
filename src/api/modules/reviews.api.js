import publicClient from "../clients/public.client";
import privateClient from "../clients/private.client";

const reviewsEndpoint = {
  reviews: "/reviews",
  reviewByBookId: ({ book_id }) => `/reviews/${book_id}`,
  reviewById: ({ review_id }) => `/reviews/${review_id}`,
  userReviews: "/reviews/user",
};

const reviewsApi = {
  addReview: async ({ book_id, review_comment }) => {
    try {
      const response = await privateClient.post(reviewsEndpoint.reviews, {
        book_id,
        review_comment,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getReviewsByBookId: async ({ book_id }) => {
    try {
      const response = await publicClient.get(
        reviewsEndpoint.reviewByBookId({ book_id })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  deleteReview: async ({ review_id }) => {
    try {
      const response = await privateClient.delete(
        reviewsEndpoint.reviewById({ review_id })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getUserReviews: async () => {
    try {
      const response = await privateClient.get(reviewsEndpoint.userReviews);
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default reviewsApi;
