import { statusOption } from "@/components/selectOptions/selectOptionObject";
import FormInput from "@/components/share/forminputs/FormInput";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";
import { Button, FormControl, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

function AddUserForm({ control, errors, register, fileHandler }) {
  return (
    <>
      <Box className="login-form-wrapper !bg-[#FFFAFA] ">
        <div className="p-14 grid grid-cols-3 gap-12">
          <FormInput
            className="shadow-lg relative "
            inputType="text"
            name="full_name"
            control={control}
            errors={errors}
            label="Full Name"
            // placeholder="Full Name"
          />
          <FormInput
            className="shadow-lg relative"
            inputType="email"
            name="email"
            control={control}
            label="Email"
            // placeholder='Email'
            errors={errors}
          />
          <FormInput
            className="shadow-lg relative"
            inputType="password"
            name="password"
            control={control}
            label="Password"
            //  placeholder='Password'
            errors={errors}
          />

          <FormInput
            className="shadow-lg relative"
            inputType="text"
            name="phone"
            control={control}
            label="Phone No"
            // placeholder='Phone No'
            errors={errors}
          />

          <FormInputSelect
            className="shadow-lg relative"
            name="status"
            control={control}
            label="Status"
            // placeholder='Status'
            options={statusOption}
            value={statusOption || ""}
            errors={errors}
          />

          <FormInput
            className="shadow-lg relative"
            inputType="text"
            name="slack_id"
            control={control}
            errors={errors}
            label="Slack Id"
            // placeholder='Slack Id'
          />

          <FormControl fullWidth>
            <label className="">Upload Your Image</label>
            <input
              type="file"
              {...register("profile_image")}
              onChange={(e) => fileHandler(e)}
            />
          </FormControl>
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

export default AddUserForm;

{
  /* <Box className="login_form  w-full user-from-container ">
<Grid container spacing={2} className=" flex justify-center m-0 w-full !bg-[#FFFAFA] ">
    <Box className="login-form-wrapper  py-5 px-2  width-400 flex  flex-row flex-wrap w-full  custom-shadow rounded-md">
        <Grid item md={6} xs={12} className="pt-4 px-2 pb-4 input-outer">
            <FormInput
                className="shadow-lg relative "
                inputType="text"
                name="full_name"
                control={control}
                errors={errors}
                label="Full Name"
                // placeholder="Full Name"
            />
        </Grid>

         <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
            <FormInput
                className="shadow-lg relative"
                inputType="email"
                name="email"
                control={control}
                label="Email"
                // placeholder='Email'
                errors={errors}
            />
        </Grid>
        <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
            <FormInput
                className="shadow-lg relative"
                inputType="password"
                name="password"
                control={control}
                label="Password"
                //  placeholder='Password'
                errors={errors}
            />
        </Grid>
        <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
            <FormInput
                className="shadow-lg relative"
                inputType="text"
                name="phone"
                control={control}
                label="Phone No"
                // placeholder='Phone No'
                errors={errors}
            />
        </Grid>
        <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
            <FormInputSelect
                className="shadow-lg relative"
                name="status"
                control={control}
                label="Status"
                // placeholder='Status'
                options={statusOption}
                value={statusOption || ""}
                errors={errors}
            />
        </Grid>
        <Grid item md={6} xs={12} className="pt-4 px-2 pb-4">
            <FormInput
                className="shadow-lg relative"
                inputType="text"
                name="slack_id"
                control={control}
                errors={errors}
                label="Slack Id"
                // placeholder='Slack Id'
            />
        </Grid>
        <Grid item md={6} xs={6} className="!pt-4 !pb-4 ">
            <FormControl fullWidth>
                <label className="">Upload Your Image</label>
                <input
                    type="file"
                    {...register("profile_image")}
                    onChange={(e) => fileHandler(e)}
                />
            </FormControl>
        </Grid>
        <Grid item md={12} xs={12} className="pt-4 px-2">
            <FormControl fullWidth>
                <Button
                    type="submit"
                    className="!hover:bg-red-800 cursor-pointer w-36 bg-theme-red !rounded-full "
                    variant="contained"
                >
                    submit
                </Button>
            </FormControl>
        </Grid>
    </Box>
</Grid>
</Box> */
}
