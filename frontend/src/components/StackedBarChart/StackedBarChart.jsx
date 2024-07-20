import React from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-moment";
import moment from 'moment';


const StackedBarChart = ({ expenseData, incomesData, type }) => {
  let data;
  let options;
  if(type==="Monthly"){
    data = {
      labels: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      datasets: [
        {
          label: "Expenses",
          data: expenseData, 
          backgroundColor: "#C8102E",
          borderColor: "#C8102E",
          borderWidth: 1,
        },
        {
          label: "Incomes",
          data: incomesData,
          backgroundColor: "#118C4F",
          borderColor: "#118C4F",
          borderWidth: 1,
        },
      ],
    };
    options = {
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  } else {
     // Sort data first by date and then by amount if dates are equal
   const sortedExpenseData = expenseData
   .map(data => ({ x: new Date(data.x), y: data.y }))
   .sort((a, b) => {
     if (a.x - b.x !== 0) {
       return a.x - b.x;
     }
     return a.y - b.y;
   });

 const sortedIncomeData = incomesData
   .map(data => ({ x: new Date(data.x), y: data.y }))
   .sort((a, b) => {
     if (a.x - b.x !== 0) {
       return a.x - b.x;
     }
     return a.y - b.y;
   });


 data = {
   datasets: [
     {
       label: 'Expenses',
       data: sortedExpenseData,
       borderColor: 'red',
       backgroundColor: 'red',
       tension: 0.1,
     },
     {
       label: 'Income',
       data: sortedIncomeData,
       borderColor: 'green',
       backgroundColor: 'green',
       tension: 0.1,
     },
   ],
 };

 options= {
          scales: {
            x: {
              type: 'time',
              stacked: true,
              time: {
                tooltipFormat: 'll', // Format tooltip date
                unit: 'day', // Adjust to the desired time unit
              },
            },
            y: {
              beginAtZero: true,
              stacked: true,
            },
          },
        }
 
  }




  return (
    <div>
      <h3>{type} Trends</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;
