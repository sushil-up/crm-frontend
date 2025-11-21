"use client";
import * as React from "react";
import Loading from "@/app/users/loading";
import { useEffect, useState } from "react";
import LayoutHeader from "../../layoutHeader";
import { Box, Button, Card, Link, Typography } from "@mui/material";
import { errorMsg, successMsg } from "../../toster-msg/msg";
import { useRouter } from "next/navigation";
import usersService from "@/services/usersService";
import useDocumentTitle from "../../utils/useDocumentTitle";
import { useSession } from "next-auth/react";
import DeleteModal from "@/models/DeleteModal";
import CommonTable from "@/components/CommonTable";
import { userColumn } from "./userColumn";
import UserContext from "@/context/UserContext";

function UserTable() {
  const [users, setUsers] = useState([]);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const [userid, setUserid] = useState("");
  const router = useRouter();
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 25,
  });
  const { setTitle } = React.useContext(UserContext);
  const { data: session } = useSession();
  const currentUser = session?.user?.id;
  const adminUser = session?.user?.admin;
  //PAGE TITLE
  useDocumentTitle("All Users | Acewebx");

  // To getting all users data
  const getAllUsers = async () => {
    try {
      const result = await usersService.getAllUsers(
        controller.page,
        controller.rowsPerPage
      );
      setLoading(false);
      if (result.status === false) {
        router.push("/auth/signin");
      } else {
        if (result.data.length == 0) {
          setController({
            ...controller,
            page: 0,
            rowsPerPage: 25,
          });
        }
        setUsers(result.data.users);
        setUserCount(result.data.totalCount);
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };

  // delete modal open
  const handleClickOpen = (id) => {
    setDeleteOpenModal(true);
    setUserid(id);
  };

  // handleclose function for delete
  const deleteHandleModalClose = () => {
    setDeleteOpenModal(false);
  };
  //get data on component mount
  useEffect(() => {
    getAllUsers();
  }, [controller]);

  // user delete function
  const onDelete = async () => {
    try {
      const result = await usersService.deleteUserById(userid);
      successMsg(result.message);
      getAllUsers();
    } catch (error) {
      errorMsg(error?.message);
    }
    deleteHandleModalClose();
  };

  // for next page pagination
  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  //pagination row handler
  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  // admin based condition
  const checkAdminHandler = async (user, status) => {
    const userString = user.toString();
    const adminUsers = "admin_users";
    const data = {
      option_name: adminUsers,
      option_value: [userString],
      status,
    };
    try {
      const result = await usersService.adminAdd(data);
      if (result.status === true) {
        successMsg(result.message);
        getAllUsers();
      }
    } catch (error) {
      errorMsg(error?.message);
    }
  };
  setTitle("All Users");
  return (
    <>
      <Card className="bg-white shadow-2xl">
        {loading && <Loading />}
        <CommonTable
          data={users}
          column={userColumn(
            currentUser,
            adminUser,
            handleClickOpen,
            checkAdminHandler,
            session
          )}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          controller={controller}
          userCount={userCount}
          handlePageChange={handlePageChange}
        />
      </Card>

      <DeleteModal
        onDelete={onDelete}
        deleteMessage="Are you sure you want to delete this user?"
        deleteOpenModal={deleteOpenModal}
        deleteHandleModalClose={deleteHandleModalClose}
      />
    </>
  );
}
export default UserTable;
