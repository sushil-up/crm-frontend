"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { userLinkSend } from "../app/users/list/[edit]/page";
import Link from "next/link";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import ReviewsOutlinedIcon from "@mui/icons-material/ReviewsOutlined";

import React, { useEffect, useState } from "react";
import { AppBar, CssBaseline, Toolbar } from "@mui/material";
import Nav from "./Nav";
import { Box } from "@mui/system";
import LayoutHeader from "@/app/layoutHeader";
import Footer from "./Footer";

export default function SideMenuBar({ children }) {
  const pathName = usePathname();
  const session = useSession();
  const adminUser = session?.data?.user?.admin;
  const [collapsed, setCollapsed] = useState(false);
  const userLinkData = userLinkSend.userLink();
  const [open, setOpen] = useState(null);

  const navDetails =
    adminUser === "true"
      ? [
          {
            Title: "Users",
            icon: <PeopleOutlineOutlinedIcon />,
            key: "users",
            paths: ["/users/add", "/users/list", userLinkData],
            children: [
              { Title: "Add User", path: "/users/add" },
              { Title: "All Users", path: "/users/list" },
            ],
          },
          {
            Title: "Project",
            icon: <AccountTreeOutlinedIcon />,
            key: "project",
            paths: ["/projects/add", "/projects/list"],
            children: [
              { Title: "Add New Project", path: "/projects/add" },
              { Title: "All Projects", path: "/projects/list" },
            ],
          },
          {
            Title: "Hour Log",
            icon: <WorkHistoryOutlinedIcon />,
            key: "hourlog",
            paths: ["/hourlogs/add", "/hourlogs/list"],
            children: [
              { Title: "Add Hour Logs", path: "/hourlogs/add" },
              { Title: "All Hour Logs", path: "/hourlogs/list" },
            ],
          },
          {
            Title: "Reporting",
            icon: <ReportOutlinedIcon />,
            key: "reporting",
            paths: [
              "/dailyreporting/by-project",
              "/dailyreporting/by-user",
              "/graphrecord",
            ],
            children: [
              {
                Title: "All Hours By Project",
                path: "/dailyreporting/by-project",
              },
              { Title: "All Hours By User", path: "/dailyreporting/by-user" },
              { Title: "Graph Record", path: "/graphrecord" },
            ],
          },
          {
            Title: "Employee Review",
            icon: <ReviewsOutlinedIcon />,
            key: "review",
            paths: ["/employeereview/addreview", "/employeereview/allreviews"],
            children: [
              { Title: "Add Review", path: "/employeereview/addreview" },
              { Title: "All Reviews", path: "/employeereview/allreviews" },
            ],
          },
        ]
      : [
          {
            Title: "Project",
            icon: <AccountTreeOutlinedIcon />,
            key: "project",
            paths: ["/projects/list"],
            children: [{ Title: "All Projects", path: "/projects/list" }],
          },
          {
            Title: "Hour Log",
            icon: <WorkHistoryOutlinedIcon />,
            key: "hourlog",
            paths: ["/hourlogs/add", "/hourlogs/list"],
            children: [
              { Title: "Add Hour Logs", path: "/hourlogs/add" },
              { Title: "All Hour Logs", path: "/hourlogs/list" },
            ],
          },
          {
            Title: "Reporting",
            icon: <ReportOutlinedIcon />,
            key: "reporting",
            paths: [
              "/dailyreporting/by-project",
              "/dailyreporting/by-user",
              "/graphrecord",
            ],
            children: [
              {
                Title: "All Hours By Project",
                path: "/dailyreporting/by-project",
              },
              { Title: "All Hours By User", path: "/dailyreporting/by-user" },
              { Title: "Graph Record", path: "/graphrecord" },
            ],
          },
        ];

  // Automatically open the parent menu whose child is active
  useEffect(() => {
    const matched = navDetails.find((item) =>
      item.children.some((child) => pathName.startsWith(child.path))
    );
    if (matched) {
      setOpen(matched.key);
      localStorage.setItem("menu", matched.key);
    }
  }, [pathName, adminUser]);

  const isActive = (path) =>
    pathName.startsWith(path) ? "text-red-500 font-semibold" : "text-white";

  const handleOpenSubMenu = (key) => {
    setOpen((prev) => (prev === key ? null : key));
  };

  const getSubMenuClass = (key) =>
    open === key ? "!bg-red-700 menu-class" : "";

  return (
    <>
      <LayoutHeader />

      <Sidebar collapsed={collapsed} backgroundColor="#231f20">
        <Menu className={`${collapsed ? "mt-6 " : ""}`}>
          {navDetails.map((item) => (
            <SubMenu
              key={item.key}
              label={<span className="text-sm font-medium ">{item.Title}</span>}
              icon={item.icon}
              className={getSubMenuClass(item.key)}
              open={open === item.key}
              onClick={() => handleOpenSubMenu(item.key)}
            >
              {item.children.map((child, idx) => (
                <MenuItem
                  key={idx}
                  component={<Link href={child.path} />}
                  className={`sub-menu-item ${isActive(
                    child.path
                  )} px-4 py-2 text-sm !bg-[#231f20] `}
                >
                  {child.Title}
                </MenuItem>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sidebar>
      <div className={`${!collapsed ? "ml-[16rem] " : "ml-[6rem]"}`} >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f9f9f9",
            p: 3,
            paddingBottom: "90px",
            padding: "10px",
            // marginLeft:'16rem'
          }}
        >
          <CssBaseline />
          <Toolbar />
          {children}
        </Box>

        <Footer />
      </div>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        className="!bg-white"
      >
        <Toolbar>
          <Nav collapsed={collapsed} setCollapsed={setCollapsed} />{" "}
          {/* Your navigation component */}
        </Toolbar>
      </AppBar>
    </>
  );
}
