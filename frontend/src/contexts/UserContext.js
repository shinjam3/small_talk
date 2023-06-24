import React, { createContext, useReducer, useEffect } from 'react';
import userReducer from '../reducers/userReducer';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    friends: [],
    notifications: [],
  },
  isAuthenticating: true,
  loggedIn: null,
};

export const UserContext = createContext(initialState);

// provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    getLoggedIn();
  }, []);

  // actions
  const getLoggedIn = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/loggedin`, {
      credentials: 'include',
    });
    const isLoggedIn = await res.json();
    dispatch({
      type: 'LOGIN_STATUS',
      payload: isLoggedIn,
    });
  };

  const saveUser = (userInfo) => {
    dispatch({
      type: 'SAVE_USER',
      payload: userInfo,
    });

    dispatch({
      type: 'LOGIN_STATUS',
      payload: true,
    });
  };

  const signOut = () => {
    dispatch({
      type: 'SAVE_USER',
      payload: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        pass: '',
        friends: [],
        notifications: [],
      },
    });

    dispatch({
      type: 'LOGIN_STATUS',
      payload: false,
    });
  };

  const getCurrentUserInfo = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/current-user`, {
      credentials: 'include',
    });
    const resJson = await res.json();
    dispatch({
      type: 'SAVE_USER',
      payload: resJson,
    });
  };

  const removeFriend = async (friendId) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/remove-friend`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ friendId }),
    });
    const resJson = await res.json();
    dispatch({
      type: 'SAVE_USER',
      payload: resJson,
    });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        loggedIn: state.loggedIn,
        isAuthenticating: state.isAuthenticating,
        saveUser,
        signOut,
        getCurrentUserInfo,
        removeFriend,
        getLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
