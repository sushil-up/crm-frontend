import * as Yup from "yup";

export const NotesValidationSchema = Yup.object().shape({
  description: Yup.string()
    .trim() // Trim leading and trailing whitespaces
    .min(3, "Minimum 3 characters are required")
    .matches(/\S/, "Description should not be only blank spaces"),
});
