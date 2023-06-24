import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { SocketContext } from '../contexts/SocketContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ root, component }) => {
  const { socket, createSocket } = useContext(SocketContext);
  const { loggedIn, isAuthenticating } = useContext(UserContext);

  if (root && !loggedIn && !isAuthenticating) return component;
  else if (root && loggedIn && !isAuthenticating) return <Navigate to="/dashboard" />;
  else if (loggedIn && !isAuthenticating) {
    if (!Object.keys(socket).length) createSocket();
    return component;
  } else if (loggedIn === null || isAuthenticating === true) return null;
  else return <Navigate to="/" />;
};

export default PrivateRoute;
