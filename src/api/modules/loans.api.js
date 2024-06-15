import privateClient from "../clients/private.client";

const loansEndpoint = {
  loans: "/loans",
  loanById: ({ id }) => `/loans/${id}`,
  checkLoan: ({ book_id }) => `/loans/check/${book_id}`,
  userLoans: "/loans/user",
};

const loansApi = {
  borrowBook: async ({ book_id, book_code }) => {
    try {
      const response = await privateClient.post(loansEndpoint.loans, {
        book_id,
        book_code,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  isBookOnLoan: async ({ book_id }) => {
    try {
      const response = await privateClient.get(
        loansEndpoint.checkLoan({ book_id })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getUserLoans: async () => {
    try {
      const response = await privateClient.get(loansEndpoint.userLoans);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getLoans: async () => {
    try {
      const response = await privateClient.get(loansEndpoint.loans);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getLoanById: async ({ id }) => {
    try {
      const response = await privateClient.get(loansEndpoint.loanById({ id }));
      return { response };
    } catch (error) {
      return { error };
    }
  },

  returnBook: async ({ id }) => {
    try {
      const response = await privateClient.put(loansEndpoint.loanById({ id }));
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default loansApi;
