import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { parseErrorMessage } from "../../components/ParseErrorMessage";

const initialState = {
  loading: false,
  status: false,
  categories: [],
};

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `categories/get-categories/${details}`
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

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.categories = action.payload.data;
      })
      .addCase(getCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
