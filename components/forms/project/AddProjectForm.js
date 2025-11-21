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

export default function AddProjectForm({ control, errors, handleChange }) {
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
            defaultValue={dayjs()}
            required={true}
            label="Enter Project Start Date"
            inputFormat="YYYY-MM-DD"
          />

          <FormMobileDatePicker
            name="end_date"
            control={control}
            errors={errors}
            required={true}
            defaultValue={dayjs().add(1, "month")}
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

// <Box className="login_form  w-full user-from-container">
//   <Grid
//     container
//     spacing={2}
//     className="px-5  flex justify-center mb-10 !bg-[#FFFAFA]"
//   >
//     <Box className="login-form-wrapper border-stone-300 py-5 px-2  width-400 flex justify-center flex-row flex-wrap  custom-shadow rounded-md">
//       <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
//         <FormInput
//           className="shadow-lg relative"
//           name="title"
//           placeholder=''
//           control={control}
//           errors={errors}
//           label="Project Title"
//           multiline
//         />
//       </Grid>
//       <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
//         <FormInput
//           className="shadow-lg relative"
//           name="client"
//           control={control}
//           errors={errors}
//           label="Project Client Name"
//           multiline
//         />
//       </Grid>

//       <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
//         <FormMobileDatePicker
//           className="shadow-lg relative"
//           name="start_date"
//           control={control}
//           errors={errors}
//           defaultValue={dayjs()}
//           required={true}
//           label="Enter Project Start Date"
//           inputFormat="YYYY-MM-DD"
//         />
//       </Grid>

//       <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
//         <FormMobileDatePicker
//           name="end_date"
//           control={control}
//           errors={errors}
//           required={true}
//           defaultValue={dayjs().add(1, "month")}
//           className="shadow-lg relative"
//           label="Enter Project End Date"
//           inputFormat="YYYY-MM-DD"
//         />
//       </Grid>

//       <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
//         <FormInputSelect
//           name="status"
//           className="shadow-lg relative"
//           control={control}
//           label="Project Status"
//           options={statusOptions}
//           errors={errors}
//         />
//       </Grid>
//       <Grid item md={6} xs={12} className="pt-4 px-2 pb-4 O ">
//         <FormInputSelectAutoComplete
//           name="pm_id"
//           className="shadow-lg relative capitalize"
//           control={control}
//           label="Project Assign"
//           options={userData}
//           errors={errors}
//           handleChange={handleChange}
//           inputValueCheck={false}
//         />
//       </Grid>
//       <Grid item md={12} xs={12} className="pt-4 px-2 pb-4">
//         <FormInput
//           className="shadow-lg relative"
//           name="description"
//           control={control}
//           label="Project Description"
//           errors={errors}
//           multiline
//         />
//       </Grid>

//       <Grid item md={12} xs={12} className="pt-4 px-2 ">
//         <FormControl fullWidth>
//           <Button
//             type="submit"
//            className="!hover:bg-red-800 cursor-pointer w-36 bg-theme-red !rounded-full "
//             variant="contained"
//           >
//             submit
//           </Button>
//         </FormControl>
//       </Grid>
//     </Box>
//   </Grid>
// </Box>
