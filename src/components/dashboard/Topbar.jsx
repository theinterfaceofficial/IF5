import { useSidebar } from "../../contexts/SidebarContext";
import { Sidebar } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AnimatePresence, motion } from "motion/react";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const { toggleSidebar } = useSidebar();
  const { logout, getEmail } = useAuth();
  const email = getEmail();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg border-b border-base-300/50 backdrop-blur-sm">
      <div className="navbar-start">
        <motion.button
          onClick={toggleSidebar}
          className="text-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Sidebar size={20} strokeWidth={2} />
        </motion.button>
      </div>

      <div className="navbar-end">
        <motion.button
          className="avatar avatar-placeholder relative"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-10 h-10 rounded-full ring-2 ring-primary">
            <span className="text-xs font-semibold">
              {email ? email.slice(0, 1).toUpperCase() : "UI"}
            </span>
          </div>
        </motion.button>

        <ul
          className="dropdown dropdown-end menu bg-base-100 rounded-xl shadow-xl border border-base-300/50 p-4 min-w-56 backdrop-blur-sm"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" }}
        >
          <li className="menu-title mb-2">
            <span className="text-base-content/70 text-xs font-medium uppercase tracking-wider">
              Account
            </span>
          </li>
          <li className="mb-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-base-200/50">
              <div className="avatar avatar-placeholder">
                <div className="bg-gradient-to-br from-primary to-primary-focus w-8 h-8 rounded-full">
                  <span className="text-xs font-semibold text-primary-content">
                    {email ? email.slice(0, 1).toUpperCase() : "UI"}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-base-content truncate">
                  {email}
                </p>
              </div>
            </div>
          </li>
          <li>
            <motion.button
              className="btn btn-outline btn-error btn-sm gap-2 justify-start w-full hover:scale-[0.98] transition-transform"
              onClick={handleLogout}
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </motion.button>
          </li>
        </ul>
      </div>
    </div>
  );
}
