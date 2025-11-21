"use client";
import React, { useState, useEffect, useContext } from "react";
import Loading from "@/app/users/loading";
import { errorMsg } from "@/app/toster-msg/msg";
import LayoutHeader from "@/app/layoutHeader";
import Link from "next/link";
import { Box, Button, Card, Typography } from "@mui/material";
import ProjectService from "@/services/projectservice";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import useDocumentTitle from "@/app/utils/useDocumentTitle";
import ProjectFilter from "../projectFilter/ProjectFilter";
import CommonTable from "@/components/CommonTable";
import { projectColumn } from "./projectColumn";
import DeleteModal from "@/models/DeleteModal";
import UserContext from "@/context/UserContext";

function AllProject() {
  const router = useRouter();
  //for get query param from url
  const searchParams = useSearchParams();
  const projectQuery = searchParams.get("status");
  useDocumentTitle("All Projects | Acewebx");
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 25,
  });
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [filters, setFilters] = useState({
    status: projectQuery ? projectQuery : "active",
  });
  const session = useSession();
  const currentUser = session?.data?.user?.id;
  const adminUser = session?.data?.user?.admin;

  // Form control initialization using react-hook-form
  const { handleSubmit, control, setValue } = useForm();

  const getAllProjectData = async (page, rowPerPage, filters) => {
    try {
      setLoading(true);

      const result = await ProjectService.getAllProject(
        page,
        rowPerPage,
        filters
      );
      if (result.data.length === 0 && controller.page !== 0) {
        setController({
          ...controller,
          page: 0,
          rowsPerPage: 25,
        });
      }

      setProjectList(result?.data);
      setProjectCount(result.data.totalCount);
      setLoading(false);
    } catch (error) {
      errorMsg(error?.message);
      setLoading(false);
    }
  };

  //pagination  handler
  const handlePageChangePagination = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  //handle ChangeRowsPerPage
  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  //filter handler
  const onSubmit = async (data) => {
    setLoading(true);
    setController({
      ...controller,
      page: 0,
      rowsPerPage: 25,
    });
    let filterData = {
      status: data.status,
    };
    const queryString = new URLSearchParams(filterData).toString();
    setFilters(filterData);
    setLoading(false);

    router.push(`/projects/list?${queryString}`);
    getAllProjectData(controller.page, controller.rowsPerPage, filterData);
  };
  //get data on component mount
  useEffect(() => {
    getAllProjectData(controller.page, controller.rowsPerPage, filters);
  }, [controller, filters]);

  useEffect(() => {
    setFilters({ status: projectQuery || "active" });
  }, [projectQuery]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);

  // delete project handler
  const onDelete = async () => {
    try {
      const result = await ProjectService.deleteProjectsById(deleteId);
      deleteHandleModalClose();
      successMsg(result.message);
      getAllProjectData(page, rowPerPage, filters);
    } catch (error) {
      errorMsg(error);
    }
  };

  //project delete modal open
  const handleProjectDelete = (id) => {
    setDeleteId(id);
    setDeleteOpenModal(true);
  };

  // project  delete modal close
  const deleteHandleModalClose = () => {
    setDeleteOpenModal(false);
  };
  const { setTitle } = useContext(UserContext);
  setTitle("     All Projects");
  return (
    <>
      {/* <Box className="flex mb-3 border border-[#FFD4D4] bg-white rounded-[5px] w-full p-4">
        <LayoutHeader pageTitle="All Projects" />
        {currentUser !== undefined &&
          adminUser?.includes(currentUser.toString()) && (
            <Box
              className="ml-auto"
              sx={{
                width: 180,
              }}
            >
              <Link href="/projects/add" className="!no-underline">
                <Button className="!text-white hover:!bg-red-800 !rounded-full !bg-theme-red !py-2 !px-4">
                  Add New Project
                </Button>
              </Link>
            </Box>
          )}
      </Box> */}

      <form onSubmit={handleSubmit(onSubmit)} className=" mb-5">
        <ProjectFilter control={control} filters={filters} />
      </form>

      <Card className="bg-white shadow-2xl">
        {loading && <Loading />}

        <CommonTable
          data={projectList?.projects}
          column={projectColumn(
            currentUser,
            adminUser,
            handleProjectDelete,
            session
          )}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          controller={controller}
          userCount={projectCount}
          handlePageChange={handlePageChangePagination}
        />
      </Card>
      <DeleteModal
        onDelete={onDelete}
        deleteMessage="Are you sure you want to delete this project?"
        deleteOpenModal={deleteOpenModal}
        deleteHandleModalClose={deleteHandleModalClose}
      />
    </>
  );
}

export default AllProject;
