import * as Yup from "yup";

export const TaskValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Task Title is required")
    .min(5, "Minimum 5 characters are requied"),
  description: Yup.string().required("Task Description is required"),
  start_date: Yup.date().required("Task Start Date is required"),
  end_date: Yup.date().required("Task End Date is required"),
  assigned_user: Yup.object().required("Task Assign is required"),
  status: Yup.string().required("Task Status is required"),
});
