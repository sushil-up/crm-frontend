"use client";
import React, { useEffect, useState } from "react";
import { errorMsg } from "@/app/toster-msg/msg";
import usersServie from "@/services/usersService";
import { isBillableData } from "@/components/selectOptions/selectOptionObject";
import FormDatePickerRange from "@/components/share/forminputs/FormDatePickerRange";
import { Button, Grid } from "@mui/material";
import FormInputSelectAutoComplete from "@/components/share/forminputs/FormInputSelectAutoComplete";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";

function DataFiltter({
  idUser,
  rhfSetValue,
  handleChange,
  control,
  defaultStartDate,
  defaultEndDate,
}) {
  const [userName, setUserName] = useState([]);

  //get user list data
  const getUserData = async () => {
    try {
      const dataUser = await usersServie.getSelectUsers();
      setUserName(dataUser?.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  useEffect(() => {
    getUserData();
  }, [idUser]);

  return (
    <>
      <div className="serachbar-background search-outer">
        <Grid
          container
          spacing={2}
          className="flex !mt-0 !pt-0 !ml-0 !pr-4 !mb-4"
        >
          <Grid item md={4} xs={6} className="">
            <FormDatePickerRange
              rhfSetValue={rhfSetValue}
              className="search-inner"
              defaultStartDate={defaultStartDate}
              defaultEndDate={defaultEndDate}
            />
          </Grid>

          <Grid item md={3} xs={6} className="pt-0">
            <FormInputSelectAutoComplete
              name="user_id"
              className="!bg-white !border-none !rounded-full search-inner"
              control={control}
              label=" User Name"
              options={userName}
              handleChange={handleChange}
              inputValueCheck={false}
              defaultValue={idUser}
            />
          </Grid>

          <Grid item md={3} xs={6} className="!rounded-full !border-none">
            <FormInputSelect
              name="isBillable"
              label="HOUR LOGS"
              options={isBillableData}
              control={control}
            />
          </Grid>

          <Grid item md={2} xs={6} className="">
            <Button
              className="w-full h-full bg-theme-red !text-white !rounded-full !border-none font-semibold"
              variant="outlined"
              position="fixed"
              type="submit"
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
export default DataFiltter;
