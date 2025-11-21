"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@mui/material";
import usersServie from "@/services/usersService";
import { usePathname, useRouter } from "next/navigation";
import LayoutHeader from "@/app/layoutHeader";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { useSession } from "next-auth/react";
import EditUserForm from "@/components/forms/users/EditUserForm";
import { RegisterSchema } from "@/components/validation/user/RegisterSchema";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import Loading from "../../loading";
import UserContext from "@/context/UserContext";
export const userLinkSend = {
  userLink: () => {
    const pathName = usePathname();
    const [userLink, setUserLink] = useState(pathName);

    return userLink;
  },
};
// Component for adding a new project

function UserEdit(params) {
  // state for file uplode
  const [file, setFile] = useState(null);
  const [lodding, setLoading] = useState(false);
  const session = useSession();
  const [profileImage, setProfileImage] = useState(null);
  const currentUser = session?.data?.user?.id;
  const adminUser = session?.data?.user?.admin;
  const [filePath, setFilePath] = useState(null);
  //PAGE TITLE
  useDocumentTitle("Edit User | Acewebx");

  // defalutVlaue for getting single userData
  const defaultValues = {
    full_name: "",
    status: "",
    email: "",
    phone: "",
    password: "",
  };

  // getting id by params
  const userId = params.params.edit;
  const router = useRouter();

  // useform hook form control form data
  const {
    control,
    reset,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(RegisterSchema),
  });

  // Handle the file upload action
  const fileHandler = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      setFilePath(URL.createObjectURL(file));
    }
  };

  // onSubmit is for form data
  const onSubmit = async (data) => {
    setLoading(true);
    const formattedData = {
      ...data,
      thumbnail: file,
    };
    const removeBlankPass = { ...data };
    // to store form data into FormData object for file upload opration:---
    let form = new FormData();
    form.append("profile_image", file);
    form.append("full_name", formattedData.full_name);
    form.append("email", formattedData.email);
    form.append("phone", formattedData.phone);
    form.append("slack_id", formattedData.slack_id);
    if (formattedData.password == "") {
      delete removeBlankPass["password"];
    } else {
      form.append("password", formattedData.password);
    }
    form.append("status", formattedData.status);
    try {
      const response = await usersServie.updateuser(userId, form);
      successMsg(response?.message);
      reset();
      router.push("/users/list");
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // userDataGet function is use To get data by id
  const userDataGet = async () => {
    try {
      const result = await usersServie.getUserById(userId);
      const data = result.data;
      const allData = {
        ...data,
        slack_id: data.slack_id == "null" ? "" : data.slack_id,
      };
      setProfileImage(allData?.profile_image);
      reset(allData);
    } catch (error) {
      errorMsg(error?.message);
      router.push("/users/list");
    }
  };

  //fetch data when component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser !== undefined) {
          if (userId == currentUser || adminUser == "true") {
            await userDataGet();
          } else {
            router.push("/users/list");
          }
        }
      } catch (error) {
        console.error("Error fetching user data :", error);
      }
    };
    fetchData();
  }, [router, currentUser]);
  const { setTitle } = useContext(UserContext);
  setTitle("Edit User");
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className=" mt-2">
        <EditUserForm
          control={control}
          errors={errors}
          profileImage={profileImage}
          register={register}
          fileHandler={fileHandler}
          watch={watch}
          filePath={filePath}
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

export default UserEdit;
