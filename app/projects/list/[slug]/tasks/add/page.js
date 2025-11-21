"use client";
import moment from "moment";
import { useForm } from "react-hook-form";
import LayoutHeader from "@/app/layoutHeader";
import TaskService from "@/services/taskservice";
import { useContext, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import AddTaskForm from "@/components/forms/task/AddTaskForm";
import { TaskValidationSchema } from "@/components/validation/task-validation/Taskvalidation";
import UserContext from "@/context/UserContext";

function Addtasks({ params, handleCloseTaskModal, getAllTaskData }) {
  //PAGE TITLE
  useDocumentTitle("Add Task | Acewebx");
  const id = params.slug; // project id
  const [taskAssign, setTaskAssign] = useState();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(TaskValidationSchema),
  });

  const onSubmit = async (data) => {
    data.assigned_user = taskAssign;
    const originalStartDate = data.start_date;
    const startDate = moment(originalStartDate).format("YYYY-MM-DD"); // changing the start date format
    const originalEndDate = data.end_date;
    const endDate = moment(originalEndDate).format("YYYY-MM-DD"); // changing the end date format
    const addTaskData = {
      ...data,
      project_id: id,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      const result = await TaskService.postTask(addTaskData);
      successMsg(result.message);
      handleCloseTaskModal();

      reset();
      getAllTaskData();
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  //task assign handler
  const assignTaskHandler = (data) => {
    setTaskAssign(data.id);
  };
  const { setTitle } = useContext(UserContext);
  setTitle("Add New Task");
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center mt-2  "
      >
        <AddTaskForm
          control={control}
          errors={errors}
          handleChange={assignTaskHandler}
        />
      </form>
    </>
  );
}

export default Addtasks;
