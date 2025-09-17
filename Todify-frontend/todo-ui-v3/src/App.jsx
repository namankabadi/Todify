import "./App.css";
import ListTodoComponent from "./components/ListTodoComponent";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import TodoComponent from "./components/TodoComponent";
import RegisterComponent from "./components/RegisterComponent";
import LoginComponent from "./components/LoginComponent";
import { isUserLoggedIn } from "./services/AuthService";
import UserList from "./components/UserList";
import UserProfile from "./components/UserProfile";
// import AdminTaskAssign from "./components/AdminTaskAssign";
// import UserTaskList from "./components/UserTask";
import UserTasks from "./components/UserTasks";
import UserTasksCard from "./components/UserTasksCard";
import HomeBody from "./components/HomeBody";
import NotificationPanel from "./components/NotificationPanel";
import UserTaskSummary from "./components/UserTaskSummary";
import AdminTaskSummary from "./components/AdminTaskSummary";

function App() {
  function AuthenticatedRoute({ children }) {
    const isAuth = isUserLoggedIn();
    if (isAuth) {
      return children;
    }
    return <Navigate to="/"></Navigate>;
  }
  return (
    <>
      <BrowserRouter>
        <div className="page-container">
          <HeaderComponent />
          <div className="content-wrap">
            <Routes>
              {/* http://localhost:8080 */}
              <Route path="/" element={<HomeBody />}></Route>
              {/* http://localhost:8080/todos */}

              <Route
                path="/todos"
                element={
                  <AuthenticatedRoute>
                    <ListTodoComponent />
                  </AuthenticatedRoute>
                }
              ></Route>

              {/* http://localhost:8080/add-todo */}
              <Route
                path="/add-todo"
                element={
                  <AuthenticatedRoute>
                    <TodoComponent />
                  </AuthenticatedRoute>
                }
              ></Route>

              {/* http://localhost:8080/update-todo/1 */}
              <Route
                path="/update-todo/:id"
                element={
                  <AuthenticatedRoute>
                    <TodoComponent />
                  </AuthenticatedRoute>
                }
              ></Route>
              {/* http://localhost:8080/register */}
              <Route path="/register" element={<RegisterComponent />}></Route>
              <Route path="/userDetails" element={<UserList />}></Route>
              {/* http://localhost:8080/login */}
              <Route path="/login" element={<LoginComponent />}></Route>
              <Route path="/profile" element={<UserProfile />} />
              {/* <Route path="/admin/assign-task" element={<AdminTaskAssign />} /> */}
              {/* <Route path="/user/tasks" element={<UserTaskList />} /> */}
              <Route path="/usertaskscard" element={<UserTasksCard />} />
              <Route path="/notification" element={<NotificationPanel />} />
              <Route path="/home" element={<HomeBody />} />
              <Route path="/assign-task" element={
                <AuthenticatedRoute>
                  <UserTasks />
                </AuthenticatedRoute>
              } />
              <Route path="/user-task-summary" element={<UserTaskSummary />} />
              <Route path="/admin-task-summary" element={<AdminTaskSummary />} />

            </Routes>
          </div>

          <FooterComponent />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
