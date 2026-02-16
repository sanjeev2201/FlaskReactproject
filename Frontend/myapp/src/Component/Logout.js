import axios from "axios";
let isLoggingOut = false;
const Logout = async () => {
  if (isLoggingOut) return;
    isLoggingOut = true;
  try {
    debugger;
    const access = localStorage.getItem("AccessToken");
    await axios.post(
      "http://localhost:5000/api/logout/",
      { access },
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
