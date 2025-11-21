"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import FormatIndentDecreaseOutlinedIcon from "@mui/icons-material/FormatIndentDecreaseOutlined";
import FormatIndentIncreaseOutlinedIcon from "@mui/icons-material/FormatIndentIncreaseOutlined";
import UserContext from "@/context/UserContext";
const Nav = ({ collapsed, setCollapsed }) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const { title } = useContext(UserContext);
  const router = useRouter();
  // const userName = session.user.username;
  const [toggleDropdown, setToggleDropdown] = useState(false);
  //for profile dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    signOut();
    router.push("/auth/signin");
  };

  return (
    <>
      <Link
        href="/"
        className={`${
          !collapsed
            ? "flex  gap-2 flex-start pb-3 pt-3 pl-11 bg-white "
            : "flex  gap-2 flex-start pb-3 pt-3  bg-white "
        }`}
      >
        {!collapsed ? (
          <>
            {" "}
            <img
              src="/assets/images/logo.png"
              alt="logo"
              width={115}
              height={115}
              style={{ position: "relative", zIndex: 9999 }}
              className="object-contain "
            />
          </>
        ) : (
          <>
            <img
              src="/assets/images/ace-logo.png"
              alt="logo"
              width={115}
              height={115}
              style={{ position: "relative", zIndex: 9999 }}
              className="object-contain ace-outer"
            />
          </>
        )}
      </Link>
      <nav
        className={`${
          !collapsed
            ? "w-full flex justify-between items-center pl-[5rem]"
            : "w-full flex justify-between items-center pl-[2rem]"
        }`}
      >
        <div className=" text-black capitalize text-xl flex gap-4">
          <div>
            <button
              className="sb-button"
              onClick={() => setCollapsed(!collapsed)}
            >
              {!collapsed ? (
                <FormatIndentDecreaseOutlinedIcon />
              ) : (
                <FormatIndentIncreaseOutlinedIcon />
              )}
            </button>
          </div>
          <span className="!font-bold">{title}</span>
        </div>
        {/* Desktop Navigation */}
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div>
              <Link href="/hourlogs/add" className="black_btn add-hours ">
                Add Hour Logs
              </Link>
            </div>
            <div className="flex items-center border rounded-full pr-4 bg-[#ededed]">
              <div className="menu-basic">
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  {session?.user?.profileImage === null ? (
                    <>
                      <Image
                        src={session?.user.dummyImage}
                        width={37}
                        height={37}
                        className="rounded-full"
                        alt="profile"
                        onClick={() => setToggleDropdown(!toggleDropdown)}
                      />
                      <span className="!font-bold text-black ml-2">
                        {" "}
                        {session?.user?.fullName}
                      </span>
                    </>
                  ) : (
                    <>
                      {" "}
                      <img
                        src={session?.user.profileImage}
                        width={37}
                        height={37}
                        className="rounded-full profile-image-user"
                        alt=""
                        onClick={() => setToggleDropdown(!toggleDropdown)}
                      />
                      <span className="!font-bold text-black ml-2">
                        {" "}
                        {session?.user?.fullName}
                      </span>
                    </>
                  )}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  className="sub-menu-item sub-menu-tab"
                >
                  <MenuItem onClick={handleClose}>
                    <Link
                      href={`/users/list/${currentUserId}`}
                      className="dropdown_link"
                    >
                      My Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    {session?.user ? (
                      <div className="flex gap-3 md:gap-5">
                        <button
                          type="button"
                          onClick={handleSignOut}
                         className="text-red-600"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <>
                        <button type="button" onClick={signIn} className="">
                          Sign in
                        </button>
                      </>
                    )}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;