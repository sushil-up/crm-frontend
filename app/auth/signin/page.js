"use client";
import { Box, CircularProgress, FormControl, Grid } from "@mui/material";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInput from "@/components/share/forminputs/FormInput";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import { SignInSchemaValidation } from "@/components/validation/signin-validation/SignInSchemaValidation";
import Image from "next/image";

// export default
function LoginForm() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  useDocumentTitle("Login"); //PAGE TITLE

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    // for validation :
    resolver: yupResolver(SignInSchemaValidation),
  });
  const onSubmit = async (data) => {
    const { email, password } = data;
    setLoader(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res.error) {
        errorMsg("Invalid Credentials");
        setLoader(false);
        return;
      }

      successMsg("You are Successfully Login");
      router.replace("/dailyreporting/by-user");
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  return (
    <>
      <div className="grid place-items-center h-screen bg-gray-50">
        <div className="shadow-xl border border-slate-200 flex rounded-3xl overflow-hidden bg-white max-w-4xl w-full">
          {/* Left Image Section */}
          <div className="w-1/2">
            <img
              src="/assets/images/loginimg.jpg"
              alt="Login illustration"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form Section */}
          <div className="w-1/2 p-10 flex flex-col justify-center">
            <h1 className="font-bold mb-8 text-4xl">Login</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Email Field */}
              <FormControl fullWidth>
                <FormInput
                  className="p-3 focus:outline-none shadow-inner rounded-md"
                  inputType="email"
                  name="email"
                  control={control}
                  label="Email"
                  errors={errors}
                />
              </FormControl>

              {/* Password Field */}
              <FormControl fullWidth>
                <FormInput
                  className="p-3 focus:outline-none shadow-inner rounded-md"
                  inputType="password"
                  name="password"
                  control={control}
                  label="Password"
                  errors={errors}
                />
              </FormControl>

              {/* Loader / Button */}
              {loader ? (
                <Box sx={{ display: "flex" }} className="justify-center">
                  <CircularProgress />
                </Box>
              ) : (
                <button
                  type="submit"
                  className="bg-[rgba(184,32,37,1)] text-white font-bold cursor-pointer px-6 py-3 rounded-full hover:bg-red-700 transition"
                >
                  Login
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(LoginForm), { ssr: false });
