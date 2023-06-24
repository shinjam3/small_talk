import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import './styles/App.css';
import './styles/headerStyles.css';
import './styles/loginStyles.css';
import './styles/messagesStyles.css';
import './styles/connectStyles.css';
import './styles/profileNavStyles.css';
import './styles/notificationStyles.css';
import './styles/editStyles.css';
import './styles/settingsStyles.css';
import './styles/groupStyles.css';
import './styles/groupSettingsStyles.css';
import './styles/groupAddMemberStyles.css';

import { SocketProvider } from './contexts/SocketContext';
import { UserProvider } from './contexts/UserContext';
import { GroupProvider } from './contexts/GroupContext';
import { MessagesProvider } from './contexts/MessagesContext';

import NotFound from './components/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import Messages from './components/Messages';
import Group from './components/Group';
import Connect from './components/Connect';
import Friends from './components/Friends';
import Profile from './components/Profile';
import AccountDeleted from './components/AccountDeleted';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <GroupProvider>
          <MessagesProvider>
            <Router>
              <Routes>
                <Route path="/dashboard" element={<Navigate to="/dashboard/messages" />} />

                <Route path="/dashboard/messages" element={<PrivateRoute component={<Messages />} />} />

                <Route path="/dashboard/connect" element={<PrivateRoute component={<Connect />} />} />

                <Route path="/dashboard/friends" element={<PrivateRoute component={<Friends />} />} />

                <Route path="/dashboard/profile" element={<PrivateRoute component={<Profile />} />} />

                <Route path="/group/:groupId" element={<PrivateRoute component={<Group />} />} />

                <Route path="/account-deleted" element={<PrivateRoute component={<AccountDeleted />} />} />

                <Route path="/" element={<PrivateRoute root={true} component={<Login />} />} />

                <Route path="/register" element={<Register />} />

                <Route path="/not-found" element={<NotFound />} />

                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Routes>
            </Router>
          </MessagesProvider>
        </GroupProvider>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;
