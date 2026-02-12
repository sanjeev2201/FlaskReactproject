import axios from "axios";
let isLoggingOut = false;
const Logout = async () => {
  if (isLoggingOut) return;
    isLoggingOut = true;
  try {
    debugger;
    const access = localStorage.getItem("AccessToken");
    const refresh = localStorage.getItem("RefreshToken");

    await axios.post(
      "http://localhost:8000/api/logout/",
      { refresh },
      {
        headers: {
          Authorization: `Bearer ${access}`,
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
