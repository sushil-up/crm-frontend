"use client";
import UserContext from "./UserContext";
import { useState } from "react";
const UserContextProvider = ({ children }) => {
  const [title, setTitle] = useState("Acewebx");

  return (
    <UserContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
