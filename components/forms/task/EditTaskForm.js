"use client";
import { errorMsg } from "@/app/toster-msg/msg";
import { taskStatusOptions } from "@/components/selectOptions/selectOptionObject";
import FormInput from "@/components/share/forminputs/FormInput";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";
import FormInputSelectAutoComplete from "@/components/share/forminputs/FormInputSelectAutoComplete";
import FormMobileDatePicker from "@/components/share/forminputs/FormMobileDatePicker";
import usersService from "@/services/usersService";
import { Box, Button, FormControl, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";

function EditTaskForm({ control, errors, handleChange }) {
  const [allUser, setAllUser] = useState([]);

  // getting user assign  Name in Input
  const getUserData = async () => {
    try {
      const dataUser = await usersService.getSelectUsers();
      setAllUser(dataUser?.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  //  to call getUserdata function when component mount
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <>
      <Box className="login_form  w-full user-from-container !bg-[#FFFAFA]">
        <Grid container spacing={2} className="px-5  flex justify-center mb-10">
          <Box className="login-form-wrapper  py-5 px-4 width-400 flex justify-center flex-row flex-wrap rounded-sm w-full  rounded-lg">
            <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
              <FormControl fullWidth>
                <FormInput
                  className="shadow-lg relative"
                  name="title"
                  control={control}
                  errors={errors}
                  label="Task Title"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
              <FormControl fullWidth>
                <FormInput
                  className="shadow-lg relative"
                  name="description"
                  control={control}
                  label="Task Description"
                  errors={errors}
                  multiline
                />
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
              <FormControl fullWidth>
                <FormMobileDatePicker
                  className="shadow-lg relative"
                  name="start_date"
                  control={control}
                  errors={errors}
                  required={true}
                  label="Task Start Date"
                  inputFormat="YYYY-MM-DD"
                />
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
              <FormControl fullWidth>
                <FormMobileDatePicker
                  name="end_date"
                  value="2023/04/23"
                  control={control}
                  errors={errors}
                  required={true}
                  className="shadow-lg relative"
                  label="Task End Date"
                  inputFormat="YYYY-MM-DD"
                />
              </FormControl>
            </Grid>

            <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
              <FormInputSelect
                className="shadow-lg relative"
                name="status"
                control={control}
                label="Task Status"
                options={taskStatusOptions}
                errors={errors}
              />
            </Grid>
            <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
              <FormInputSelectAutoComplete
                name="assigned_user"
                className="shadow-lg relative capitalize"
                control={control}
                label="Task Assign"
                options={allUser}
                errors={errors}
                handleChange={handleChange}
                inputValueCheck={false}
              />
            </Grid>

            <Grid item md={12} xs={12} className="pt-4 px-2 ">
              <FormControl fullWidth>
                <Button
                  type="submit"
                  className="!hover:bg-red-800 text-[18px] cursor-pointer h-14 w-48 bg-theme-red !rounded-full "
                  variant="contained"
                >
                  Submit
                </Button>
              </FormControl>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </>
  );
}

export default EditTaskForm;
