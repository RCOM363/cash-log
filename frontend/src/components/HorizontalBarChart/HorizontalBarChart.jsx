import React from 'react';
import { Bar } from 'react-chartjs-2';
import "./HorizontalBarChart.css"

function HorizontalBarChart({ data,title }) {

    const colors = [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
        '#FF9F40', // Orange
        '#FF6384', // Red (you can add more colors here)
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
        '#FF9F40'  // Orange
      ]
    

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: ``,
        data: data.map(item => item.total),
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="horizontal-bar-chart">
      <h3>{title} Breakdown</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default HorizontalBarChart;
