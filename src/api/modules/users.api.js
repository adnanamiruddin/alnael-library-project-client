import publicClient from "../clients/public.client";
import privateClient from "../clients/private.client";

const usersEndpoint = {
  signUp: "/users/sign-up",
  signIn: "/users/sign-in",
  profile: "/users/profile",
};

const usersApi = {
  signUp: async ({ first_name, last_name, email, password }) => {
    try {
      const response = await publicClient.post(usersEndpoint.signUp, {
        first_name,
        last_name,
        email,
        password,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  signIn: async ({ email, password }) => {
    try {
      const response = await publicClient.post(usersEndpoint.signIn, {
        email,
        password,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getProfile: async () => {
    try {
      const response = await privateClient.get(usersEndpoint.profile);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  updateProfile: async ({
    first_name,
    last_name,
    age,
    address,
    phone_number,
  }) => {
    try {
      const response = await privateClient.put(usersEndpoint.profile, {
        first_name,
        last_name,
        age,
        address,
        phone_number,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default usersApi;
