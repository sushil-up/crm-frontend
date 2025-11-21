"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import useLocalStorage from "use-local-storage";
import LayoutHeader from "@/app/layoutHeader";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import AddReview from "@/components/employee/addReview";
import { EmployeeFormValidation } from "@/components/validation/employee-validation/EmployeeValidation";
import EmployeeReview from "@/services/employeereview";
import { useUnsavedChangesWarning } from "@/app/utils/customhook/useUnsavedFormWarning";
import UserContext from "@/context/UserContext";

const AddNew = ({ idUser }) => {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [projectId, setProjectId] = useState("");
  const [communicationRate, setCommunicationRate] = useState(true);
  const [productivityRate, setProductivityRate] = useState(true);
  const [dependRate, setDependRate] = useState(true);
  const [problemRate, setProblemRate] = useState(true);
  const [values, setValues] = useLocalStorage("data", []);
  const [employeeData, setEmployeeData] = useState();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(EmployeeFormValidation),
  });

  useDocumentTitle("Add Review | Acewebx");

  const { data: session } = useSession();
  const adminUser = session?.user?.admin;

  useEffect(() => {
    if (adminUser === "true") {
      router.push("/employeereview/addreview");
    } else {
      router.replace("/dailyreporting/by-user");
    }
  }, [adminUser, router]);

  useUnsavedChangesWarning(formSubmitted, watch, isDirty);

  const handleProductivity = () => setProductivityRate(true);
  const handleCommunication = () => setCommunicationRate(true);
  const handleDepend = () => setDependRate(true);
  const handleProblem = () => setProblemRate(true);

  const onSubmit = async (data) => {
    data.select_employee = user;
    data.select_project = projectId;
    try {
      setFormSubmitted(true);
      const response = await EmployeeReview.addEmployee(data);
      setEmployeeData(response?.data);
      if (response?.data) {
        const newData = [...values, data];
        setValues(newData);
        successMsg("Review added successfully");
        router.push("/employeereview/allreviews");
        reset();
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  const handleUserChange = (data) => {
    setUser(data?.id);
    setValue("select_employee", data?.id);
  };

  const handleProjectIdchange = (data) => {
    setProjectId(data?.id);
    setValue("select_project", data?.id);
  };

  // confirmation message :)
  const { setTitle } = useContext(UserContext);
  setTitle("Add Review");
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center mt-2"
      >
        <AddReview
          xs={6}
          rows={3.6}
          className="pt-5 max-w-full overflow-y-auto"
          setValue={setValue}
          watch={watch}
          error={errors}
          button="Submit"
          control={control}
          idUser={idUser}
          handleUserChange={handleUserChange}
          handleProjectIdchange={handleProjectIdchange}
          handleCommunication={handleCommunication}
          handleDepend={handleDepend}
          handleProductivity={handleProductivity}
          handleProblem={handleProblem}
          problemRate={problemRate}
          productivityRate={productivityRate}
          communicationRate={communicationRate}
          dependRate={dependRate}
        />
      </form>
    </>
  );
};

export default AddNew;
