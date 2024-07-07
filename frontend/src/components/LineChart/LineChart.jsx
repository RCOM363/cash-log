import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import "chartjs-adapter-moment";
import moment from 'moment';
import "./LineChart.css"

const LineChart = ({ expenseData, incomeData }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy previous chart instance if it exists
      }

      // Sort data first by date and then by amount if dates are equal
      const sortedExpenseData = expenseData
        .map(data => ({ x: new Date(data.x), y: data.y }))
        .sort((a, b) => {
          if (a.x - b.x !== 0) {
            return a.x - b.x;
          }
          return a.y - b.y;
        });

      const sortedIncomeData = incomeData
        .map(data => ({ x: new Date(data.x), y: data.y }))
        .sort((a, b) => {
          if (a.x - b.x !== 0) {
            return a.x - b.x;
          }
          return a.y - b.y;
        });


      const chartData = {
        datasets: [
          {
            label: 'Expenses',
            data: sortedExpenseData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
          },
          {
            label: 'Income',
            data: sortedIncomeData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
          },
        ],
      };

      // Create the chart instance
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                tooltipFormat: 'll', // Format tooltip date
                unit: 'day', // Adjust to the desired time unit
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [expenseData, incomeData]);

  return (
    <div className='linechart'>
      <canvas ref={chartContainer} />
    </div>
  );
};

export default LineChart;
