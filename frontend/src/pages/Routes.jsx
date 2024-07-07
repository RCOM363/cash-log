import {Route, createBrowserRouter,createRoutesFromElements} from "react-router-dom";
import App from "../App";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Signin from "./Signin/Signin";
import Layout from "./Layout/Layout";
import Dashboard from "./Dashboard/Dashboard";
import Expenses from "./Expenses/Expenses";
import Incomes from "./Incomes/Incomes";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App/>}>
            <Route path="" element={<Home/>}/>
            <Route path="signup" element={<Signup/>}/>
            <Route path="signin" element={<Signin/>}/>
            <Route path="dashboard" element={<Layout/>}>
                <Route path="" element={<Dashboard/>}/>
                <Route path="expenses" element={<Expenses/>}/>
                <Route path="incomes" element={<Incomes/>}/>
            </Route>
        </Route>
    )
)

export default router;