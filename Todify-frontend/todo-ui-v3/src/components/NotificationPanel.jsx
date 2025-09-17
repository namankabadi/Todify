import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';
import { FaBell } from 'react-icons/fa';
import "../css/notificationPanel.css";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('authenticatedUser');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    if (username) {
      const fetchNotifications = async () => {
        try {
          const data = await AuthService.getNotifications(username);
          setNotifications(data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [username]);

  const removeNotification = (index) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications];
      updatedNotifications.splice(index, 1);
      return updatedNotifications;
    });
  };

  return (
    <div className="notification-panel">
      <div className="title">
        <FaBell className="title-icon" /> Notifications
      </div>
      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : (
        <>
          {notifications.length > 0 ? (
            <div className="notification-scroll">
              <ul className="notification-list">
                {notifications.map((notification, index) => (
                  <li key={index} className="notification-item">
                    <div className="icon"><FaBell /></div>
                    <div className="message">{notification}</div>
                    <div 
                      className="close-btn"
                      onClick={() => removeNotification(index)}
                    >
                      &times;
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="no-notifications">No notifications available.</div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
