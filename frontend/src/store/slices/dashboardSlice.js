import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import { parseErrorMessage } from "../../components/ParseErrorMessage";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  status: false,
  dashboardData: {
    fullName: "",
    email: "",
    monthlyTotalExpenses: 0,
    monthlyTotalIncomes: 0,
    monthlyExpensesData: [],
    monthlyIncomesData: [],
    monthlyExpensesByCategory: [],
    monthlyIncomesByCategory: [],
    yearlyTotalExpenses: 0,
    yearlyTotalIncomes: 0,
    expensesByMonth: [],
    incomesByMonth: [],
    expensesByCategory: [],
    incomesByCategory: [],
  },
};

export const getDashboardData = createAsyncThunk(
  "dashboard/getDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("users/dashboard-data");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.dashboardData = action.payload.data;
      })
      .addCase(getDashboardData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
