import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { parseErrorMessage } from "../../components/ParseErrorMessage";

const initialState = {
  loading: false,
  status: false,
  expenses: [],
};

export const getExpenses = createAsyncThunk(
  "expense/getExpenses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("expenses/get-expenses");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const addExpense = createAsyncThunk(
  "expense/addExpense",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "expenses/add-expense",
        details
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expense/deleteExpense",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `expenses/delete-expense/${details}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expense/updateExpense",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `expenses/update-expense/${details._id}`,
        details.data
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.expenses = action.payload.data;
      })
      .addCase(getExpenses.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(addExpense.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpense.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(deleteExpense.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExpense.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(updateExpense.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default expenseSlice.reducer;
