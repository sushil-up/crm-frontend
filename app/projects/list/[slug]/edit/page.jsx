"use client";
// Import necessary libraries
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import LayoutHeader from "@/app/layoutHeader";
import Loading from "@/app/users/loading";
import moment from "moment";
import ProjectService from "@/services/projectservice";
import { yupResolver } from "@hookform/resolvers/yup";
import { successMsg, errorMsg } from "@/app/toster-msg/msg";
import { useRouter } from "next/navigation";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { useSession } from "next-auth/react";
import EditProjectForm from "@/components/forms/project/EditProjectForm";
import { ProjectValidationSchema } from "@/components/validation/project-validation/projectFormValidation";
import UserContext from "@/context/UserContext";

// Component for editing a project
export default function EditProject({ params }) {
  const [loading, setLoading] = useState(false);
  const [pmId, setPmId] = useState();
  //PAGE TITLE
  useDocumentTitle("Edit Project | Acewebx");
  const session = useSession();
  const currentUser = session?.data?.user?.id;
  const adminUser = session?.data?.user?.admin;

  // Get the  project ID from params
  const id = params.slug;
  // Define default form values
  const defaultValues = {
    title: "",
    description: "",
    status: "",
    client: "",
    start_date: "",
    pm_id: "",
    end_date: "",
  };
  const router = useRouter();

  // Set up necessary hooks and methods for the form
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(ProjectValidationSchema),
  });

  const onSubmit = async (data) => {
    // Prepare the form data for submission
    const originalStartDate = data.start_date;
    const startDate = moment(originalStartDate).format("YYYY-MM-DD"); // changing the start date format
    const originalEndDate = data.end_date;
    const endDate = moment(originalEndDate["$d"]).format("YYYY-MM-DD"); // changing the end  date format

    // create variable for date formate change add
    const addProjectData = {
      ...data,
      pm_id: pmId,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      // Submit the form data and handle success and error cases
      const result = await ProjectService.updateProject(id, addProjectData); //for updating
      reset();
      successMsg(result.message);
      router.push("/projects/list");
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const result = await ProjectService.getProjectsById(id);
      const data = result.data;
      setLoading(false);
      reset({
        ...data,
        pm_id: {
          id: data.pm.id,
          title: data.pm.title,
          label: data.pm.title,
          value: data.pm.id,
        },
      });
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  useEffect(() => {
    // Fetch the project details by ID
    const fetchData = async () => {
      try {
        if (currentUser !== undefined) {
          if (adminUser == "true") {
            await fetchProject();
          } else {
            router.push("/projects/list");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [id, reset, , currentUser]);

  // pm id handler
  const handlePmInputChange = (e) => {
    setValue("pm_id", e);
    setPmId(e?.id);
  };
  const { setTitle } = useContext(UserContext);
  setTitle("Edit Project");
  return (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)} className=" mt-2  ">
        <EditProjectForm
          control={control}
          handleChange={handlePmInputChange}
          errors={errors}
        />
      </form>
    </>
  );
}
