import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./Layouts/PublicLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import AdminLayout from "./Layouts/AdminLayout";
import WorkerLayout from "./Layouts/WorkerLayout"; 

import Home from "./Pages/Home";
import About from "./Pages/About";
import Services from "./Pages/Services";
import HelpCenter from "./Pages/HelpCenter";
import TermsAndConditions from "./Pages/TermsAndConditions";
import Registration from "./Pages/Registration";
import Login from "./Pages/Login";

import Tasks from "./Pages/Tasks";
import FindWorkers from "./Pages/FindWorkers";
import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
import CompletedTasks from "./Pages/CompletedTasks";
import Newtasks from "./Pages/Newtasks";
import ViewProfile from "./Pages/ViewProfile";

import ManageUsers from "./Pages/ManageUsers";
import AdminReport from "./Pages/AdminReport";
import AdminTermsConditions from "./Pages/AdminTermsConditions";
import Notice from "./Pages/Notice";

import WorkerTasksAssigned from "./Pages/WorkerTasksAssigned";
import WorkerChat from "./Pages/WorkerChat";
import WorkerProfile from "./Pages/WorkerProfile";
import AvailabilityCalendar from "./Pages/AvailabilityCalendar";
import ReviewRating from "./Pages/ReviewRating";
import WorkerReport from "./Pages/WorkerReport";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/view-terms" element={<TermsAndConditions />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Dashboard pages */}
        <Route element={<DashboardLayout />}>
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/find-workers" element={<FindWorkers />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/completed-tasks" element={<CompletedTasks />} />
          <Route path="/new-tasks" element={<Newtasks />} />
          <Route path="/view-profile/:userId" element={<ViewProfile />} />

        </Route>

         {/* Admin Dashboard Routes */}
         <Route element={<AdminLayout />}>
          <Route path="/admin/notice" element={<Notice />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/admin-report" element={<AdminReport />} />
          <Route path="/admin/terms" element={<AdminTermsConditions />} />
        </Route>

        <Route element={<WorkerLayout />}>
         <Route path="/worker/tasks-assigned" element={<WorkerTasksAssigned />} />
         <Route path="/worker/worker-chat" element={<WorkerChat />} />
         <Route path="/worker/worker-profile" element={<WorkerProfile />} />
         <Route path="/worker/availability-calendar" element={<AvailabilityCalendar />} />
         <Route path="/worker/review-rating" element={<ReviewRating />} />
         <Route path="/worker/worker-report" element={<WorkerReport />} />
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
