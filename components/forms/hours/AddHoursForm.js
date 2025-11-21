"use client";
import { errorMsg } from "@/app/toster-msg/msg";
import {
  billableOptions,
  NewhoursOptions,
  NewhoursOptionsByTl,
} from "@/components/selectOptions/selectOptionObject";
import FormInput from "@/components/share/forminputs/FormInput";
import FormInputSelect from "@/components/share/forminputs/FormInputSelect";
import FormInputSelectAutoComplete from "@/components/share/forminputs/FormInputSelectAutoComplete";
import FormMobileDatePicker from "@/components/share/forminputs/FormMobileDatePicker";
import FormRichTextEditor from "@/components/share/forminputs/FormRichTextEditor";
import HourLogsService from "@/services/hourlogservice";
import { Button, CircularProgress, FormControl, Grid } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function AddHoursForm({
  control,
  errors,
  projectId,
  handlepProjectIdChange,
  handleTaskChange,
  otherId,
  setOtherId,
  watch,
  setValue,
  loader,
}) {
  let isBillableFilter = watch("is_billable");
  const hourWatch = watch("hours");
  useEffect(() => {
    if (isBillableFilter == true) {
      setValue("hoursByTL", hourWatch);
    } else {
      setValue("hoursByTL", "");
    }
  }, [isBillableFilter, hourWatch]);
  const [projectData, setProjectData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [clearValue, setClearValue] = useState(false);
  const session = useSession();

  // Function to get project data
  const getProjectData = async () => {
    try {
      const projectData = await HourLogsService.getSelectProjects();
      projectData.data.splice(0, 1);
      setProjectData(projectData.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // Function to get task data for a given project
  const getTaskData = async (projectId) => {
    try {
      const taskResult = await HourLogsService.getSelectTasks(projectId);
      const transformedTaskData = taskResult.data.map((task) => ({
        label: task.title,
        value: task.id,
      }));

      transformedTaskData.splice(0, 1);
      setTaskData(transformedTaskData);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getProjectData(); //Fetching project data on component mount
    if (projectId) {
      getTaskData(projectId); // Fetching task data if projectId exists
      setClearValue(false);
    }
  }, [projectId]);
  // -----------------------------------------------------------------------------------

  const projectFieldValue = watch("project_id");
  const taskFieldValue = watch("task_id");
  useEffect(() => {
    if (projectFieldValue == null && projectFieldValue !== undefined) {
      setTaskData([]);
      setClearValue(true);
      setOtherId("");
    }
    setClearValue(true);
  }, [projectFieldValue]);

  useEffect(() => {
    if (taskFieldValue !== undefined || taskFieldValue !== null) {
      setClearValue(false);
    }
    setValue("other", "");
  }, [taskFieldValue]);

  return (
    <>
      <Box className="login_form  w-full user-from-container">
        <Grid
          container
          spacing={4}
          className="px-5  flex justify-center mb-10  pr-0"
        >
          <Box className="login-form-wrapper login-form-user border-stone-300 !bg-[#FFFAFA] py-5 px-4 backgrougColorWhite width-400 flex justify-center flex-row flex-wrap w-full  custom-shadow rounded-md ">
            <Grid item md={6} xs={6} className="pt-4 px-2 pb-4 ">
              <FormInputSelectAutoComplete
                name="project_id"
                className="shadow-lg relative capitalize"
                control={control}
                label="Select Your Project"
                options={projectData}
                errors={errors}
                value={projectId}
                handleChange={handlepProjectIdChange}
                inputValueCheck={false}
              />
            </Grid>
            <Grid item md={6} xs={6} className="pt-4 px-2 pb-4">
              <FormInputSelectAutoComplete
                name="task_id"
                className="shadow-lg relative capitalize"
                control={control}
                label="Select Your Task"
                options={taskData}
                errors={errors}
                handleChange={handleTaskChange}
                inputValueCheck={clearValue}
              />
            </Grid>

            {/* include otherfield */}
            {otherId == 9999 && (
              <Grid item md={12} xs={12} className="pb-3 px-2">
                <FormInput
                  className="shadow-lg relative"
                  name="other"
                  control={control}
                  label="Other"
                  errors={errors}
                  multiline
                />
              </Grid>
            )}
            <Grid
              item
              md={session && session?.data?.user?.admin == "true" ? 4 : 6}
              xs={12}
              className="pt-1 px-2 pb-5"
            >
              <FormInputSelect
                name="is_billable"
                label="Is Billable"
                options={billableOptions}
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid
              item
              md={session && session?.data?.user?.admin == "true" ? 4 : 6}
              xs={12}
              className="pt-1 px-2 pb-5"
            >
              <FormInputSelect
                className="shadow-lg relative"
                name="hours"
                control={control}
                label="Hours"
                options={NewhoursOptions}
                errors={errors}
              />
            </Grid>
            {session && session?.data?.user?.admin == "true" && (
              <Grid item md={4} xs={12} className="pt-1 px-2 pb-5">
                <FormInputSelect
                  className="shadow-lg relative"
                  name="hoursByTL"
                  control={control}
                  label="Hours by Team Leader"
                  options={NewhoursOptionsByTl}
                  errors={errors}
                />
              </Grid>
            )}

            {/* <Grid item md={4} xs={12} className="pt-1 px-2 pb-5">
              <FormInputSelect
                className="shadow-lg relative"
                name="minutes"
                control={control}
                label="Minutes"
                options={minutesOptions}
                errors={errors}
              />
            </Grid> */}

            {isBillableFilter !== undefined && isBillableFilter == false && (
              <Grid item md={12} xs={12} className="pt-4 px-2 pb-4">
                <FormInput
                  className="relative reason"
                  name="nonBillableReason"
                  control={control}
                  label="Non Billable Reason"
                />
                {errors?.["nonBillableReason"] && (
                  <span className="text-red-600 text-xs">
                    {errors["nonBillableReason"]?.message}
                  </span>
                )}
              </Grid>
            )}

            <Grid item md={12} xs={12} className="pt-5 px-2 pb-4">
              <FormMobileDatePicker
                className=" relative"
                name="date"
                control={control}
                errors={errors}
                required={true}
                defaultValue={dayjs(new Date())}
                label="Enter Hours  Date"
                inputFormat="YYYY-MM-DD"
              />
            </Grid>

            <Grid
              item
              xl={12}
              lg={12}
              md={12}
              xs={12}
              className="pt-5 px-2 pb-4"
            >
              <FormRichTextEditor
                className="shadow-lg relative hoursDescription textEditrOuter "
                name="description"
                control={control}
                label="Description"
                errors={errors}
              />
            </Grid>

            <Grid item md={12} xs={12} className="pt-4 px-2 ">
              <FormControl fullWidth>
                {loader ? (
                  <Box sx={{ display: "flex" }} className="justify-center">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Button
                    type="submit"
                    className="!hover:bg-red-800 text-[18px] cursor-pointer h-16 w-48 bg-theme-red !rounded-full "
                    variant="contained"
                  >
                    submit
                  </Button>
                )}
              </FormControl>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
