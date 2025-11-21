import { statusOption } from "@/components/selectOptions/selectOptionObject";
import FormInput from "@/components/share/forminputs/FormInput";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";
import { Button, FormControl, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function EditUserForm({
  control,
  errors,
  register,
  fileHandler,
  profileImage,
  watch,
  filePath,
}) {
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

          <div>
            <FormControl fullWidth>
              <label className="">Upload Your Image</label>
              <input
                type="file"
                {...register("profile_image")}
                onChange={(e) => fileHandler(e)}
              />
              <div className="mt-2">
                {filePath ? (
                  <>
                    {" "}
                    <img
                      src={filePath}
                      alt="New Profile"
                      className="h-32 w-32  "
                    />
                  </>
                ) : (
                  <>
                    {" "}
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-32 w-32  "
                    />
                  </>
                )}
              </div>
            </FormControl>
          </div>
        </div>

        <div className="pl-14 pb-14">
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
