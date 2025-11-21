"use client";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import LayoutHeader from "@/app/layoutHeader";
import HourLogsService from "@/services/hourlogservice";
import { useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import { useRouter } from "next/navigation";
import moment, * as moments from "moment";
import TaskService from "@/services/taskservice";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { HoursFormValidation } from "@/components/validation/hours-validation/HoursFormValidation";
import EditHoursForm from "@/components/forms/hours/EditHoursForm";
import UserContext from "@/context/UserContext";

export default function EditHour({ params }) {
  const [otherId, setOtherId] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  //PAGE TITLE
  useDocumentTitle("Edit Hours | Acewebx");
  const id = params.id; //hours id
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  // Form control initialization using react-hook-form
  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      description: "",
      project_id: "",
      hours: "",
      is_billable: "",
      nonBillableReason: "",
      task_id: null,
      otherField: "",
    },
    resolver: yupResolver(HoursFormValidation),
  });
  // Handle form submission
  const onSubmit = async (data) => {
    const addTasks = {
      description: data?.other,
      end_date: moments(new Date()).format("YYYY-MM-DD"),
      project_id: data?.project_id.value,
      start_date: moments(new Date()).format("YYYY-MM-DD"),
      status: "inProgress",
      title: data?.other,
    };
    try {
      setFormSubmitted(true);
      if (otherId !== 9999) {
        const addHoursData = {
          user_id: userId,
          hoursByTL: data?.hoursByTL,

          project_id: data.project_id.value,
          date: data.date
            ? moments(new Date(data.date)).format("YYYY-MM-DD")
            : moments(new Date()).format("YYYY-MM-DD"),
          task_id: data.task_id.value,
          description: data.description,
          hours: `${data?.hours === "" ? 0 : data?.hours}${
            data.minutes ? `:${data.minutes}` : ""
          }`,
          nonBillableReason: data.nonBillableReason,
          is_billable: data.is_billable,
        };
        const result = await HourLogsService.updateHours(id, addHoursData);
        successMsg(result.message);
        router.back();
        reset();
      } else {
        setFormSubmitted(true);
        const addTask = await TaskService.postTask(addTasks);
        if (addTask.data.id) {
          const addHoursData2 = {
            user_id: userId,
            hoursbyTL: data.hoursbyTL,
            project_id: data.project_id.value,
            task_id: addTask.data.id,
            date: data.date
              ? moments(new Date(data.date)).format("YYYY-MM-DD")
              : moments(new Date()).format("YYYY-MM-DD"),
            description: data.description,
            hours: `${data?.hours === "" ? 0 : data?.hours}${
              data.minutes ? `:${data.minutes}` : ""
            }`,
            is_billable: data.is_billable,
            nonBillableReason: data.nonBillableReason,
          };
          const result = await HourLogsService.updateHours(id, addHoursData2);
          successMsg(result.message);
          router.push("/hourlogs/list");
        }
      }
    } catch (error) {
      errorMsg(error?.message);
    } finally {
      setFormSubmitted(false); // Reset form submitted state
    }
  };

  //fetch all data  function
  const fetchData = async () => {
    try {
      const result = await HourLogsService.getHoursById(id);
      const data = result.data;
      const hourMinte = data.hours.split(":");
      const [hour, minute] = hourMinte;

      if (data.project) {
        setProjectId(data.project.id);
        reset({
          hoursByTL: data?.hoursByTL,
          description: data.description,
          project_id: {
            label: data.project.title,
            value: data.project.id,
          },
          hours: hour,
          nonBillableReason:
            data.nonBillableReason !== "null" ? data.nonBillableReason : "",
          minutes: minute,
          date: data.date
            ? moments(new Date(data.date)).format("YYYY-MM-DD")
            : moments(new Date()).format("YYYY-MM-DD"),
          is_billable: data.is_billable,
          task_id: {
            label: data.task.label,
            value: data.task.value,
          },
          otherField: data.otherField,
        });
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [id, reset]);

  // Event handler for project change
  const handlepProjectIdChange = (data) => {
    setValue("project_id", data);
    setValue("task_id", {
      id: 9999,
      title: "Select Your Task",
      label: "Select Your Task",
      value: 9999,
    });
    setProjectId(data.id);
  };

  // Event handler for task change
  const handleTaskChange = (data) => {
    setOtherId(data?.value);
    setValue("task_id", data);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const formValues = watch();
      const isFormEmpty =
        !formValues.project_id &&
        !formValues.description &&
        !formValues.hours &&
        !formValues.minutes &&
        !formValues.is_billable &&
        !formValues.nonBillableReason;

      if (!formSubmitted && isDirty && !isFormEmpty) {
        const message = "Are you sure you want to leave this page?";
        event.returnValue = message;
        return message;
      }
    };

    const handleRouteChange = (url) => {
      const formValues = watch();
      const isFormEmpty =
        !formValues.project_id &&
        !formValues.description &&
        !formValues.hours &&
        !formValues.minutes &&
        !formValues.is_billable &&
        !formValues.nonBillableReason;

      if (!formSubmitted && isDirty && !isFormEmpty) {
        const confirmation = window.confirm(
          "Are you sure you want to leave this page?"
        );
        if (!confirmation) {
          throw new Error("Route change aborted.");
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const originalPush = router.push;
    router.push = async (url, ...args) => {
      try {
        handleRouteChange(url);
        await originalPush(url, ...args);
      } catch (e) {}
    };

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.push = originalPush;
    };
  }, [router, formSubmitted, isDirty, watch]);
  const { setTitle } = useContext(UserContext);
  setTitle("Edit Hour Logs");

  return (
    <div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center mt-10"
      >
        <EditHoursForm
          control={control}
          errors={errors}
          projectId={projectId}
          handlepProjectIdChange={handlepProjectIdChange}
          handleTaskChange={handleTaskChange}
          otherId={otherId}
          watch={watch}
          setOtherId={setOtherId}
          setValue={setValue}
        />
      </form>
    </div>
  );
}
