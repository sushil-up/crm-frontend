import React, { useEffect, useState } from "react";
import { errorMsg } from "@/app/toster-msg/msg";
import FormInputSelectAutoComplete from "@/components/share/forminputs/FormInputSelectAutoComplete";
import HourLogsService from "@/services/hourlogservice";
import usersService from "@/services/usersService";
import { Box, Button, FormControl, Grid, Typography } from "@mui/material";
import RatingItems from "@/components/share/forminputs/rating";
import FormInput from "../share/forminputs/FormInput";
import FormRichTextEditor from "../share/forminputs/FormRichTextEditor";

const AddReview = ({
  rows,
  xs,
  className,
  error,
  handleUserChange,
  control,
  button,
  handleProjectIdchange,
  problemRate,
  productivityRate,
  communicationRate,
  dependRate,
  handleCommunication,
  handleDepend,
  handleProductivity,
  handleProblem,
}) => {
  const [employeeName, setEmployeeName] = useState([]);
  const [projectName, setProjectName] = useState([]);

  // Fetch employee data
  const getEmployeeData = async () => {
    try {
      const dataUser = await usersService.getSelectUsers();
      dataUser?.data.splice(0, 1); // Remove item at index 0 from API (All)
      setEmployeeName(dataUser?.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // Fetch project data
  const getProjectData = async () => {
    try {
      const dataUser = await HourLogsService.getSelectProjects();
      dataUser?.data.splice(0, 1); // Remove item at index 0 from API (All)
      setProjectName(dataUser?.data);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    getEmployeeData();
    getProjectData();
  }, []);
  return (
    <>
      <Box className="login_form  login-forsnap  w-full user-from-container p-14 !bg-[#FFFAFA] ">
        <div className="grid grid-cols-2 gap-4 mt-6 mb-9">
          <FormInputSelectAutoComplete
            errors={error}
            name="select_employee"
            control={control}
            label="Select Employee"
            options={employeeName}
            handleChange={handleUserChange}
            // inputValueCheck={employeeFieldValue == undefined ? true : false}
          />
          <FormInputSelectAutoComplete
            errors={error}
            name="select_project"
            control={control}
            label="Select Project"
            options={projectName}
            handleChange={handleProjectIdchange}
            // inputValueCheck={projectFieldValue == undefined ? true : false}
          />
        </div>
        <div className="mb-9">
          <FormRichTextEditor
           className="shadow-lg relative hoursDescription textEditrOuter "
            name="feedback"
            control={control}
            label="Feedback"
            errors={error}
          />
          {/* <FormInput
          
            multiline
            rows={rows}
            // inputValueCheck={clearValue}
          /> */}
          
        </div>
          <div className="text-2xl font-semibold ">
              Performance Rankings
            </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <RatingItems
                handleRating={handleProductivity}
                name="productivity"
                label="Productivity"
                control={control}
                errors={error}
              />
              {productivityRate ? (
                <Grid item xs={xs} className={className}>
                  <FormRichTextEditor
                    className="shadow-lg relative   w-full"
                    name="productivity_feedback"
                    control={control}
                    label="Productivity Feedback"
                    errors={error}
                  />
                </Grid>
              ) : (
                ""
              )}
            </div>
            <div>
              <RatingItems
                handleRating={handleCommunication}
                errors={error}
                name="communication"
                label="Communication"
                control={control}
              />
              {communicationRate ? (
                <Grid item xs={xs} className={className}>
                  <FormRichTextEditor
                    className="shadow-lg relative   w-full"
                    name="communication_feedback"
                    control={control}
                    label="Communication Feedback"
                    errors={error}
                  />
                </Grid>
              ) : (
                ""
              )}
            </div>
            <div>
              <RatingItems
                handleRating={handleProblem}
                errors={error}
                name="problem_solving"
                label="Problem Solving"
                control={control}
              />
              {problemRate ? (
                <Grid item xs={xs} className={className}>
                  <FormRichTextEditor
                    className="shadow-lg relative   w-full "
                    name="problem_solving_feedback"
                    control={control}
                    label="Problem Solving Feedback"
                    errors={error}
                  />
                </Grid>
              ) : (
                ""
              )}
            </div>
            <div>
              <RatingItems
                handleRating={handleDepend}
                name="dependent_on_other"
                errors={error}
                label="Dependability"
                control={control}
              />
              {dependRate ? (
                <Grid item xs={xs} className={className}>
                  <FormRichTextEditor
                    className="shadow-lg relative  "
                    name="dependent_other_feedback"
                    control={control}
                    label="Dependability Feedback"
                    errors={error}
                  />
                </Grid>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className=" mt-9">
        <FormControl fullWidth>
          <Button
            type="submit"
            className="!hover:bg-red-800 text-[18px] cursor-pointer h-14 w-48 bg-theme-red !rounded-full "
            variant="contained"
          >
            {button}
          </Button>
        </FormControl>
        </div>
      </Box>
    </>
  );
};

export default AddReview;
