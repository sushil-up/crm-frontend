import axios from "axios";
import { getSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const ApiClient = () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const instance = axios.create({
    baseURL,
  });
  let isSigningOut = false;
  instance.interceptors.request.use(async (request) => {
    const session = await getSession();
    if (session) {
      request.headers["x-access-token"] = session?.user?.accessToken || "";
    }

    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.data.errorCode == 601 && !isSigningOut) {
        isSigningOut = true;
        signOut().finally(() => {
          isSigningOut = false;
        });
        return Promise.reject(response.data);
      }
      return response.data;
    },
    (error) => {
      return Promise.reject(error?.response?.data);
    }
  );

  return instance;
};

export default ApiClient();
