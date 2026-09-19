"use client";

import Link from "next/link";
import { useState } from "react";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [message, setMessage] = useState<string | null>(null);

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);

  const [regUser, setRegUser] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setMessage(null);
    setShowLoginPass(false);
    setShowRegPass(false);
    setShowRegConfirm(false);
  }

  function handleLogin() {
    if (!loginUser || !loginPass) {
      setMessage("Please enter both username and password.");
      return;
    }

    setMessage("Account login will be connected when we build authentication.");
  }

  function handleRegister() {
    if (!regUser || !regEmail || !regPass || !regConfirm) {
      setMessage("Fill out all fields to continue.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setMessage("Enter a valid email address.");
      return;
    }

    if (regPass !== regConfirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Account registration will be connected when we build authentication.");
  }

  return (
    <main className="login-page">
      <Link className="login-back" href="/">
        <span aria-hidden="true">←</span>
        Back to Home
      </Link>

      <section className="login-card" aria-labelledby="login-title">
        <header className="login-heading">
          <h1 id="login-title" className="login-brand">
            Serrian Tide
          </h1>
          <p>Begin your journey</p>
        </header>

        <div className="login-tabs" role="tablist" aria-label="Account access">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "is-active" : ""}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "is-active" : ""}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        {message ? <div className="login-message">{message}</div> : null}

        {mode === "login" ? (
          <section className="login-form" aria-label="Login">
            <label className="login-field" htmlFor="login-username">
              <span>
                Username <b aria-hidden="true">*</b>
              </span>
              <input
                id="login-username"
                type="text"
                placeholder="adventurer"
                value={loginUser}
                onChange={(event) => setLoginUser(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleLogin()}
                autoComplete="username"
              />
            </label>

            <label className="login-field" htmlFor="login-password">
              <span>
                Password <b aria-hidden="true">*</b>
              </span>
              <div className="password-field">
                <input
                  id="login-password"
                  type={showLoginPass ? "text" : "password"}
                  value={loginPass}
                  onChange={(event) => setLoginPass(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleLogin()}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPass((value) => !value)}
                  aria-label={showLoginPass ? "Hide password" : "Show password"}
                >
                  {showLoginPass ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button className="login-submit" type="button" onClick={handleLogin}>
              Login
            </button>

            <p className="login-switch">
              New here?{" "}
              <button type="button" onClick={() => switchMode("register")}>
                Create an account
              </button>
            </p>
          </section>
        ) : (
          <section className="login-form" aria-label="Register">
            <label className="login-field" htmlFor="register-username">
              <span>
                Username <b aria-hidden="true">*</b>
              </span>
              <input
                id="register-username"
                type="text"
                placeholder="adventurer"
                value={regUser}
                onChange={(event) => setRegUser(event.target.value)}
                autoComplete="username"
              />
            </label>

            <label className="login-field" htmlFor="register-email">
              <span>
                Email <b aria-hidden="true">*</b>
              </span>
              <input
                id="register-email"
                type="email"
                placeholder="you@realm.com"
                value={regEmail}
                onChange={(event) => setRegEmail(event.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="login-field" htmlFor="register-password">
              <span>
                Password <b aria-hidden="true">*</b>
              </span>
              <div className="password-field">
                <input
                  id="register-password"
                  type={showRegPass ? "text" : "password"}
                  value={regPass}
                  onChange={(event) => setRegPass(event.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPass((value) => !value)}
                  aria-label={showRegPass ? "Hide password" : "Show password"}
                >
                  {showRegPass ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <label className="login-field" htmlFor="register-confirm">
              <span>
                Confirm Password <b aria-hidden="true">*</b>
              </span>
              <div className="password-field">
                <input
                  id="register-confirm"
                  type={showRegConfirm ? "text" : "password"}
                  value={regConfirm}
                  onChange={(event) => setRegConfirm(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleRegister()}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirm((value) => !value)}
                  aria-label={showRegConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showRegConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button className="login-submit" type="button" onClick={handleRegister}>
              Create Account
            </button>

            <p className="login-switch">
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")}>
                Login
              </button>
            </p>
          </section>
        )}

        <footer className="login-footer">
          <button
            type="button"
            onClick={() => setMessage("Password recovery will be added with authentication.")}
          >
            Forgot password?
          </button>
          <span>G.O.D mode</span>
        </footer>
      </section>
    </main>
  );
}
