import { useAuth } from "../../contexts/AuthContext";
import Universities_StudentView from "../../components/universities/Universities_StudentView";
import Universities_EmployeeView from "../../components/universities/Universities_EmployeeView";

export default function Universitites() {
  const { getRole } = useAuth();
  const role = getRole();

  switch (role) {
    case "Student":
      return <Universities_StudentView />;
    case "Employee":
      return <Universities_EmployeeView />;
    case "Admin":
      return <Universities_EmployeeView />;
    default:
      break;
  }

  return (
    <div>
      <h1>Universities</h1>
      <p>This is the Universities page.</p>
    </div>
  );
}
