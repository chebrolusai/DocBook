import React, { useState, useEffect, FormEvent } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/login_slice";
import { RootState } from "../store";
import { selectUser } from "../store/slices/login_slice";
import DocBookHeader from "../components/DocBookHeader";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  if (useSelector(selectUser) != null) {
    window.location.href = "/profile";
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [error]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      dispatch(login({ type: data, loggedIn: true }));

      setLoginSuccess(true);
      setTimeout(() => {
        setLoginSuccess(false);
        window.location.href = "/profile";
      }, 1000);
      setError(null);
    } catch (error) {
      console.error("Login error:", (error as Error).message);

      setError("Username or Password is invalid");
    }
  };

  return (
    <div className="body">
      <DocBookHeader></DocBookHeader>
      <div className="centerWrap">
        {error && (
          <div
            className="alert alert-danger alert-top"
            role="alert"
            style={{ zIndex: "1" }}
          >
            {error}
          </div>
        )}

        {loginSuccess && (
          <div
            className="alert alert-success alert-top"
            role="alert"
            style={{ zIndex: "1" }}
          >
            Login successful! Redirecting...
          </div>
        )}
        <div className="containerWrap glassEffect">
          <form id="loginForm" onSubmit={handleLogin}>
            <div className="loginText">Account Login</div>
            <label htmlFor="username">Username</label>
            <div className="underline-input">
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="underline-input">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="alignButton">
              <button type="submit">Login</button>
            </div>
            <label>New user?</label>
          </form>
          <div className="registerContainer">
            <div className="patient">
              <a href="../registerpatient/">Register as a patient</a>
            </div>
            <div className="doctor">
              <a href="/registerdoctor">Register as a doctor</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
