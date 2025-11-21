"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import usersServie from "@/services/usersService";
import { useRouter } from "next/navigation";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LayoutHeader from "@/app/layoutHeader";
import Loading from "../loading";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import AddUserForm from "@/components/forms/users/AddUserForm";
import { RegisterSchema } from "@/components/validation/user/RegisterSchema";
import UserContext from "@/context/UserContext";

function AddUser() {
  const [file, setFile] = useState(null);
  const [lodding, setLoading] = useState(false);
  useDocumentTitle("Add User | Acewebx"); //page title

  // here use useform hook library to control form data
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(RegisterSchema),
  });

  const router = useRouter();
  // session is use for getting login user id:-
  const { data: session } = useSession();
  const looginId = session?.user.id;
  const adminUser = session?.user?.admin;
  const { setTitle } = useContext(UserContext);
  // Handle the file upload action
  const fileHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
    }
  };
  // submit form data
  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      thumbnail: file,
    };
    // to store form data into FormData object for file upload opration
    let form = new FormData();
    form.append("profile_image", file);
    form.append("full_name", formattedData.full_name);
    form.append("email", formattedData.email);
    form.append("phone", formattedData.phone);
    form.append("password", formattedData.password);
    form.append("status", formattedData.status);
    form.append("slack_id", formattedData.slack_id);
    form.append("created_by", looginId);

    try {
      const userData = await usersServie.addUser(form);
      if (userData.status === true) {
        successMsg(userData.message); // success message
        reset();
        setLoading(false);
        router.push("/users/list");
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    if (adminUser == "true") {
      router.push("/users/add");
    } else {
      router.push("/users/list");
    }
  }, [session]);
  setTitle(`Add New User`);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className=" mt-2">
        <AddUserForm
          control={control}
          errors={errors}
          register={register}
          fileHandler={fileHandler}
        />
        <Grid item md={12} xs={12} className="pt-4 px-2">
          <div className="h-screen flex items-center justify-center">
            {lodding && <Loading />}
          </div>
        </Grid>
      </form>
    </>
  );
}

export default AddUser;
