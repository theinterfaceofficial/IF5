import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateImmigrationClientModal from "../../components/immigrationClients/CreateImmigrationClientModal";
import DashboardPage from "../../components/dashboard/DashboardPage";
import { useNavigate } from "react-router-dom";

export default function ImmigrationClients() {
  const [immigrationClients, setImmigrationClients] = useState([]);
  const [employees, setEmployees] = useState([]); // New state for employees
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isActive, setIsActive] = useState(null);
  const [registeredById, setRegisteredById] = useState(null); // New state for 'registered by' filter
  const [startDate, setStartDate] = useState(""); // New state for start date
  const [endDate, setEndDate] = useState(""); // New state for end date

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/employees`);
      setEmployees(response.data.employees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchImmigrationClients = async () => {
    try {
      setLoading(true);
      const params = {
        searchTerm: debouncedSearchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize,
      };

      if (isActive !== null) {
        params.isActive = isActive;
      }
      if (registeredById !== null) {
        params.registeredById = registeredById;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }

      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/immigration-clients`,
        {
          params: params,
        }
      );

      setImmigrationClients(response.data.clients);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(
        "An error occurred while fetching immigration clients: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImmigrationClients();
  }, [
    debouncedSearchTerm,
    pageNumber,
    pageSize,
    isActive,
    registeredById,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const showCreateImmigrationClientModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateImmigrationClientModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchImmigrationClients();
    }
  };

  const navigateToClientDetails = (clientId) => {
    navigate(`${clientId}`);
  };

  const handleIsActiveChange = (e) => {
    const value = e.target.value;
    let newIsActive = null;
    if (value === "True") {
      newIsActive = true;
    } else if (value === "False") {
      newIsActive = false;
    }
    setPageNumber(1);
    setIsActive(newIsActive);
  };

  const handleRegisteredByChange = (e) => {
    const value = e.target.value;
    const newRegisteredById = value === "All" ? null : value;
    setPageNumber(1);
    setRegisteredById(newRegisteredById);
  };

  const handleStartDateChange = (e) => {
    setPageNumber(1);
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setPageNumber(1);
    setEndDate(e.target.value);
  };

  if (error) {
    return (
      <DashboardPage title="Error">
        <p className="text-red-500 text-center">{error}</p>
      </DashboardPage>
    );
  }

  return (
    <DashboardPage title="Immigration Clients">
      <h1 className="text-2xl font-bold">Manage Immigration Clients</h1>

      <div className="flex items-center justify-between py-2 gap-2">
        <input
          type="text"
          placeholder="Search immigration clients by name or email..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
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
        <select
          className="select"
          value={registeredById || "All"}
          onChange={handleRegisteredByChange}
        >
          <option value="All">All Registered By</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.fullName}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="input"
          value={startDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          className="input"
          value={endDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateImmigrationClientModal}
        >
          Add Immigration Client
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra text-center ">
          <thead>
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
              {immigrationClients.length === 0 ? (
                <tr>
                  <td colSpan="10">No immigration clients found.</td>
                </tr>
              ) : (
                immigrationClients.map((client) => (
                  <motion.tr
                    className="cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    key={client.id}
                    onClick={() => navigateToClientDetails(client.id)}
                  >
                    <td>{client.email}</td>
                    <td>{client.firstName}</td>
                    <td>{client.middleName || "-"}</td>
                    <td>{client.lastName}</td>
                    <td>{client.phoneNumber || "-"}</td>
                    <td>{client.isActive ? "Yes" : "No"}</td>
                    <td>{client.registeredByName || "-"}</td>
                    <td>
                      {client.registrationDate
                        ? new Date(client.registrationDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>{client.counselorName || "-"}</td>
                    <td>{client.admissionAssociateName || "-"}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

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
          <CreateImmigrationClientModal
            onClose={closeCreateImmigrationClientModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
