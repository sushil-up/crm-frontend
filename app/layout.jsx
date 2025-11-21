"use client";

import "@/styles/globals.css";
import { usePathname } from "next/navigation";
import Provider from "@/components/Provider";
import Footer from "@/components/Footer";
import LayoutHeader from "./layoutHeader";
import SideMenuBar from "@/components/SideMenuBar";

import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import "react-toastify/dist/ReactToastify.css";
import UserContextProvider from "@/context/UserContextProvider";
import { UnsavedChangesDialogProvider } from "./utils/customhook/unsavedChageDialogBox";

const RootLayout = ({ children }) => {
  const pathName = usePathname();

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/assets/images/favicon.ico"
          type="image/x-icon"
        />
      </head>
      <body>
        <UserContextProvider>
        <UnsavedChangesDialogProvider>
          <Provider>
            <ErrorBoundary>
              <ToastContainer />
              {pathName === "/auth/signin" ? (
                children
              ) : (
                <>
                  <div className="">
                    <div className="check">
                      <SideMenuBar>{children}</SideMenuBar>
                    </div>
                  </div>
                </>
              )}
            </ErrorBoundary>
          </Provider>
          </UnsavedChangesDialogProvider>
        </UserContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
