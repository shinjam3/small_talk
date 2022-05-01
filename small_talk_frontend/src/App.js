import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import "./styles/App.css";
import "./styles/headerStyles.css";
import "./styles/loginStyles.css";
import "./styles/messagesStyles.css";
import "./styles/connectStyles.css";
import "./styles/profileNavStyles.css";
import "./styles/notificationStyles.css";
import "./styles/editStyles.css";
import "./styles/settingsStyles.css";
import "./styles/groupStyles.css";
import "./styles/groupSettingsStyles.css";
import "./styles/groupAddMemberStyles.css";

import { SocketProvider } from "./contexts/SocketContext";
import { UserProvider } from "./contexts/UserContext";
import { GroupProvider } from "./contexts/GroupContext";
import { MessagesProvider } from "./contexts/MessagesContext";

import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import Messages from "./components/Messages";
import Group from "./components/Group";
import Connect from "./components/Connect";
import Friends from "./components/Friends";
import Profile from "./components/Profile";
import AccountDeleted from "./components/AccountDeleted";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <SocketProvider>
      <UserProvider>
        <GroupProvider>
          <MessagesProvider>
            <Router>
              <Switch>
                <PrivateRoute path="/dashboard/messages" exact={true} component={Messages} />

                <PrivateRoute path="/dashboard/connect" exact={true} component={Connect} />

                <PrivateRoute path="/dashboard/friends" exact={true} component={Friends} />

                <PrivateRoute path="/dashboard/profile" exact={true} component={Profile} />

                <PrivateRoute path="/group/:id" exact={true} component={Group} />

                <Route path="/register" render={(props) => <Register {...props} />} />

                <Route path="/not-found" render={(props) => <NotFound {...props} />} />

                <Route path="/account-deleted" render={(props) => <AccountDeleted {...props} />} />

                <Route exact path="/" component={Login} />

                <Redirect from="/dashboard" to="/dashboard/messages" />

                <Redirect to="/not-found" />
              </Switch>
            </Router>
          </MessagesProvider>
        </GroupProvider>
      </UserProvider>
    </SocketProvider>
  );
}

export default App;
