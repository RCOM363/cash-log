import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./slices/authSlice.js";
import dashboardSliceReducer from "./slices/dashboardSlice.js";
import categorySliceReducer from "./slices/categorySlice.js";
import expenseSliceReducer from "./slices/expenseSlice.js";
import incomeSliceReducer from "./slices/incomeSlice.js";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    dashboard: dashboardSliceReducer,
    category: categorySliceReducer,
    expense: expenseSliceReducer,
    income: incomeSliceReducer,
  },
});

export default store;
