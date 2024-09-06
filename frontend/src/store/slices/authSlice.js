import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import { parseErrorMessage } from "../../components/ParseErrorMessage";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  status: false,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (details, { rejectWithValue }) => {
    console.log(details);
    try {
      const response = await axiosInstance.post("/users/register", details);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("users/login", details);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const userLogout = createAsyncThunk(
  "auth/userLogout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("users/logout");
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
      return rejectWithValue(parseErrorMessage(error));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
        state.status = false;
      });

    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(userLogin.rejected, (state) => {
        state.loading = false;
        state.status = false;
      });

    builder
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(userLogout.rejected, (state) => {
        state.loading = false;
        state.status = false;
      });
  },
});

export default authSlice.reducer;
