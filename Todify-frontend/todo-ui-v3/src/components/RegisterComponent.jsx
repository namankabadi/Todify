import React, { useState } from "react";
import { registerAPICall } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

const RegisterComponent = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigator = useNavigate();

  // ✅ Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least 1 uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least 1 lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least 1 number";
    } else if (!/[@$!%*?&]/.test(password)) {
      newErrors.password = "Password must contain at least 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Form Submit
  function handleRegistrationForm(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const register = { name, username, email, password };
    registerAPICall(register)
      .then((response) => {
        console.log(response.data);
        navigator("/login");
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="card-header">
          <h2 className="text-center">📝 User Registration:</h2>
        </div>

        <div className="card-body">
          <form onSubmit={handleRegistrationForm}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary submit-btn">
                🚀 SUBMIT
              </button>
            </div>
            <p className="switch-line">
              Already have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => navigator("/login")}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          .register-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f0f2f5;
            padding: 20px;
          }

          .register-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 420px;
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

          .error-text {
            color: red;
            font-size: 0.85rem;
            margin-top: 5px;
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

          @media (max-width: 600px) {
            .register-card {
              padding: 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterComponent;
