import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Route, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";

function isLoggedIn(loggedIn) {
  try {
    const token = localStorage.getItem("token");
    const payload = jwt_decode(token);
    if (payload && loggedIn) return true;
    else return false;
  } catch (err) {
    return false;
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loggedIn } = useContext(UserContext);

  return isLoggedIn(loggedIn) ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <Redirect to="/" />
  );
};

export default PrivateRoute;
