import { useState, useEffect } from "react";
import api from "../../utils/service-base"; // Your API utility
import { GlobalConfig } from "../../GlobalConfig"; // Your global configuration
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // Recharts components

// Define some colors for the pie chart segments
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF19A6",
  "#19FFD8",
  "#FF5733",
];

export default function OverviewTab({ selectedCurrency }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for summary metrics
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpectedIncome, setTotalExpectedIncome] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(null);
  const [netProfit, setNetProfit] = useState(null);
  const [netExpectedProfit, setNetExpectedProfit] = useState(null);
  const [incomeExpenseRatio, setIncomeExpenseRatio] = useState(null);

  // Optional: Date range states for the overview tab (can be passed from parent later)
  const [startDate, setStartDate] = useState(null); // e.g., new Date(new Date().getFullYear(), 0, 1) for start of year
  const [endDate, setEndDate] = useState(null); // e.g., new Date() for today

  // State for type-based breakdowns
  const [incomeByType, setIncomeByType] = useState([]);
  const [expensesByType, setExpensesByType] = useState([]);

  // Helper function to format currency for display
  const formatCurrency = (amount, currencyCode) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "USD", // Default to USD if code is not available
    }).format(amount);
  };

  // Helper function to fetch all overview data
  const fetchData = async () => {
    if (!selectedCurrency) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("currencyId", selectedCurrency);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());

    try {
      const endpoints = [
        `/v1/dashboard/finances/total-income?${params.toString()}`,
        `/v1/dashboard/finances/total-expected-income?${params.toString()}`,
        `/v1/dashboard/finances/total-expenses?${params.toString()}`,
        `/v1/dashboard/finances/net-profit?${params.toString()}`,
        `/v1/dashboard/finances/net-expected-profit?${params.toString()}`,
        `/v1/dashboard/finances/income-expense-ratio?${params.toString()}`,
        `/v1/dashboard/finances/income-by-type?${params.toString()}`,
        `/v1/dashboard/finances/expenses-by-type?${params.toString()}`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) => api.get(`${GlobalConfig.apiUrl}${url}`))
      );

      setTotalIncome(responses[0].data);
      setTotalExpectedIncome(responses[1].data);
      setTotalExpenses(responses[2].data);
      setNetProfit(responses[3].data);
      setNetExpectedProfit(responses[4].data);
      setIncomeExpenseRatio(responses[5].data);
      setIncomeByType(responses[6].data.incomeTypeSummaries);
      setExpensesByType(responses[7].data.expenseTypeSummaries);
    } catch (err) {
      console.error("Error fetching overview data:", err);
      setError("Failed to load financial overview data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCurrency, startDate, endDate]); // Re-fetch when currency or date range changes

  if (!selectedCurrency) {
    return (
      <div className="tab-content border-base-300 p-4">
        <p className="text-center text-gray-500">
          Please select a currency to view the financial overview.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="tab-content border-base-300 p-4 text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <p>Loading overview data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content border-base-300 p-4">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  const currentCurrencyCode = totalIncome?.currencyCode || "USD";

  return (
    <div className="tab-content border-base-300 p-4">
      {/* Date Range Selectors */}
      <div className="mb-4 flex justify-end gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setStartDate(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setEndDate(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>
      </div>

      {/* Top row of three cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Income Card */}
        <div className="card border bg-base-100/50 border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Total Received Income</h2>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(totalIncome?.totalAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>

        {/* Total Expected Income Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Total Expected Income</h2>
            <p className="text-3xl font-bold text-info">
              {formatCurrency(
                totalExpectedIncome?.totalAmount,
                currentCurrencyCode
              )}
            </p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Total Expenses</h2>
            <p className="text-3xl font-bold text-error">
              {formatCurrency(totalExpenses?.totalAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Income by Type Chart */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title">Income by Type</h2>
            {incomeByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeByType}
                    dataKey="totalAmount"
                    nameKey="incomeTypeName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {incomeByType.map((entry, index) => (
                      <Cell
                        key={`cell-income-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${formatCurrency(value, currentCurrencyCode)}`,
                      props.payload.incomeTypeName,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                No income data by type for this currency and period.
              </p>
            )}
          </div>
        </div>

        {/* Expenses by Type Chart */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title">Expenses by Type</h2>
            {expensesByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByType}
                    dataKey="totalAmount"
                    nameKey="expenseTypeName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#82ca9d"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {expensesByType.map((entry, index) => (
                      <Cell
                        key={`cell-expense-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${formatCurrency(value, currentCurrencyCode)}`,
                      props.payload.expenseTypeName,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500">
                No expense data by type for this currency and period.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row of three cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Net Profit Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Net Profit (Received)</h2>
            <p
              className={`text-3xl font-bold ${
                netProfit?.netProfitAmount >= 0 ? "text-success" : "text-error"
              }`}
            >
              {formatCurrency(netProfit?.netProfitAmount, currentCurrencyCode)}
            </p>
          </div>
        </div>

        {/* Net Expected Profit Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">
              Net Expected Profit (All Income)
            </h2>
            <p
              className={`text-3xl font-bold ${
                netExpectedProfit?.netProfitAmount >= 0
                  ? "text-success"
                  : "text-error"
              }`}
            >
              {formatCurrency(
                netExpectedProfit?.netProfitAmount,
                currentCurrencyCode
              )}
            </p>
          </div>
        </div>

        {/* Income to Expense Ratio Card */}
        <div className="card bg-base-100/50 border border-primary">
          <div className="card-body">
            <h2 className="card-title text-xl">Income to Expense Ratio</h2>
            {incomeExpenseRatio?.ratio !== null ? (
              <p className="text-3xl font-bold">
                {incomeExpenseRatio?.ratio?.toFixed(2)} : 1
              </p>
            ) : (
              <p className="text-xl font-bold text-warning">
                {incomeExpenseRatio?.message || "Not available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
