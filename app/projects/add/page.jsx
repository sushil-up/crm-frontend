"use client";
// Import necessary libraries
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import ProjectService from "@/services/projectservice";
import { yupResolver } from "@hookform/resolvers/yup";
import { successMsg, errorMsg } from "@/app/toster-msg/msg";
import { useRouter } from "next/navigation";
import Loading from "@/app/users/loading";
import LayoutHeader from "@/app/layoutHeader";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { useSession } from "next-auth/react";
import AddProjectForm from "@/components/forms/project/AddProjectForm";
import { ProjectValidationSchema } from "@/components/validation/project-validation/projectFormValidation";
import { useUnsavedChangesWarning } from "@/app/utils/customhook/useUnsavedFormWarning";
import UserContext from "@/context/UserContext";
// Component for adding a new project
function ProjectAdd() {
  const session = useSession();
  const adminUser = session?.data?.user?.admin;
  const [loading, setLoading] = useState(false);
  const [pmId, setPmId] = useState();
  const { setTitle } = useContext(UserContext);
  //PAGE TITLE
  useDocumentTitle("Add Project | Acewebx");
  const router = useRouter();

  //Set up necessary hooks and methods for the form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(ProjectValidationSchema),
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  useUnsavedChangesWarning(formSubmitted, watch, isDirty);
  // Prepare the form data for submission
  const onSubmit = async (data) => {
    data.pm_id = pmId;
    const originalStartDate = data.start_date;
    const startDate = moment(originalStartDate).format("YYYY-MM-DD"); // changing the start date format
    const originalEndDate = data.end_date;
    let endDate;
    if (originalEndDate) {
      endDate = moment(originalEndDate["$d"]).format("YYYY-MM-DD");
    } else {
      endDate = startDate; // or handle the case accordingly
    }
    // create variable for date formate change add
    const addProjectData = {
      ...data,
      pm_id: data.pm_id,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      setFormSubmitted(true);
      setLoading(true);
      // Submit the form data  handle success and error cases
      const result = await ProjectService.projectRegister(addProjectData);
      successMsg(result.message);
      setLoading(false);
      router.push("/projects/list");
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  useEffect(() => {
    if (session) {
      if (adminUser && adminUser === "true") {
        router.push("/projects/add");
      } else {
        router.push("/projects/list");
      }
    }
  }, [session, adminUser, router]);

  // pm id handler
  const handlePmInputChange = (e) => {
    setPmId(e?.id);
  };
  
  setTitle("Add New Project");
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className=" mt-2  ">
        <AddProjectForm
          control={control}
          setValue={setValue}
          errors={errors}
          handleChange={handlePmInputChange}
        />
        {loading && <Loading />}
      </form>
    </>
  );
}

export default ProjectAdd;
