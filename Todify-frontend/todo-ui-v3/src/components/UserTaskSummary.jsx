// src/components/UserTaskSummary.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const UserTaskSummary = ({ username }) => {
  const [taskData, setTaskData] = useState({ completed: 0, incomplete: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/usertasks/status-count/${username}`, {
          headers: {
            Authorization: token,
          },
        });
        setTaskData({
          completed: response.data.completed,
          incomplete: response.data.incomplete,
        });
      } catch (error) {
        console.error('Error fetching user task summary:', error);
      }
    };

    fetchData();
  }, [username]);

  const data = {
    labels: ['Completed', 'Incomplete'],
    datasets: [
      {
        data: [taskData.completed, taskData.incomplete],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div>
      <h2>Task Summary for {username}</h2>
      <Pie data={data} />
    </div>
  );
};

export default UserTaskSummary;
