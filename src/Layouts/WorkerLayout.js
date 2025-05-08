import React from "react";
import WorkerNavbar from "../Components/WorkerNavbar";
import { Outlet } from "react-router-dom";

const WorkerLayout = () => {
  return (
    <>
      <WorkerNavbar />
      <Outlet />
    </>
  );
};

export default WorkerLayout;
