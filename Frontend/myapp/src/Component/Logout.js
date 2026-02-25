import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("AccessToken");
    localStorage.removeItem("RefreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("profile_image");

    navigate("/login");
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
