import React from "react";
import UserNavbar from "../Components/UserNavbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};

export default DashboardLayout;
