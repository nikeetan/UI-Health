import React from "react";
import { Link } from "react-router-dom";
import { Button, Layout } from "antd";
import "./header.css";

import { LogoutOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { ADMIN, NURSE, PATIENT } from "../../role";

const { Header } = Layout;

const Navbar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const storedUser = AuthService.getUser();
  const isAdmin = storedUser?.role_id === ADMIN;
  const isNurse = storedUser?.role_id === NURSE;
  const isPatient = storedUser?.role_id === PATIENT;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Header style={{ background: "#001529", padding: "0px" }}>
      <div className="navbarContainer">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            style={{ color: "#fff" }}
          >
            Back
          </Button>

          {isAdmin && (
            <>
              <Link to="/admin" style={{ color: "#fff", marginRight: "16px" }}>
                Admin Dashboard
              </Link>
            </>
          )}
          {isNurse && (
            <>
              <Link to="/nurse" style={{ color: "#fff", marginRight: "16px" }}>
                Nurse Dashboard
              </Link>
            </>
          )}
          {isPatient && (
            <>
              <Link
                to="/patient"
                style={{ color: "#fff", marginRight: "16px" }}
              >
                Patient Dashboard
              </Link>
            </>
          )}
        </div>
        <div>
          <Button
            type="link"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: "#fff" }}
          >
            Logout
          </Button>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
