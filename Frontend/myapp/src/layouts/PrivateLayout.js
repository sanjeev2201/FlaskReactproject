import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";

export default function PrivateLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}
