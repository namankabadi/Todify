// src/components/AdminTaskSummary.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminTaskSummary = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/usertasks/admin/status-summary', {
          headers: {
            Authorization: token,
          },
        });

        const data = response.data;
        const labels = Object.keys(data);
        const completedData = labels.map((date) => data[date].COMPLETED || 0);
        const incompleteData = labels.map((date) => data[date].INCOMPLETE || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Completed',
              data: completedData,
              backgroundColor: '#36A2EB',
            },
            {
              label: 'Incomplete',
              data: incompleteData,
              backgroundColor: '#FF6384',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching admin task summary:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Admin Task Summary</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default AdminTaskSummary;
