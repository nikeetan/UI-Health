import React from "react";
import { Button, Tooltip } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";

const NurseAdminPage = () => {
  const navigate = useNavigate();
  const handleRegisterNurse = () => {
    navigate("/admin/create/nurse");
  };

  const handleNurseInfo = () => {
    navigate("/admin/nurse");
  };

  const handleAddVaccine = () => {
    navigate("/admin/create/vaccine");
  };

  const handleVaccineInfo = () => {
    navigate("/admin/vaccines");
  };

  const handleViewPatientInfo = () => {
    navigate("/admin/patients");
  };

  return (
    <div className="nurse-admin-page">
      <h1 style={{ marginBottom: "50px" }}>Welcome Admin</h1>
      <div className="nurse-admin">
        <Button
          className="action-button"
          type="primary"
          onClick={handleRegisterNurse}
        >
          Register a Nurse
        </Button>
        <Tooltip
          title={"Click here to View, Update or Delete nurse record"}
          placement="right"
        >
          <Button
            className="action-button"
            type="primary"
            onClick={handleNurseInfo}
          >
            Nurse Info
          </Button>
        </Tooltip>
        <Button
          className="action-button"
          type="primary"
          onClick={handleAddVaccine}
        >
          Add Vaccine
        </Button>
        <Tooltip
          title={"Click here to View, Update Vacine record"}
          placement="right"
        >
          <Button
            className="action-button"
            type="primary"
            onClick={handleVaccineInfo}
          >
            Vaccine Info
          </Button>
        </Tooltip>
        <Button
          className="action-button"
          type="primary"
          onClick={handleViewPatientInfo}
        >
          View Patient Info
        </Button>
      </div>
    </div>
  );
};

export default NurseAdminPage;
