"use client";
// Import necessary libraries
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import TaskService from "@/services/taskservice";
import { useRouter } from "next/navigation";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import LayoutHeader from "@/app/layoutHeader";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import EditTaskForm from "@/components/forms/task/EditTaskForm";
import { TaskValidationSchema } from "@/components/validation/task-validation/Taskvalidation";
import UserContext from "@/context/UserContext";

// Component for a Addtasks
function TaskUpdate({ params }) {
  const [taskAssign, setTaskAssign] = useState();
  const [projectId, setProjectId] = useState();
  //PAGE TITLE
  useDocumentTitle("Update Task | Acewebx");
  // Get task id from parameters
  const taskId = params.taskId;

  // Define default form values
  const defaultValues = {
    title: "",
    description: "",
    status: "",
    client: "",
    start_date: "",
    assigned_user: "",
    end_date: "",
  };

  const router = useRouter(); // useRouter hooks for the redrect
  // Form setup using react-hook-form
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(TaskValidationSchema),
  });

  // Submit the form data  handle success and error cases
  const onSubmit = async (data) => {
    data.assigned_user = taskAssign;
    try {
      const result = await TaskService.updateTask(taskId, data);
      successMsg(result.message);
      router.push(`/projects/list/${projectId}/tasks`);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // Fetch task data by id
  const getTaskData = async () => {
    try {
      const result = await TaskService.getDataById(taskId);
      setProjectId(result.data.project_id);

      reset({
        ...result.data,
        assigned_user: result?.data?.assignedUser?.id,
        assigned_user: result?.data?.assignedUser?.title,
      });
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  //task assign handler
  const assignTaskHandler = (data) => {
    setValue("assigned_user", data);
    setTaskAssign(data.id);
  };
  // Fetch data on component mount
  useEffect(() => {
    getTaskData();
  }, []);
  const { setTitle } = useContext(UserContext);
  setTitle("Edit Task");
  return (
    <>
    
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center mt-2  "
      >
        <EditTaskForm
          control={control}
          errors={errors}
          handleChange={assignTaskHandler}
        />
      </form>
    </>
  );
}

export default TaskUpdate;
