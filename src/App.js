import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import AdminLayout from "./Layouts/AdminLayout";
import WorkerLayout from "./Layouts/WorkerLayout"; 

import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";

import Tasks from "./Pages/Tasks";
import Workers from "./Pages/Workers";
import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
import CompletedTasks from "./Pages/CompletedTasks";

import ManageUsers from "./Pages/ManageUsers";
import ManageTasks from "./Pages/ManageTasks";
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import Notice from "./Pages/Notice";

import WorkerTasksAssigned from "./Pages/WorkerTasksAssigned";
import WorkerChat from "./Pages/WorkerChat";
import WorkerProfile from "./Pages/WorkerProfile";
import WorkerCompletedTasks from "./Pages/WorkerCompletedTasks";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Dashboard pages */}
        <Route element={<DashboardLayout />}>
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/completed-tasks" element={<CompletedTasks />} />
        </Route>

         {/* Admin Dashboard Routes */}
         <Route element={<AdminLayout />}>
          <Route path="/admin/notice" element={<Notice />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-tasks" element={<ManageTasks />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        <Route element={<WorkerLayout />}>
         <Route path="/worker/tasks-assigned" element={<WorkerTasksAssigned />} />
         <Route path="/worker/completed-tasks" element={<WorkerCompletedTasks />} />
         <Route path="/worker/chat" element={<WorkerChat />} />
         <Route path="/worker/worker-profile" element={<WorkerProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
// function App() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
//       <h1 className="text-44xl font-bold text-white">Tailwind is working!</h1>
//     </div>
//   );
// }

// export default App;
