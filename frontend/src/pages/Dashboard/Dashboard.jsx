import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);
import StackedBarChart from '../../components/StackedBarChart/StackedBarChart';
import HorizontalBarChart from '../../components/HorizontalBarChart/HorizontalBarChart';

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

  const {fullName,email, monthlyTotalExpenses, monthlyTotalIncomes, monthlyExpensesData, monthlyIncomesData,expensesByMonth, incomesByMonth, expensesByCategory, incomesByCategory,monthlyExpensesByCategory,
    monthlyIncomesByCategory } = dashboardData;


  return (
    <div className='dashboard'>
      <div className='cont1'>
        <div>
          <h1>Welcome, {fullName}</h1>
          <p>{email}</p>
        </div>
        <div className='stats'>
          <div className='stat'>
            <h3>Total Expenses this month</h3>
            <h2>&#8377;{monthlyTotalExpenses}</h2>
          </div>
           <div className='stat'>
              <h3>Total Incomes this month</h3>
              <h2>&#8377;{monthlyTotalIncomes}</h2>
            </div>
            <div className='stat'>
            <h3>Net Balance this month</h3>
            <h2>{monthlyTotalIncomes-monthlyTotalExpenses>0?"+":"-"}&#8377;{Math.abs(monthlyTotalIncomes-monthlyTotalExpenses)}</h2>
            </div>
          </div>
        </div>
          <div className='cont2'>
            {
              monthlyExpensesData.length>0 && monthlyIncomesData.length>0 && (
                <div className='graphscont'>
                  <div className="cont1">
                    <StackedBarChart expenseData={monthlyExpensesData} incomesData={monthlyIncomesData} 
                    type={"Daily"}/>
                  </div>
                  <div className='cont2'>
                    <HorizontalBarChart data={monthlyExpensesByCategory} title={"Daily Expenses"}/>
                    <HorizontalBarChart data={monthlyIncomesByCategory} title={"Daily Incomes"}/>
                  </div>
                </div>
              )
            }
            <div className="graphscont">
              <div className="cont1">
                <StackedBarChart expenseData={expensesByMonth} incomesData={incomesByMonth} type="Monthly"/>
              </div>
              <div className='cont2'>
                <HorizontalBarChart data={expensesByCategory} title={"Monthly Expenses"}/>
                <HorizontalBarChart data={incomesByCategory} title={"Monthly Incomes"}/>
              </div>
          </div>
        </div>
    </div>
  );
}

export default Dashboard;
