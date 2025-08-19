import { GlobalConfig } from "../../GlobalConfig";
import { useState, useEffect } from "react";
import api from "../../utils/service-base";
import useDebounce from "../../hooks/useDebounce";
import { AnimatePresence, motion } from "motion/react";
import CreateExpenseModal from "../../components/expenses/CreateExpenseModal";
import EditExpenseModal from "../../components/expenses/EditExpenseModal";
import DashboardPage from "../../components/dashboard/DashboardPage";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [currencies, setCurrencies] = useState([]); // State for lookup data
  const [expenseTypes, setExpenseTypes] = useState([]); // State for lookup data
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch expenses based on search/pagination
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${GlobalConfig.apiUrl}/v1/expenses`, {
        params: {
          searchTerm: debouncedSearchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        },
      });

      setExpenses(response.data.expenses);
      setTotalCount(response.data.totalCount);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch lookup data (currencies, expense types)
  const fetchLookupData = async () => {
    try {
      const [currenciesResponse, expenseTypesResponse] = await Promise.all([
        api.get(`${GlobalConfig.apiUrl}/v1/currencies`),
        api.get(`${GlobalConfig.apiUrl}/v1/expense-types`),
      ]);
      setCurrencies(currenciesResponse.data.currencies);
      setExpenseTypes(expenseTypesResponse.data.expenseTypes);
    } catch (error) {
      console.error("Error fetching lookup data:", error);
    }
  };

  useEffect(() => {
    fetchLookupData(); // Fetch lookup data once on mount
  }, []);

  useEffect(() => {
    fetchExpenses(); // Fetch expenses whenever search/pagination changes
  }, [debouncedSearchTerm, pageNumber, pageSize]);

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

  const showCreateExpenseModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateExpenseModal = (refresh) => {
    setIsCreateModalOpen(false);

    if (refresh) {
      fetchExpenses();
    }
  };

  const showEditExpenseModal = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const closeEditExpenseModal = (refresh) => {
    setIsEditModalOpen(false);

    setSelectedExpense(null);

    if (refresh) {
      fetchExpenses();
    }
  };

  return (
    <DashboardPage title="Expenses">
      <h1 className="text-2xl font-bold">Manage Expenses</h1>

      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder="Search expenses..."
          className="input"
          value={searchTerm}
          onChange={(e) => {
            setPageNumber(1);
            setSearchTerm(e.target.value);
          }}
        />
        <button
          className="btn btn-primary btn-outline"
          onClick={showCreateExpenseModal}
        >
          Add Expense
        </button>
      </div>

      <table className="table table-zebra text-center">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Date</th>
            <th>Description</th>
            <th>Expense Type</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="6">
                <div className="loading loading-spinner"></div>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {expenses.map((expense) => (
              <motion.tr
                className="cursor-pointer"
                whileHover={{ scale: 1.01 }}
                key={expense.id}
                onClick={() => showEditExpenseModal(expense)}
              >
                <td>{expense.amount.toFixed(2)}</td> {/* Format amount */}
                <td>{expense.currencyCode || "N/A"}</td>{" "}
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.description || "-"}</td>
                <td>{expense.expenseTypeName || "N/A"}</td>{" "}
              </motion.tr>
            ))}
          </tbody>
        )}
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center">
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
          <CreateExpenseModal
            currencies={currencies}
            expenseTypes={expenseTypes}
            onClose={closeCreateExpenseModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <EditExpenseModal
            expense={selectedExpense}
            currencies={currencies}
            expenseTypes={expenseTypes}
            onClose={closeEditExpenseModal}
          />
        )}
      </AnimatePresence>
    </DashboardPage>
  );
}
