"use client";
import React, { useState, useEffect } from "react";
import HourLogsService from "@/services/hourlogservice";
import { Button, Grid } from "@mui/material";
import FormDatePickerRange from "@/components/share/forminputs/FormDatePickerRange";
import FormInputSelectAutoComplete from "@/components/share/forminputs/FormInputSelectAutoComplete";
import { errorMsg } from "@/app/toster-msg/msg";
import moment from "moment";

export default function HoursFilter({
  rhfSetValue,
  handleChange,
  control,
  errors = "",
  defaultStartDate,
  defaultEndDate,
}) {
  const [projectOptions, setProjectOptions] = useState([]);

  const getProjectData = async () => {
    try {
      const projectData = await HourLogsService.getSelectProjects();
      setProjectOptions(projectData.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  useEffect(() => {
    getProjectData();
  }, []);

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
              defaultStartDate={defaultStartDate}
              defaultEndDate={defaultEndDate}
            />
          </Grid>
          <Grid item md={3} xs={6} className="pt-0">
            <FormInputSelectAutoComplete
              name="project_id"
              className="shadow-lg relative capitalize"
              control={control}
              label="Select Your Project"
              options={projectOptions}
              handleChange={handleChange}
              errors={errors}
              inputValueCheck={false}
            />
          </Grid>

          <Grid item md={2} xs={6}>
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
