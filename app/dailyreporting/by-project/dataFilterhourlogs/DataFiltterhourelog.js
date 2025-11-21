"use client";
import React, { useEffect, useState } from "react";
import { errorMsg } from "@/app/toster-msg/msg";
import HourLogsService from "@/services/hourlogservice";
import { isBillableData } from "@/components/selectOptions/selectOptionObject";
import { Button, Grid } from "@mui/material";
import FormDatePickerRange from "@/components/share/forminputs/FormDatePickerRange";
import FormInputSelectAutoComplete from "@/components/share/forminputs/FormInputSelectAutoComplete";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";

function DataFiltter({ rhfSetValue, control, handleChange, defaultStartDate,
  defaultEndDate, }) {
  const [projectName, setProjectName] = useState([]);

  //get project list function
  const getProjectData = async () => {
    try {
      const projectData = await HourLogsService.getSelectProjects();
      setProjectName(projectData.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getProjectData(); // load project
  }, []);

  return (
    <>
     <div className="serachbar-background search-outer">     
      <Grid container spacing={2} className="flex !mt-0 !pt-0 !ml-0 !pr-4 !mb-4">
        <Grid item md={4} xs={6} className="">
          <FormDatePickerRange rhfSetValue={rhfSetValue} className='search-inner' defaultStartDate={defaultStartDate}
            defaultEndDate={defaultEndDate} />
        </Grid>
        <Grid item md={3} xs={6} className="!border-none pt-0">
          <FormInputSelectAutoComplete
            name="project_id"
            className="relative capitalize search-inner"
            control={control}
            label=" Project Name"
            options={projectName}
            handleChange={handleChange}
            inputValueCheck={false}

          />
        </Grid>
        <Grid item md={3} xs={6} className="!border-none">
          <FormInputSelect
            name="isBillable"
            label="HOUR LOGS"
            options={isBillableData}
            defaultValue={"3"}
            control={control}
          />
        </Grid>
        <Grid item md={2} xs={6} className="!border-none">
          <Button
            className="w-full h-full bg-theme-red !text-white !rounded-full !border-none font-semibold"
            variant="outlined"
            position="fixed"
            type="submit"
          >
            Search
          </Button>
        </Grid>
      </Grid></div>
 
    </>
  );
}
export default DataFiltter;
