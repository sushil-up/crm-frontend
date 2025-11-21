import * as Yup from "yup";

export const SignInSchemaValidation = Yup.object().shape({
  email: Yup.string()
    .email("Please enter valid email ")
    .required("Email is requied"),
  password: Yup.string()
    .required("Password is requied")
    .min(6, "Minimum 6 characters are required")
    .max(15, "Maximum 15 characters are required"),
});
