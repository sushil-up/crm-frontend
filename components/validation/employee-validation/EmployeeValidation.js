import * as Yup from "yup";

export const EmployeeFormValidation = Yup.object().shape({
  select_employee: Yup.object().required("Please select Employee"),
  select_project: Yup.object().required("Please select Project"),


  feedback: Yup.string()
    .trim()
    .required("Please Enter Feedback")
    .test(
      "min-length",
      "Minimum 20 characters are required",
      (value) => value.replace(/\s+/g, "").length >= 20
    ),

  productivity_feedback: Yup.string()
    .trim()
    .required("Please Enter Feedback")
    .test(
      "min-length",
      "Minimum 10 characters are required",
      (value) => value.replace(/\s+/g, "").length >= 10
    ),

  communication_feedback: Yup.string()
    .trim()
    .required("Please Enter Feedback")
    .test(
      "min-length",
      "Minimum 10 characters are required",
      (value) => value.replace(/\s+/g, "").length >= 10
    ),

  problem_solving_feedback: Yup.string()
    .trim()
    .required("Please Enter Feedback")
    .test(
      "min-length",
      "Minimum 10 characters are required",
      (value) => value.replace(/\s+/g, "").length >= 10
    ),

  dependent_other_feedback: Yup.string()
    .trim()
    .required("Please Enter Feedback")
    .test(
      "min-length",
      "Minimum 10 characters are required",
      (value) => value.replace(/\s+/g, "").length >= 10
    ),

  communication: Yup.string().required("Select the rating"),

  dependent_on_other: Yup.string().required("Select the rating"),

  problem_solving: Yup.string().required("Select the rating"),

  productivity: Yup.string().required("Select the rating"),
});
