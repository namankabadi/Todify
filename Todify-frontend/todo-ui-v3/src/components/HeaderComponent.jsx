// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { isUserLoggedIn, logout } from "../services/AuthService";

// const HeaderComponent = () => {
//   const navigator = useNavigate();
//   const isAuth = isUserLoggedIn();

//   function handleLogout() {
//     logout();
//     navigator('/login');
//   }

//   return (
//     <header>
//       <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between align-items-center">
//         <a href="/" className="navbar-brand">
//           Todify
//         </a>

//         {/* Desktop View Links */}
//         <div className="d-none d-md-flex">
//           <ul className="navbar-nav me-auto">
//             {isAuth && (
//               <li className="nav-item">
//                 <NavLink
//                   to="/todos"
//                   className="nav-link me-3"
//                   activeClassName="active-link"
//                 >
//                   Todos
//                 </NavLink>
//               </li>
//             )}
//           </ul>

//           <ul className="navbar-nav">
//             {!isAuth && (
//               <>
//                 <li className="nav-item">
//                   <NavLink
//                     to="/register"
//                     className="nav-link"
//                     activeClassName="active-link"
//                   >
//                     Register
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink
//                     to="/login"
//                     className="nav-link"
//                     activeClassName="active-link"
//                   >
//                     Login
//                   </NavLink>
//                 </li>
//               </>
//             )}

//             {isAuth && (
//               <li className="nav-item">
//                 <NavLink
//                   to="/login"
//                   className="nav-link"
//                   onClick={handleLogout}
//                   activeClassName="active-link"
//                 >
//                   Logout
//                 </NavLink>
//               </li>
//             )}
//           </ul>
//         </div>

//         {/* Mobile View: Show Register & Login when NOT logged in */}
//         {!isAuth && (
//           <div className="d-md-none">
//             <NavLink to="/register" className="btn btn-sm btn-primary me-2">
//               Register
//             </NavLink>
//             <NavLink to="/login" className="btn btn-sm btn-success">
//               Login
//             </NavLink>
//           </div>
//         )}

//         {/* Mobile View: Only Show Logout Button When Logged In */}
//         {isAuth && (
//           <button
//             className="btn btn-danger btn-sm d-md-none"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         )}
//       </nav>

//       {/* Custom Styles */}
//       <style>
//         {`
//           .navbar-nav .nav-link {
//             transition: color 0.3s ease-in-out, transform 0.2s;
//           }

//           .navbar-nav .nav-link:hover {
//             color: #00adb5;
//             transform: scale(1.05);
//           }

//           .navbar-toggler {
//             border: none;
//             outline: none;
//           }

//           .navbar-brand {
//             font-weight: bold;
//             font-size: 1.5rem;
//           }

//           .active-link {
//             border-bottom: 2px solid #00adb5;
//           }

//           .btn-danger, .btn-primary, .btn-success {
//             padding: 6px 12px;
//             font-size: 0.9rem;
//           }
//         `}
//       </style>
//     </header>
//   );
// };

// export default HeaderComponent;

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  isUserLoggedIn,
  logout,
  getLoggedInUser,
} from "../services/AuthService";
import "../css/header.css";
import profileIcon from "../assets/ProfileIcon.png";
import { isAdminUser } from "../services/AuthService";
const HeaderComponent = () => {
  const navigator = useNavigate();
  const isAuth = isUserLoggedIn();
  const username = getLoggedInUser();

  function handleLogout() {
    logout();
    navigator("/home");
  }

  function UserProfile() {
    navigator("/profile");
  }

  const handleAssignTaskClick = () => {
    navigator("/assign-task");
  };
  const handleView = () => {
    navigator("/usertaskscard");
  };
  const viewAllUsers = () => {
    navigator("/userDetails");
  };
  const handleNotification = () => {
    navigator("/notification");
  };

  const handleUserTaskSummary = () => {
  navigator("/user-task-summary");
};

const handleAdminTaskSummary = () => {
  navigator("/admin-task-summary");
};

  return (
    <header>
      <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between align-items-center">
        <a href="/" className="navbar-brand">
          Todify
        </a>

        <div className="d-none d-md-flex align-items-center">
          <ul className="navbar-nav me-auto d-flex flex-row">
            {/* {isAuth && (
              <li className="nav-item me-3">
                <NavLink to="/todos" className="nav-link">
                  Todos
                </NavLink>
              </li>
            )} */}
          </ul>

          {isUserLoggedIn() && isAdminUser() && (
            <button className="nav-button" onClick={handleAssignTaskClick}>
              Assign Task
            </button>
          )}

          {isUserLoggedIn() && isAdminUser() && (
            <button className="nav-button" onClick={viewAllUsers}>
              Manage Users
            </button>
          )}
          {isUserLoggedIn() && (
            <button className="nav-button" onClick={handleView}>
              View Tasks
            </button>
          )}

          {isUserLoggedIn() && (
            <button className="nav-button" onClick={handleNotification}>
              Notification
            </button>
          )}
          {/* Admin summary */}
          {isUserLoggedIn() && isAdminUser() && (
            <button className="nav-button" onClick={handleAdminTaskSummary}>
              Task Summary (Admin)
            </button>
          )}

          {isUserLoggedIn() && !isAdminUser() && (
            <button className="nav-button" onClick={handleUserTaskSummary}>
              My Task Stats
            </button>
          )}

          <ul className="navbar-nav d-flex flex-row align-items-center">
            {isAuth && (
              <>
                {/* Profile Icon Button */}
                <li className="nav-item me-3">
                  <button
                    style={{
                      backgroundColor: "#212529",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={UserProfile}
                  >
                    <img
                      src={profileIcon}
                      alt="Profile"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    />
                  </button>
                </li>
                {/* Logout Button */}
                <li className="nav-item">
                  <NavLink
                    to="/home"
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </NavLink>
                </li>
              </>
            )}

            {!isAuth && (
              <>
                <li className="nav-item me-3">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile View */}

        {!isAuth ? (
          <div className="d-md-none">
            <NavLink
              to="/register"
              style={{ backgroundColor: "ffffff", color: "white" }}
              className="nav-link nav-button"
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              style={{ color: "white" }}
              className="nav-link nav-button"
            >
              Login
            </NavLink>
          </div>
        ) : (
          <div className="d-md-none d-flex align-items-center">
            {/* Profile on Mobile */}
            {isUserLoggedIn() && isAdminUser() && (
              <button className="nav-button" onClick={handleAssignTaskClick}>
                Assign Task
              </button>
            )}

            {isUserLoggedIn() && isAdminUser() && (
              <button className="nav-button" onClick={viewAllUsers}>
                Manage Users
              </button>
            )}

            {isUserLoggedIn() && (
              <button className="nav-button" onClick={handleView}>
                View Tasks
              </button>
            )}

            {isUserLoggedIn() && (
              <button className="nav-button" onClick={handleNotification}>
                Notification
              </button>
            )}

            <button
              style={{
                backgroundColor: "#212529",
                border: "none",
                padding: "6px 10px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={UserProfile}
            >
              <img
                src={profileIcon}
                alt="Profile"
                style={{ width: "32px", height: "32px", borderRadius: "50%" }}
              />
            </button>

            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default HeaderComponent;
