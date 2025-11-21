"use client";
import { errorMsg } from "@/app/toster-msg/msg";
import { statusOptions } from "@/components/selectOptions/selectOptionObject";
import FormInput from "@/components/share/forminputs/FormInput";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";
import FormInputSelectAutoComplete from "@/components/share/forminputs/FormInputSelectAutoComplete";
import FormMobileDatePicker from "@/components/share/forminputs/FormMobileDatePicker";
import usersService from "@/services/usersService";
import { Button, FormControl, Grid } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

export default function EditProjectForm({ control, handleChange, errors }) {
  const [userData, setUserData] = useState([]);

  //get user list data
  const getUserData = async () => {
    try {
      const dataUser = await usersService.getSelectUsers();
      setUserData(dataUser?.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <Box className="login-form-wrapper !bg-[#FFFAFA] ">
        <div className="p-14 grid grid-cols-3 gap-12">
          <FormInput
            className="shadow-lg relative"
            name="title"
            placeholder=""
            control={control}
            errors={errors}
            label="Project Title"
            multiline
          />

          <FormInput
            className="shadow-lg relative"
            name="client"
            control={control}
            errors={errors}
            label="Project Client Name"
            multiline
          />

          <FormMobileDatePicker
            className="shadow-lg relative"
            name="start_date"
            control={control}
            errors={errors}
            required={true}
            label="Enter Project Start Date"
            inputFormat="YYYY-MM-DD"
          />

          <FormMobileDatePicker
            name="end_date"
            control={control}
            errors={errors}
            required={true}
            className="shadow-lg relative"
            label="Enter Project End Date"
            inputFormat="YYYY-MM-DD"
          />

          <FormInputSelect
            name="status"
            className="shadow-lg relative"
            control={control}
            label="Project Status"
            options={statusOptions}
            errors={errors}
          />

          <FormInputSelectAutoComplete
            name="pm_id"
            className="shadow-lg relative capitalize"
            control={control}
            label="Project Assign"
            options={userData}
            errors={errors}
            handleChange={handleChange}
            inputValueCheck={false}
          />
        </div>
        <div className="pl-14 pr-12">
          <FormInput
            className="shadow-lg relative"
            name="description"
            control={control}
            label="Project Description"
            errors={errors}
            multiline
          />
        </div>
        <div className="p-14">
          <Button
            type="submit"
            className="!hover:bg-red-800 text-[18px] cursor-pointer h-14 w-48 bg-theme-red !rounded-full "
            variant="contained"
          >
            submit
          </Button>
        </div>
      </Box>
    </>
  );
}
