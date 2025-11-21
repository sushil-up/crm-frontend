import * as Yup from "yup";
export const RegisterSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full Name is required")
    .min(5, "Minimum 5 characters are required")
    .max(25, "Maximum 25 characters are required"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter valid email ")
    .min(7, "Minimum 7 characters are required"),

  status: Yup.string().required("Status is required"),
  // password: Yup.string()
  //   .required("Please Provide a valid password")
  //   .min(6, "Minimum 6 characters are required")
  //   .max(15, "Maximum 15 characters are required"),
});


