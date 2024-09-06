import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Signup from './pages/Signup/Signup';
import Signin from './pages/Signin/Signin';
import Layout from './Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Expenses from './pages/Expenses/Expenses';
import Incomes from './pages/Incomes/Incomes';

function App() {

  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");
  return (
      <>
        {!hideNavbar && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="signin" element={<Signin />} />

          {/* Protected Routes */}
          <Route path="dashboard" element={<Layout />}>
            {/* Nested Routes */}
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="incomes" element={<Incomes />} />
          </Route>
        </Routes>
        </>
  );
}



export default App;
