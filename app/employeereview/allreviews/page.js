"use client";
import LayoutHeader from "@/app/layoutHeader";
import { errorMsg, successMsg } from "@/app/toster-msg/msg";
import DeleteModal from "@/models/DeleteModal";
import EmployeeReview from "@/services/employeereview";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { yupResolver } from "@hookform/resolvers/yup";
import { EmployeeFormValidation } from "@/components/validation/employee-validation/EmployeeValidation";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import { useRouter } from "next/navigation";
import { Modal, Backdrop } from "@mui/material";
import { useSession } from "next-auth/react";
import EmployeeTable from "@/components/employee/employeeTable";
import AddReview from "@/components/employee/addReview";
import DescriptionModal from "@/models/DescriptionModal";
import OverallFeedbackModal from "@/models/OverallFeedbackModal";
import CommonTable from "@/components/CommonTable";
import { reviewColumn } from "./reviewColumn";
import UserContext from "@/context/UserContext";
const ViewAll = ({ idUser }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onchange",
    resolver: yupResolver(EmployeeFormValidation),
  });

  useDocumentTitle("All Reviews | Acewebx");
  const [id, setId] = useState();
  const [user, setUser] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0); // pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10); // rows per page state
  const [tableData, setTableData] = useState([]);
  const [totalEmployee, setTotalEmployee] = useState([]);
  const [loading, setLoading] = useState(true);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 25,
  });
  const router = useRouter();
  // handle user change
  const handleUserChange = (data) => {
    setUser(data);
    setValue("select_employee", data); // Update the form value
  };
  // handle project change
  const handleProjectIdchange = (data) => {
    setProjectId(data);
    setValue("select_project", data); // Update the form value
  };
  // modal box styling
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 900,
    maxHeight: "95vh",
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    overflowX: "hidden",
  };
  // fetch employee review data
  const fetchData = async () => {
    try {
      const response = await EmployeeReview.getEmployeeReview(
        controller.page,
        controller.rowsPerPage
      );

      setLoading(false);
      if (response.status === false) {
        router.push("/employeereview/addreview"); // Redirect if the fetch fails
      } else {
        if (response?.data?.employees?.length == undefined) {
          setController({
            ...controller,
            page: 0,
            rowsPerPage: 25,
          });
        }
      }
      setTableData(response.data.employees);
      setTotalEmployee(response.data.total);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchData(controller.page, controller.rowsPerPage);
  }, [controller, router, toggle]);

  // handle page change for table pagination
  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };
  // handle rowperpage change for table pagination
  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };
  // Delete modal open
  const handleClickOpen = (id) => {
    setId(id);
    setDeleteOpenModal(true);
  };
  // Handle close function for delete
  const deleteHandleModalClose = () => {
    setDeleteOpenModal(false);
  };
  // Delete table row data
  const onDelete = async () => {
    try {
      await EmployeeReview.deleteEmployeeById(id);
      fetchData(controller.page, controller.rowsPerPage);
      successMsg("Review deleted successfully");
      setToggle(!toggle);
    } catch (error) {
      errorMsg(storedData.message);
    }
    deleteHandleModalClose();
  };
  // handle close modal
  const handleClose = () => {
    setOpen(false);
    reset();
  };
  // Edit table data
  const handleEdit = async (id) => {
    try {
      const edit = await EmployeeReview.getEmployeeById(id);
      // Reset form with the fetched data
      reset(edit.data);
      setOpen(true);
      setId(id);
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // Update table data
  const handleUpdate = async (data) => {
    data.select_employee =
      user?.id !== null ? user?.id : data.select_employee.id;
    data.select_project =
      projectId?.id !== null ? projectId?.id : data.select_project.id;
    try {
      await EmployeeReview.updateEmployee(id, data);
      setOpen(false);
      successMsg("Review is updated successfully");
      setToggle(!toggle);
    } catch (error) {
      errorMsg(error.message);
    }
  };
  const routerall = useRouter();
  const { data: session } = useSession();
  const adminUser = session?.user?.admin;

  useEffect(() => {
    if (adminUser === "true") {
      router.push("/employeereview/allreviews");
    } else {
      routerall.replace("/dailyreporting/by-user");
    }
  }, [session, adminUser, routerall]);
  const processedTableData = tableData
    ?.map((item) => {
      const average =
        (parseInt(item.communication) +
          parseInt(item.dependent_on_other) +
          parseInt(item.problem_solving) +
          parseInt(item.productivity)) /
        4;

      return {
        ...item,
        average,
      };
    })
    ?.sort((a, b) => {
      const nameA = a.userName?.toUpperCase() || "";
      const nameB = b.userName?.toUpperCase() || "";
      return nameA.localeCompare(nameB);
    });

  const [readMoreModalOpen, setReadMoreModalOpen] = useState(false); // Modal open state
  const [modalOpen, setModalOpen] = useState(false); // Modal open state
  const [descriptionVal, setDescriptionVal] = useState();
  const [productivity, setProductivity] = useState();
  const [communication, setCommunication] = useState();
  const [dependentOther, setDependOther] = useState();
  const [problemSolving, setProblemSolving] = useState();
  const [dateTime, setDateTime] = useState();
  const [nonBillableReason, setNonBillableReason] = useState();
  const [isBillableReason, setIsBillableReason] = useState();
  const [avg, setAvg] = useState([]); // average state

  // feedback modal close
  const descriptionHandleModalClose = () => {
    setReadMoreModalOpen(false);
  };
  // Overall feedback modal close
  const feedbackHandleModalClose = () => {
    setModalOpen(false);
  };
  // Overall feedback handler
  const feedbackHandler = (
    productivity,
    dependentOther,
    communication,
    problemSolving,
    createdAt,
    nonReason,
    isBillable
  ) => {
    setModalOpen(true);
    setProductivity(productivity);
    setDependOther(dependentOther);
    setCommunication(communication);
    setProblemSolving(problemSolving);
    setDateTime(createdAt);
    setNonBillableReason(nonReason);
    setIsBillableReason(isBillable);
  };
  // Feedback handler
  const descriptionHandler = (
    description,
    createdAt,
    nonReason,
    isBillable
  ) => {
    setReadMoreModalOpen(true);
    setDescriptionVal(description);
    setDateTime(createdAt);
    setNonBillableReason(nonReason);
    setIsBillableReason(isBillable);
  };

  // Calculate average for rating
  useEffect(() => {
    if (tableData?.length > 0) {
      const averages = tableData.map((item) => {
        const sum =
          (parseInt(item.communication) +
            parseInt(item.dependent_on_other) +
            parseInt(item.problem_solving) +
            parseInt(item.productivity)) /
          4;
        return { sum, employee: item.select_employee };
      });
      setAvg(averages.map((a) => a.sum));
    } else {
      setAvg([]);
    }
  }, [tableData]);
  const itemCount = Array.isArray(totalEmployee)
    ? totalEmployee.length
    : totalEmployee;
  const { setTitle } = useContext(UserContext);
  setTitle("All Reviews");
  return (
    <>
      <CommonTable
        data={processedTableData}
        column={reviewColumn(
          descriptionHandler,
          session?.user?.id,
          adminUser,
          handleEdit,
          handleClickOpen,
          feedbackHandler
        )}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        controller={controller}
        userCount={itemCount}
        handlePageChange={handlePageChange}
      />

      <DeleteModal
        onDelete={onDelete}
        deleteMessage="Are you sure you want to delete this review?"
        deleteOpenModal={deleteOpenModal}
        deleteHandleModalClose={deleteHandleModalClose}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Box sx={style} className="overflow-y-scroll box-card">
          <div className="flex justify-between items-center  mb-3 border border-[#FFD4D4] bg-white rounded-[5px] w-full p-4 ">
            <LayoutHeader pageTitle="Edit Review" />
            <CloseIcon onClick={handleClose} className="cursor-pointer" />
          </div>
          <form
            onSubmit={handleSubmit(handleUpdate)}
            className="flex justify-center mt-8"
          >
            <AddReview
              communicationRate={true}
              dependRate={true}
              problemRate={true}
              productivityRate={true}
              rows={3.7}
              xs={12}
              // className="text-xl pt-5  max-w-full overflow-y-auto"
              setValue={setValue}
              watch={watch}
              error={errors}
              button="Update"
              control={control}
              idUser={idUser}
              handleUserChange={handleUserChange}
              handleProjectIdchange={handleProjectIdchange}
            />
          </form>
        </Box>
      </Modal>
      <DescriptionModal
        descriptionMessage="Review Feedback"
        descriptionHandleModalClose={descriptionHandleModalClose}
        readMoreModalOpen={readMoreModalOpen}
        descriptionVal={descriptionVal}
        dateTime={dateTime}
        nonBillableReason={nonBillableReason}
        isBillableReason={isBillableReason}
      />
      <OverallFeedbackModal
        descriptionMessage="Overall Feedback"
        feedbackHandleModalClose={feedbackHandleModalClose}
        modalOpen={modalOpen}
        productivity={productivity}
        problemSolve={problemSolving}
        dependOther={dependentOther}
        communication={communication}
        dateTime={dateTime}
        nonBillableReason={nonBillableReason}
        isBillableReason={isBillableReason}
      />
    </>
  );
};
export default ViewAll;
