// ProgramsTab.jsx (Updated imports and usage)

import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";

// Import the new modal components
import CreateProgramModal from "../../components/universityDetails/CreateProgramModal"; // Adjust path as needed
import EditProgramModal from "../../components/universityDetails/EditProgramModal"; // Adjust path as needed

export default function ProgramsTab({ university }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${GlobalConfig.apiUrl}/v1/university-programs`,
        {
          params: {
            searchTerm: debouncedSearchTerm,
            pageNumber: pageNumber,
            pageSize: pageSize,
            universityId: university.id,
          },
        }
      );

      setPrograms(response.data.programs);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching university programs:", error);
      // Consider adding a user-facing error notification here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (university?.id) {
      fetchPrograms();
    }
  }, [debouncedSearchTerm, pageNumber, pageSize, university?.id]);

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

  const showCreateProgramModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateProgramModal = (refresh) => {
    setIsCreateModalOpen(false);
    if (refresh) {
      fetchPrograms();
    }
  };

  const showEditProgramModal = (program) => {
    setSelectedProgram(program);
    setIsEditModalOpen(true);
  };

  const closeEditProgramModal = (refresh) => {
    setIsEditModalOpen(false);
    setSelectedProgram(null); // Clear selected program when modal closes
    if (refresh) {
      fetchPrograms();
    }
  };

  return (
    <div className="tab-content border-base-300 p-4">
      <h2 className="text-xl font-semibold mb-4">
        Programs at {university.name}
      </h2>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search programs..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateProgramModal}
        >
          Add Program
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Name</th>
            <th>Duration (Years)</th>
            <th>Status</th>
            <th>Created On</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="4">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {programs.length > 0 ? (
              programs.map((program) => (
                <motion.tr
                  className="cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  key={program.id}
                  onClick={() => showEditProgramModal(program)}
                >
                  <td>{program.name}</td>
                  <td>{program.durationYears}</td>
                  <td>{program.isActive ? "Active" : "Inactive"}</td>
                  <td>{new Date(program.createdOn).toLocaleDateString()}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No programs found for this university.</td>
              </tr>
            )}
          </tbody>
        )}
      </table>

      <div className="flex justify-between items-center mt-4">
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
          <CreateProgramModal
            universityId={university.id} // Pass the universityId to the create modal
            onClose={closeCreateProgramModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && selectedProgram && (
          <EditProgramModal
            program={selectedProgram}
            onClose={closeEditProgramModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
