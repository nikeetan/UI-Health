import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Layout } from "antd";
import "./App.css";
import Login from "./pages/login/login";
import AuthService from "./services/AuthService";
import NurseList from "./pages/admin/Nurse/nurses";
import NurseUpdate from "./pages/admin/Nurse/updateNurse";
import ViewNurse from "./pages/admin/Nurse/viewNurse";
import AdminHome from "./pages/admin/adminHome";
import RegisterNurse from "./pages/admin/Nurse/CreateNurse";
import VaccineList from "./pages/admin/Vaccine/vaccineList";
import AddVaccine from "./pages/admin/Vaccine/addVaccine";
import Patients from "./pages/admin/patient/allPatient";
import ViewPatient from "./pages/admin/patient/viewPatient";
import { ADMIN, NURSE, PATIENT } from "./role";
import UpdateNurse from "./pages/nurse/updateNurse";
import ViewNurseDetails from "./pages/nurse/nursedetails";
import NurseHomePage from "./pages/nurse/nurseHome";
import ScheduleTimePage from "./pages/nurse/scheduleTime";
import VaccinationRecord from "./pages/nurse/record";
import PatientHomePage from "./pages/patient/patientHome";
import ScheduleVaccination from "./pages/patient/scheduleAppointment";
import UpdatePatient from "./pages/patient/updatePatient";
import Navbar from "./pages/header/header";
import NotFound from "./pages/notFound";
import SignUpPatient from "./pages/login/Signup";
import ViewPatientDetailsID from "./pages/patient/patientDetails";
import UpdateVaccine from "./pages/admin/Vaccine/updateVaccine";

const { Header, Content } = Layout;

const App = () => {
  const [user, setUser] = useState(AuthService.getUser());

  const handleLogin = async (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
  };

  useEffect(() => {
    const storedUser = AuthService.getUser();
    if (!user && storedUser) {
      setUser(storedUser);
    }
  }, [user]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role_id === ADMIN;
  const isNurse = user?.role_id === NURSE;
  const isPatient = user?.role_id === PATIENT;

  return (
    <Router>
      <Layout className="full-height">
        {isAuthenticated && (
          <Header className="header">
            <Navbar handleLogout={handleLogout} />
          </Header>
        )}
        <Content className="content">
          <Routes>
            {isAdmin && (
              <>
                <Route path="/admin/nurse" element={<NurseList />} />
                <Route
                  path="/admin/update-nurse/:id"
                  element={<NurseUpdate />}
                />
                <Route path="/admin/nurse/:id" element={<ViewNurse />} />
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/create/nurse" element={<RegisterNurse />} />
                <Route path="/admin/create/vaccine" element={<AddVaccine />} />
                <Route
                  path="/admin/vaccine/update/:vaccineId"
                  element={<UpdateVaccine />}
                />
                <Route path="/admin/vaccines" element={<VaccineList />} />
                <Route path="/admin/patients" element={<Patients />} />
                <Route
                  path="/admin/patient/:patientId"
                  element={<ViewPatient />}
                />
              </>
            )}
            {isNurse && (
              <>
                <Route path="/nurse/update" element={<UpdateNurse />} />
                <Route
                  path="/nurse/nursedetails"
                  element={<ViewNurseDetails />}
                />
                <Route path="/nurse" element={<NurseHomePage />} />
                <Route path="/nurse/schedule" element={<ScheduleTimePage />} />
                <Route path="/nurse/record" element={<VaccinationRecord />} />
              </>
            )}
            {isPatient && (
              <>
                <Route path="/patient" element={<PatientHomePage />} />
                <Route
                  path="/patient/schedule"
                  element={<ScheduleVaccination />}
                />
                <Route path="/patient/update" element={<UpdatePatient />} />
                <Route
                  path="/patient/view"
                  element={<ViewPatientDetailsID />}
                />
              </>
            )}
            <Route path="/Signup" element={<SignUpPatient />} />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  isAdmin ? (
                    <Navigate to="/admin" />
                  ) : isNurse ? (
                    <Navigate to="/nurse" />
                  ) : (
                    <Navigate to="/patient" />
                  )
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            {isAuthenticated && <Route path="*" element={<NotFound />} />}
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
