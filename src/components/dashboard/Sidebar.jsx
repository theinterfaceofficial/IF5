import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent.jsx";
import ClientSidebarContent from "./ClientSidebarContent.jsx";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "/Logo.svg";

const SIDEBAR_WIDTH = "16rem";

export default function Sidebar() {
  const { getRole } = useAuth();
  const role = getRole();

  return (
    <motion.aside
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: SIDEBAR_WIDTH, opacity: 1 }}
      exit={{ width: "0%", opacity: 0 }}
      className="border-r border-base-300 bg-base-100/50 min-h-screen flex flex-col gap-y-4 px-2 py-4"
    >
      <img src={Logo} alt="Logo" className="w-1/2 mx-auto" />
      {(role === "Admin" || role === "Employee" || role === "Partner") && (
        <SidebarContent />
      )}
      {(role === "Student" || role === "ImmigrationClient") && (
        <ClientSidebarContent />
      )}
    </motion.aside>
  );
}
