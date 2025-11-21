"use client";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import LayoutHeader from "@/app/layoutHeader";
import HourLogsService from "@/services/hourlogservice";
import moment, * as moments from "moment";
import TaskService from "@/services/taskservice";
import { useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import { useRouter } from "next/navigation";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { HoursFormValidation } from "@/components/validation/hours-validation/HoursFormValidation";
import AddHoursForm from "@/components/forms/hours/AddHoursForm";
import { useUnsavedChangesWarning } from "@/app/utils/customhook/useUnsavedFormWarning";
import UserContext from "@/context/UserContext";

function AddHourLogs() {
  const [otherId, setOtherId] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [projectId, setProjectId] = useState();
  const [loader, setLoader] = useState(false);
  useDocumentTitle("Add Hours | Acewebx");
  const session = useSession();
  const userId = session?.data?.user?.id;
  const router = useRouter();

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(HoursFormValidation),
    shouldUnregister: false,
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  useUnsavedChangesWarning(formSubmitted, watch, isDirty);
  const onSubmit = async (data) => {
    data.project_id = projectId;
    data.task_id = otherId;

    const addHoursData = {
      user_id: userId,
      hoursByTL: data.hoursByTL,
      project_id: projectId,
      task_id: otherId,
      date: data.date
        ? moments(new Date(data.date)).format("YYYY-MM-DD")
        : moments(new Date()).format("YYYY-MM-DD"),
      description: data.description,
      hours: `${data?.hours === "" ? 0 : data?.hours}${data.minutes ? `:${data.minutes}` : ""
        }`,
      is_billable: data.is_billable,
      nonBillableReason: data.nonBillableReason,
    };

    const addTasks = {
      description: data.description,
      end_date: moments(new Date()).format("YYYY-MM-DD"),
      project_id: projectId,
      start_date: moments(new Date()).format("YYYY-MM-DD"),
      status: "inProgress",
      title: data.other,
    };
    setLoader(true);
    try {
      setFormSubmitted(true); 

      if (otherId !== 9999) {
        const result = await HourLogsService.postHours(addHoursData);
        successMsg(result.message);
        router.push("/hourlogs/list");
      } else {
        const addTask = await TaskService.postTask(addTasks);
        setTaskId(addTask.data.id);
        if (addTask.data.id) {
          const addHoursData2 = {
            ...addHoursData,
            task_id: addTask.data.id,
          };
          const result = await HourLogsService.postHours(addHoursData2);
          successMsg(result.message);
          router.push("/hourlogs/list");
        }
      }
      reset();
    } catch (error) {
      errorMsg(error?.message);
    }finally{
      setLoader(false);
    }
  };

  useEffect(() => { }, [projectId, taskId, setTaskId]);

  const handlepProjectIdChange = (data) => {
    setProjectId(data?.id);
    setValue("project_id", data);
  };



  const handleTaskChange = (data) => {
    setOtherId(data?.value);
  };

    const {setTitle} = useContext(UserContext);
    setTitle("Add Hour Logs");
  return (
    <>
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center mt-2"
      >
        <AddHoursForm
          setValue={setValue}
          control={control}
          errors={errors}
          projectId={projectId}
          handlepProjectIdChange={handlepProjectIdChange}
          handleTaskChange={handleTaskChange}
          otherId={otherId}
          setOtherId={setOtherId}
          watch={watch}
          loader={loader}
        />
      </form>
  
    </>
  );
}
export default AddHourLogs;
