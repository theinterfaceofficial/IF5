import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateStudentModal from "../../components/students/CreateStudentModal";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // New state to manage the active status filter. `null` represents the "All" option.
  const [isActive, setIsActive] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        searchTerm: debouncedSearchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize,
      };

      // Add the isActive parameter to the request only if it's not null.
      if (isActive !== null) {
        params.isActive = isActive;
      }

      const response = await api.get(`${GlobalConfig.apiUrl}/v1/students`, {
        params: params,
      });

      setStudents(response.data.students);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("An error occurred while fetching students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The useEffect hook now also re-fetches data when the `isActive` state changes.
    fetchStudents();
  }, [debouncedSearchTerm, pageNumber, pageSize, isActive]);

  const handlePrevious = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const showCreateStudentModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateStudentModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchStudents();
    }
  };

  const navigateToStudentDetails = (studentId) => {
    navigate(`${studentId}`);
  };

  // Handler for the select dropdown change
  const handleIsActiveChange = (e) => {
    const value = e.target.value;
    let newIsActive = null;
    if (value === "True") {
      newIsActive = true;
    } else if (value === "False") {
      newIsActive = false;
    }
    // Set page to 1 whenever the filter changes
    setPageNumber(1);
    setIsActive(newIsActive);
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="Students">
      <h1 className="text-2xl font-bold">Manage Students</h1>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center flex-1 gap-2">
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="input"
            value={searchTerm}
            onChange={(e) => {
              setPageNumber(1);
              setSearchTerm(e.target.value);
            }}
          />
          {/* The select element now has a value and onChange handler */}
          <select
            className="select"
            value={
              isActive === null ? "All" : isActive === true ? "True" : "False"
            }
            onChange={handleIsActiveChange}
          >
            <option value="All">All</option>
            <option value="True">Active</option>
            <option value="False">Inactive</option>
          </select>
        </div>

        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateStudentModal}
        >
          Add Student
        </button>
      </div>

      <table className="table text-center">
        <thead className="bg-base-200">
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>Active</th>
            <th>Registered By</th>
            <th>Registration Date</th>
            <th>Counselor Name</th>
            <th>Admission Associate Name</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="10">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="10">No students found.</td>
              </tr>
            ) : (
              students.map((student) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={student.id}
                  onClick={() => navigateToStudentDetails(student.id)}
                >
                  <td>{student.email}</td>
                  <td>{student.firstName}</td>
                  <td>{student.middleName || "-"}</td>
                  <td>{student.lastName}</td>
                  <td>{student.phoneNumber || "-"}</td>
                  <td>{student.isActive ? "Yes" : "No"}</td>
                  <td>{student.registeredByName || "-"}</td>
                  <td>
                    {student.registrationDate
                      ? new Date(student.registrationDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{student.counselorName || "-"}</td>
                  <td>{student.admissionAssociateName || "-"}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        )}
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center py-4">
        <button
          onClick={handlePrevious}
          disabled={pageNumber === 1}
          className="btn btn-sm btn-outline"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {totalPages} ({totalCount} items)
        </span>
        <button
          onClick={handleNext}
          disabled={pageNumber === totalPages || totalPages === 0}
          className="btn btn-sm btn-outline"
        >
          Next
        </button>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateStudentModal onClose={closeCreateStudentModal} />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
