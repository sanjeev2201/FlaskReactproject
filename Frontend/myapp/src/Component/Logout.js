import axios from "axios";
let isLoggingOut = false;
const Logout = async () => {
  if (isLoggingOut) return;
    isLoggingOut = true;
  try {
    debugger;
    const AccessToken = localStorage.getItem("AccessToken");
    const RefreshToken = localStorage.getItem("RefreshToken");
    const role = localStorage.getItem('role');
    await axios.post(
      "http://localhost:5000/api/logout/",
      { AccessToken, RefreshToken: RefreshToken, role },
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      }
    );
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    localStorage.clear();
    window.location.href = "/login";
  }
};

export default Logout;
