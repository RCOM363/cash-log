import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import chroma from 'chroma-js';  // Import chroma-js for color generation
import "./BarChart.css";

const BarChart = ({ prop }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destroy previous chart instance if it exists
      }

      // Process data into Chart.js format
      const labels = prop.map(data => data.category);
      const data = prop.map(data => data.total);

      // Generate a unique color for each category
      const colorScale = chroma.scale('Set1').colors(labels.length);

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
        labels,
        datasets: [{
          label:`Expenses by Category: ${labels.join(', ')}`,
          data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      };

      // Create the chart instance
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }, [prop]);

  return (
    <div className='barchart'>
      <canvas ref={chartContainer} />
    </div>
  );
};

export default BarChart;
