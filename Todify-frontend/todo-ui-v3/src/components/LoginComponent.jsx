import React, { useState } from "react";
import {
  loginAPICall,
  saveLoggedInUser,
  storeToken,
  refreshTokenAPICall,
} from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigator = useNavigate();

  const handleLoginForm = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMsg("Username/email and password are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await loginAPICall(username, password);
      const token = "Bearer " + response.data.accessToken;
      const role = response.data.role;

      storeToken(token);
      saveLoggedInUser(username, role);

      navigator("/usertaskscard");
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("Invalid credentials. Please try again.");
      } else {
        setErrorMsg("Something went wrong. Please try later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card-header">
          <h2 className="text-center">🔐 Login Form</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleLoginForm}>
            <div className="form-group">
              <label>Username or Email</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username or email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)} required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} required
              />
            </div>

            {errorMsg && <p className="error-text">{errorMsg}</p>}

            <div className="form-group">
              <button
                className="btn btn-primary submit-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "SUBMIT"}
              </button>
            </div>

            <p className="switch-line">
              Don't have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => navigator("/register")}
              >
                Register
              </button>
            </p>
          </form>
        </div>
      </div>

      <style>
        {`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f2f5;
            padding: 20px;
          }

          .login-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            padding: 30px;
            text-align: center;
          }

          .card-header h2 {
            color: #212529;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 15px;
            text-align: left;
          }

          .form-control {
            border: 2px solid #00adb5;
            border-radius: 8px;
            padding: 10px;
            font-size: 1rem;
            transition: border 0.3s ease-in-out;
          }

          .form-control:focus {
            border-color: #00fff5;
            outline: none;
            box-shadow: 0 0 8px rgba(0, 255, 245, 0.4);
          }

          .submit-btn {
            background-color: #00adb5;
            border: none;
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            font-weight: bold;
            transition: background 0.3s ease;
          }

          .submit-btn:hover {
            background-color: #00fff5;
            transform: scale(1.05);
          }

          .submit-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          .error-text {
            color: red;
            font-size: 0.9rem;
            margin-bottom: 10px;
          }

          @media (max-width: 600px) {
            .login-card {
              padding: 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginComponent;
