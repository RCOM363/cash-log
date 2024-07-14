import { useState, useEffect } from 'react';
import axios from 'axios';
import LineChart from '../../components/LineChart/LineChart';
import BarChart from '../../components/BarChart/BarChart';
import "./Dashboard.css"

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/v1/users/dashboard-data')
      .then((res) => {
        console.log(res.data.data)
        setDashboardData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className='loadercont'><div className='loader'></div></div>;
  if (error) return <div>Error: {error}</div>;

  const {fullName,email, totalExpenses, totalIncomes, expenseData, incomeData,expensesByCategory,
    incomesByCategory } = dashboardData;

  return (
    <div className='dashboard'>
      <div className='cont1'>
        <div>
          <h1>Welcome, {fullName}</h1>
          <p>{email}</p>
        </div>
        <div className='stats'>
          <div className='stat'>
            <h3>Your Total Expenses this month</h3>
            <h2>&#8377;{totalExpenses}</h2>
          </div>
          <div className='stat'>
            <h3>Your Total Incomes this month</h3>
            <h2>&#8377;{totalIncomes}</h2>
          </div>
          <div className='stat'>
            <h3>Your Net Balance this month</h3>
            <h2>{totalIncomes-totalExpenses>0?"+":"-"}&#8377;{Math.abs(totalIncomes-totalExpenses)}</h2>
          </div>
        </div>
      </div>
      {expenseData.length>0 && incomeData.length>0 && (
          <div className='cont2'>
            <div className='graph1'>
              <h3>Monthly Expenses & Incomes</h3>
              <LineChart expenseData={expenseData} incomeData={incomeData}/>
            </div>
            <div className='graphs'>
              <h3>Your Expenditure in different categories</h3>
              <BarChart prop={expensesByCategory}/>
              <h3>Your Earnings in different categories</h3>
              <BarChart prop={incomesByCategory}/>
            </div>
          </div>
        )}
    </div>
  );
}

export default Dashboard;
