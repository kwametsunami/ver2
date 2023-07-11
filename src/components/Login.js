import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

import LoginLoading from "./LoginLoading";

import FadeIn from "react-fade-in/lib/FadeIn";
import SignedUp from "./SignedUp";

const Login = (props) => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({});

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const login = async (event) => {
    event.preventDefault();

    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      if (props.fromRadio) {
        props.setUser(user);
        props.setUserDetails(user);
        setLoginError(false);
        setLoginSuccess(true);
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      } else {
        setLoginError(false);
        setLoginSuccess(true);
        props.setUser(user);
        props.setHideFooter(true);
        setTimeout(() => {
          props.landingView();
          props.setHideFooter(false);
        }, 1200);
      }
    } catch (error) {
      setLoginError(true);
      setLoginPassword("");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const register = async (event) => {
    event.preventDefault();

    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      if (props.fromRadio) {
        props.setUser(user);
        props.setUserDetails(user);
        setRegisterError(false);
        setRegisterSuccess(true);
        setTimeout(() => {
          props.closeModal();
        }, 1000);
      } else {
        props.setUser(user);
        setRegisterError(false);
        setRegisterSuccess(true);
        setTimeout(() => {
          props.landingView();
          props.setHideFooter(false);
        }, 1200);
      }
    } catch (error) {
      setRegisterError(true);
      setRegisterEmail("");
      setRegisterPassword("");
    }
  };

  const [loginForm, setLoginForm] = useState(true);

  const switchForms = (event) => {
    event.preventDefault();

    setLoginForm(!loginForm);
  };

  return (
    <section className="login">
      {registerSuccess ? (
        <SignedUp />
      ) : loginSuccess ? (
        <LoginLoading />
      ) : (
        <div className="loginSectionContainer">
          <nav className="loginNav">
            <button className="returnToSearch" onClick={props.landingView}>
              <h1 className="title">tr-1.fm</h1>
            </button>
          </nav>
          {loginForm ? (
            <FadeIn className="loginFadeIn">
              <div className="loginContainer">
                <h2>
                  <span id="highlight">log in </span>to your account
                </h2>
                <form className="loginForm" onSubmit={login}>
                  <input
                    type="email"
                    placeholder="email"
                    onChange={(event) => {
                      setLoginEmail(event.target.value);
                    }}
                    className={loginError ? "loginError" : null}
                    required
                  />
                  <input
                    type="password"
                    placeholder="password"
                    onChange={(event) => {
                      setLoginPassword(event.target.value);
                    }}
                    value={loginPassword}
                    className={loginError ? "loginError" : null}
                    required
                  />
                  {loginError ? (
                    <p id="loginError">
                      Hmmm looks like your email or password is incorrect.{" "}
                      <br /> Please try again.
                    </p>
                  ) : null}
                  <p className="signUpText">
                    Not registered? Sign up{" "}
                    <button
                      className="signUpButton"
                      onClick={switchForms}
                      type="button"
                    >
                      here
                    </button>
                  </p>

                  <button className="loginButton" type="submit" onClick={login}>
                    login
                  </button>
                </form>
              </div>
            </FadeIn>
          ) : (
            <div className="signUpContainer">
              <h2>
                <span id="highlight">register</span> a new account
              </h2>
              <form className="registerForm" onSubmit={register}>
                <input
                  type="email"
                  placeholder="email"
                  onChange={(event) => {
                    setRegisterEmail(event.target.value);
                  }}
                  className={registerError ? "registerErrorForm" : ""}
                  required
                />
                <input
                  type="password"
                  placeholder="password"
                  onChange={(event) => {
                    setRegisterPassword(event.target.value);
                  }}
                  className={registerError ? "registerErrorForm" : ""}
                  required
                />
                {registerError ? (
                  <p id="registerError">
                    Hmmm looks like that email is already in use. <br /> Please
                    try logging in or signing up with another email.
                  </p>
                ) : null}
                <p className="loginText">
                  Already have an account? Log in{" "}
                  <button
                    className="backToLoginButton"
                    onClick={switchForms}
                    type="button"
                  >
                    here
                  </button>
                </p>
                <button className="signUpButton" type="submit">
                  register
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Login;
