import React from "react";
import { Button } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/AuthService";

const NurseHomePage = () => {
  const navigate = useNavigate();
  const storedUser = AuthService.getUser();
  const handleUpdateNurse = () => {
    navigate("/nurse/update");
  };

  const handleScheduleTime = () => {
    navigate("/nurse/schedule");
  };

  const handleScheduleAction = () => {
    navigate("/nurse/nursedetails");
  };

  const handleRecordVaccination = () => {
    navigate("/nurse/record");
  };

  return (
    <div className="nurse-page">
      <h1 style={{ marginBottom: "50px" }}>Welcome {storedUser?.name ? storedUser.name : ''}</h1>
      <div className="nurse">
        <Button
          className="action-button"
          type="primary"
          onClick={handleUpdateNurse}
        >
          Update information
        </Button>
        <Button
          className="action-button"
          type="primary"
          onClick={handleScheduleTime}
        >
          Schedule time
        </Button>
        <Button
          className="action-button"
          type="primary"
          onClick={handleScheduleAction}
        >
          View/Cancel Schedule
        </Button>
        <Button
          className="action-button"
          type="primary"
          onClick={handleRecordVaccination}
        >
          Record Vaccination
        </Button>
      </div>
    </div>
  );
};

export default NurseHomePage;
