import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { parseErrorMessage } from "../../components/ParseErrorMessage";

const initialState = {
  loading: false,
  status: false,
  incomes: [],
};

export const getIncomes = createAsyncThunk(
  "income/getIncomes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("incomes/get-incomes");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const addIncome = createAsyncThunk(
  "income/addIncome",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("incomes/add-income", details);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const deleteIncome = createAsyncThunk(
  "income/deleteIncome",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `incomes/delete-income/${details}`
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

export const updateIncome = createAsyncThunk(
  "income/updateIncome",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `incomes/update-income/${details._id}`,
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

export const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIncomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIncomes.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.incomes = action.payload.data;
      })
      .addCase(getIncomes.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(addIncome.pending, (state) => {
        state.loading = true;
      })
      .addCase(addIncome.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(addIncome.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(deleteIncome.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteIncome.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(deleteIncome.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(updateIncome.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIncome.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(updateIncome.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default incomeSlice.reducer;
