import React from "react";
import { Button } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";

const PatientHomePage = () => {
  const navigate = useNavigate();
  const storedUser = AuthService.getUser();
  const handleUpdatePatient = () => {
    navigate("/patient/update");
  };

  const handleScheduleTime = () => {
    navigate("/patient/schedule");
  };

  const handleViewVaccination = () => {
    navigate("/patient/view");
  };

  return (
    <div className="patient-page">
      <h1 style={{ marginBottom: "50px" }}>Welcome {storedUser?.name ? storedUser.name : ''}</h1>
      <div className="patient">
        <Button
          className="action-button"
          type="primary"
          onClick={handleUpdatePatient}
        >
          Update information
        </Button>
        <Button
          className="action-button"
          type="primary"
          onClick={handleScheduleTime}
        >
          Schedule Vaccination
        </Button>
        <Button
          className="action-button"
          type="primary"
          onClick={handleViewVaccination}
        >
          View information / Cancel Schedule
        </Button>
      </div>
    </div>
  );
};

export default PatientHomePage;
