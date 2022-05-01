import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import io from "socket.io-client";

import { UserContext } from "../contexts/UserContext";
import { SocketContext } from "../contexts/SocketContext";

import st_big from "../media/st_big.png";

function Login({ history }) {
  const { saveUser } = useContext(UserContext);
  const { setSocket } = useContext(SocketContext);

  const [loginErrorClass, setErrorClass] = useState("register-validation-error");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    pass: "",
  });

  const handleChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      method: "PUT",
      body: JSON.stringify(loginInfo),
    }).then((res) => {
      if (!res.ok) setErrorClass("register-validation-error show");
      else {
        const token = res.headers.get("x-auth-token");
        const userInfo = jwt_decode(token);
        localStorage.setItem("token", token);

        const newSocket = io(process.env.REACT_APP_API_URL, {
          query: { token },
        });

        saveUser(userInfo);
        setSocket(newSocket);
        history.push("/dashboard");
      }
    });
  };

  return (
    <div className="login-container">
      <img className="login-logo" src={st_big} alt="Small Talk Logo" />

      <h1 className="login-heading">The Simplest Online Messaging Platform</h1>
      <h1 className="login-heading">Create Groups Chats Without Phone Numbers</h1>

      <div className={loginErrorClass}>
        <p>The sign in information is incorrect.</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-h2">Sign In</h2>

        <input
          className="login-input"
          name="email"
          type="text"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          className="login-input"
          name="pass"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <div className="login-button-container">
          <button className="st-button" type="submit">
            Sign In
          </button>
          <Link className="st-button" to="/register">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
