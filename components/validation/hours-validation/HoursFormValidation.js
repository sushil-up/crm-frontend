import * as Yup from "yup";

export const HoursFormValidation = Yup.object().shape({
  project_id: Yup.object().required("Project is required"),
  task_id: Yup.object().required("Task is required"),
  description: Yup.string().required("Description is required").min(20).trim(),
  is_billable: Yup.string().required("Is Billable is required"),
  hours: Yup.string().required("Hours is required"),
  nonBillableReason: Yup.string()
    .test({
      name: "nonBillableReason",
      test: function (value) {
        // Check if is_billable is "false" and nonBillableReason is not provided
        return this.resolve(Yup.ref("is_billable")) === "false"
          ? !!value
          : true;
      },

      message: "Non Billable Reason is required",
    })
    .trim(),
});
